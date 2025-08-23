import User from '../Models/userModels.js';
import Conversation from '../Models/conversationModels.js'; // make sure this is imported

// Search users
export const getUserBySearch = async (req, res) => {
    try {
        // Match frontend param name: "search"
        const search = req.query.search?.trim();

        if (!search) {
            return res.status(200).json({ success: true, users: [] });
        }

        // Exclude current user if available
        const currentUserID = req.user?._id;

        const users = await User.find({
            $and: [
                {
                    $or: [
                        { fullname: { $regex: search, $options: "i" } },
                        { username: { $regex: search, $options: "i" } }
                    ]
                },
                currentUserID ? { _id: { $ne: currentUserID } } : {}
            ]
        }).select("-password");

        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("🔥 Search error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Get current chatters
export const getCurrentchatters = async (req, res) => {
    try {
        const currentUserID = req.user._id;  // ✅ fixed

        const currentchatters = await Conversation.find({
            participants: currentUserID
        }).sort({ updatedAt: -1 });

        if (!currentchatters || currentchatters.length === 0) {
            return res.status(200).json({ success: true, users: [] });
        }

        // collect other participants
        const participantsIDs = currentchatters.flatMap(conversation =>
            conversation.participants.filter(id => id.toString() !== currentUserID.toString())
        );

        const uniqueIDs = [...new Set(participantsIDs.map(id => id.toString()))];

        const users = await User.find({ _id: { $in: uniqueIDs } })
            .select("-password -email");

        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("🔥 Chatters error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
