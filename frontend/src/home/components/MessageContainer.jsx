import React, { useEffect, useState, useRef } from 'react'
import userConversation from '../../Zustand/userConversation';
import { useAuth } from '../../context/AuthContext';
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import axios from 'axios';
import { useSocketContext } from '../../context/socketContext';
// import notify from '../../assets/sound/notification.mp3';

const MessageContainer = ({ onBackUser }) => {
    const { messages, selectedConversation, setMessages, setSelectedConversation } = userConversation();
    const { socket } = useSocketContext();
    const { authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendData, setSnedData] = useState("");
    const bottomRef = useRef(null);

    // ✅ Listen for new incoming messages
    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            // const sound = new Audio(notify);
            // sound.play();
            setMessages([...messages, newMessage]);
        });

        return () => socket?.off("newMessage");
    }, [socket, setMessages, messages]);


    // scroll to bottom whenever messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ✅ Fetch messages for selected conversation
    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                console.log("🔑 Token being sent:", authUser?.token); // debug
                const res = await axios.get(`/api/message/${selectedConversation?._id}`, {
                    headers: {
                        Authorization: `Bearer ${authUser?.token}`,
                    },
                });
                const data = res.data;
                if (data.success === false) {
                    console.log(data.message);
                } else {
                    setMessages(data); // ✅ update Zustand
                }
            } catch (error) {
                console.log("❌ Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessages, authUser?.token]);

    const handelMessages = (e) => {
        setSnedData(e.target.value);
    };

    // ✅ Send message
    const handelSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            console.log("🔑 Token being sent:", authUser?.token); // debug
            const res = await axios.post(
                `/api/message/send/${selectedConversation?._id}`,
                { message: sendData }, // ✅ FIXED: backend expects "message"
                {
                    headers: {
                        Authorization: `Bearer ${authUser?.token}`,
                    },
                }
            );
            const data = res.data;
            if (data.success === false) {
                console.log(data.message);
            } else {
                setMessages([...messages, data]); // ✅ push new message
                setSnedData('');
            }
        } catch (error) {
            console.log("❌ Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className='md:min-w-[500px] h-screen flex flex-col bg-white py-2 min-h-0'>
            {selectedConversation === null ? (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2'>
                        <p className='text-2xl'>Welcome!!👋 {authUser.username}😉</p>
                        <p className="text-lg">Select a chat to start messaging</p>
                        <TiMessages className='text-6xl text-center' />
                    </div>
                </div>
            ) : (
                <>
                    <div className='flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12'>
                        <div className='flex gap-2 md:justify-between items-center w-full'>
                            <div className='md:hidden ml-1 self-center'>
                                <button onClick={() => onBackUser(true)} className='bg-white rounded-full px-2 py-1 self-center'>
                                    <IoArrowBackSharp size={25} />
                                </button>
                            </div>
                            <div className='flex justify-between mr-2 gap-2'>
                                <div className='self-center'>
                                    <img className='rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer' src={selectedConversation?.profilepic} />
                                </div>
                                <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                                    {selectedConversation?.username}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='flex-1 overflow-y-auto min-h-0 px-2
                          scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent'>
                        {loading && (
                            <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                                <div className="loading loading-spinner"></div>
                            </div>
                        )}
                        {!loading && messages?.length === 0 && (
                            <p className='text-center text-white items-center'>
                                Send a message to start Conversation
                            </p>
                        )}
                        {!loading && messages.length > 0 && messages.map((message) => (
                            <div className="text-black" key={message?._id}>
                                <div className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'}`}>
                                    <div className={`chat-bubble ${message.senderId === authUser._id ? 'bg-sky-600 text-white' : 'bg-gray-200 text-black'}`}>
                                        {message?.message}
                                    </div>
                                    <div className="chat-footer text-[10px]">
                                        {new Date(message?.createdAt).toLocaleDateString('en-IN')}{' '}
                                        {new Date(message?.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={handelSubmit} className='rounded-full text-black'>
                        <div className='w-full flex items-center bg-[#dce8ff] p-2'>
                            <input
                                value={sendData}
                                onChange={handelMessages}
                                required
                                id='message'
                                type='text'
                                className='w-full outline-none px-4 rounded-full bg-white'
                            />
                            <button type='submit'>
                                {sending ? (
                                    <div className='loading loading-spinner'></div>
                                ) : (
                                    <IoSend
                                        size={25}
                                        className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1'
                                    />
                                )}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default MessageContainer;
