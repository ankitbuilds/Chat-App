import React, { useEffect, useState, useRef } from 'react';
import userConversation from '../../zustand/userConversation';
import { useAuth } from '../../context/AuthContext';
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import axios from 'axios';

const MessageContainer = ({ onBackUser }) => {
    const { messages, setMessages, selectedConversation } = userConversation();
    const [loading, setLoading] = useState(false);
    const { authUser } = useAuth();
    const [sending, setSending] = useState(false);
    const [sendData, setSendData] = useState("");
    const bottomRef = useRef(null); // single anchor at the end

    // scroll to bottom whenever messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // warn once if token missing
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (!savedToken) console.warn("⚠️ No token found. Please login again.");
    }, []);

    // fetch messages
    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.warn("⚠️ No token found while fetching messages");
                    return;
                }

                const { data } = await axios.get(`/api/message/${selectedConversation?._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (data?.success === false) {
                    console.log(data.message);
                } else {
                    setMessages(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.log(error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessages]);

    const handleMessage = (e) => setSendData(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("⚠️ No token found while sending message");
                return;
            }

            const { data } = await axios.post(
                `/api/message/send/${selectedConversation?._id}`,
                { message: sendData },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data?.success === false) {
                console.log(data.message);
            } else {
                setMessages(prev => [...prev, data]);
                setSendData("");
            }
        } catch (error) {
            console.log(error.response?.data || error.message);
        } finally {
            setSending(false);
        }
    };

    return (
        // Make the whole container fill the viewport and allow children to shrink
        <div className="md:min-w-[500px] h-screen flex flex-col bg-white py-2 min-h-0">
            {selectedConversation === null ? (
                <div className="flex items-center justify-center w-full h-full">
                    <div className="px-4 text-center text-2xl text-grey-950 font-semibold flex flex-col">
                        <p className="text-2xl text-black">Welcome {authUser?.username}</p>
                        <p className="text-black">Select a chat to start messaging</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header (fixed height) */}
                    <div className="flex justify-between gap-1 md:px-2 h-10 md:h-12 items-center">
                        <div className="flex gap-2 items-center w-full">
                            <div className="md:hidden ml-1">
                                <button onClick={() => onBackUser(true)} className="bg-white rounded-full px-2 py-1">
                                    <IoArrowBackSharp size={25} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mr-2">
                                <img
                                    className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                                    src={selectedConversation?.profilepic}
                                    alt=""
                                />
                                <span className="text-gray-950 text-sm md:text-xl font-bold">
                                    {selectedConversation?.username}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-black" />

                    {/* Messages: this is the ONLY scrollable area */}
                    <div className="flex-1 overflow-y-auto min-h-0 px-2
                          scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                        {loading && (
                            <div className="flex w-full h-full flex-col items-center justify-center gap-4">
                                <div className="loading loading-spinner" />
                            </div>
                        )}

                        {!loading && messages.length === 0 && (
                            <p className="text-center text-black mt-4">Send a message to start conversation</p>
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

                        {/* anchor to auto-scroll to bottom */}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input (fixed bottom) */}
                    <form onSubmit={handleSubmit} className="text-black">
                        <div className="w-full flex items-center bg-[#dce8ff] p-2">
                            <input
                                onChange={handleMessage}
                                value={sendData}
                                required
                                id="message"
                                type="text"
                                className="w-full outline-none px-4 rounded-full bg-white"
                                placeholder="Type a message"
                            />
                            <button type="submit">
                                {sending ? (
                                    <div className="loading loading-spinner" />
                                ) : (
                                    <IoSend
                                        size={25}
                                        className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1"
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
