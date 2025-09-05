import User from '../Models/userModels.js';
import Conversation from '../Models/conversationModels.js'; // make sure this is imported

export const getUserBySearch = async (req, res) => {
    try {
        const search = req.query.search?.trim();

        if (!search) {
            return res.status(200).json({ success: true, users: [] });
        }

        // Build base conditions
        const conditions = {
            $or: [
                { fullname: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } }
            ]
        };

        // Exclude current user if middleware sets req.user
        if (req.user?._id) {
            conditions._id = { $ne: req.user._id };
        }

        // Fetch users excluding password field
        const users = await User.find(conditions).select("-password");

        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("🔥 Search error:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



// Get current chatters
export const getCurrentchatters = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not logged in" });
        }

        const currentUserID = req.user._id;
        const currentchatters = await Conversation.find({ participants: currentUserID })
            .sort({ updatedAt: -1 });

        if (!currentchatters.length) {
            return res.status(200).json({ success: true, users: [] });
        }

        const participantsIDs = currentchatters.flatMap(conversation =>
            conversation.participants.filter(id => id.toString() !== currentUserID.toString())
        );

        const uniqueIDs = [...new Set(participantsIDs.map(id => id.toString()))];
        const users = await User.find({ _id: { $in: uniqueIDs } }).select("-password -email");

        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("🔥 Chatters error:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
