import User from '../Models/userModels.js';

export const getUserBySearch=async(req,res)=>{
    try{
        const search = req.query.search || '';
        const currentUserID= req.user._conditions._id;
        const user=await User.find({
            $and:[
                {
                    $or:[
                        {userName:{$regex:'.*'+search+'.*',$options:'i'}},
                         {fullName:{$regex:'.*'+search+'.*',$options:'i'}}
                    ]
                },{
                    _id:{$ne:currentUserID}
                }
            ]
        }).select('-password').select('email')
        res.status(200).send(user)

    }
    catch(error){
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error);
    }
}

export const getCurrentchatters=async(req,res)=>{
    try{
       const currentUserID= req.user._conditions._id;
       const currentchatters= await Conversation.find({
        participants:currentUserID
       }).sort({
        updateAt: -1
       });
       if(!currentchatters||currentchatters.length===0) return res.status(200).send([]);
       const participantsIDs = currentchatters.reduce((ids,conversation)=>{
        const otherparticipants = conversation.participants.filter(id=>id!=currentUserID);
        return [...ids,...otherparticipants]

       })
       const otherparticipantsIDs=participantsIDs.filter(id=>id.toString()!==currentUserID.toString());
       const user= await User.find({_id:{$in:otherparticipantsIDs}}).select("-password").select("-email");
       const users = otherparticipantsIDs.map(id=>user.find(user=>user._id.toString()===id.toString));
       res.status(200).send(users)
    }
    catch(error){
        res.status(500).send({
            success:false,
            message:error
        })
        console.log(error);
    }
}