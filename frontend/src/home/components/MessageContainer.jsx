import React from 'react'
import userConversation from '../../zustand/userConversation';
import { useAuth } from '../../context/AuthContext';
import { IoArrowBackSharp } from 'react-icons/io5';

const MessageContainer = ({ onBackUser }) => {
    // ✅ Correct way: call userConversation with a selector
    const { messages, setMessages, selectedConversation, setSelectedConversation } = userConversation();

    const { authUser } = useAuth();

    return (
        // md:min-w-[500px]
        <div className='w-full h-full flex-col py-2 bg-[#fff]'>
            {selectedConversation === null ? (
                <div className="flex items-center justify-center w-full h-full">
                    <div className="px-4 text-center text-2xl text-grey-950 font-semibold flex flex-col">
                        <p className="text-2xl text-black">Welcome {authUser?.username}</p>
                        <p className="text-black">Select a chat to start messaging</p>

                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between gap-1 bf-sky-600 md:px-2 rounded-lg h-10 md:h-12">
                        <div className="flex gap-2 md:justify-between items-center w-full">
                            <div className="md:hidden ml-1 self-center">
                                <button onClick={() => onBackUser(true)} className="bg-white rounded-full px-2 py-1 self-center">
                                    <IoArrowBackSharp size={25} />
                                </button>
                            </div>
                            <div className="flex justify-between mr-2 gap-2">
                                <div className="self-center">
                                    <img className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer" src={selectedConversation?.profilepic}></img>
                                </div>
                                <span className="text-gray-950 self-center text-sm md:text-xl font-bold">
                                    {selectedConversation?.username}
                                </span>

                            </div>
                        </div>
                    </div>
                    <div className="divider divide-solid border-t border-black h-[1px]"></div>
                </>
            )}
        </div>
    )
}

export default MessageContainer;
