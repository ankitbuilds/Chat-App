import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaSearch } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from "react-icons/bi";
import userConversation from '../../zustand/userConversation';



const Sidebar = () => {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();

    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatUser, setChatUser] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { messages, selectedConversation, setSelectedConversation } = userConversation();

    // Fetch current chat users
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/user/currentchatters`, {
                    headers: {
                        Authorization: `Bearer ${authUser?.token}`
                    }
                });
                if (res.data.success) {
                    setChatUser(res.data.users || []);
                } else {
                    toast.error(res.data.message || "Failed to fetch chat users");
                }
            } catch (error) {
                toast.error("Error fetching chat users");
            } finally {
                setLoading(false);
            }
        };

        if (authUser?.token) chatUserHandler();
    }, [authUser]);

    // Handle search
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchInput.trim()) {
            toast.info("Please enter a name to search");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`/api/user/search`, {
                params: { search: searchInput.trim() },
                headers: {
                    Authorization: `Bearer ${authUser?.token}`
                }
            });

            const data = res.data;
            if (!data.success) {
                toast.error(data.message || "Something went wrong");
                setSearchUser([]);
                return;
            }

            if (!data.users || data.users.length === 0) {
                toast.info("No users found");
                setSearchUser([]);
            } else {
                setSearchUser(data.users);
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error(error.response?.data?.message || "Server error while searching");
            setSearchUser([]);
        } finally {
            setLoading(false);
        }
    };

    // handle user click
    const handleUserClick = (user) => {

        setSelectedUserId(user._id);
        setSelectedConversation(user);
    };
    //back from search result
    const handleSearchback = () => {
        setSearchUser([]);
        setSearchInput('')

    }
    const handleLogOut = async () => {
        const confirmlogout = window.confirm("Are you sure you want to LOGOUT?");

        if (confirmlogout) {
            try {
                const logout = await axios.post('/api/auth/logout');
                const data = logout.data;

                if (data?.success === false) {
                    setLoading(false);
                    console.log(data?.message);
                }

                toast.info(data.message);
                localStorage.removeItem('chatapp');
                setAuthUser(null);
                setLoading(false);
                navigate('/login');
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        } else {
            toast.info('Logout cancelled');
        }
    };

    return (
        <div className='h-full w-auto px-1'>
            <div className="flex gap-2 m-2">
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    alt="Profile"
                    className="self-center h-12 w-12 hover:scale-105 cursor-pointer rounded-full"
                />
                <span className="text-black font-bold items-center">{authUser?.fullname}</span>
            </div>
            <div className='flex justify-between gap-2'>
                <form onSubmit={handleSearchSubmit} className='w-auto flex items-center justify-between bg-white rounded'>
                    <input
                        type="text"
                        className="px-4 w-auto bg-transparent outline-none rounded-full text-black"
                        placeholder="Search user"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <button type="submit" className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
                        <FaSearch />
                    </button>
                </form>
            </div>

            <div className="divider px-3"></div>

            {loading ? (
                <div className="flex justify-center items-center h-32 text-gray-500">Loading...</div>
            ) : searchUser.length > 0 ? (
                <>
                    <div className="overflow-y-auto max-h-[80%] scrollbar">
                        {searchUser.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => handleUserClick(user)}
                                className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                                ${selectedUserId === user?._id ? `bg-sky-500` : ''}`}
                            >
                                <div className="avatar">
                                    <div className="w-12 rounded-full">
                                        <img src={user.profilepic} alt={user.fullName} className="h-10 w-10 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className="font-bold text-black">{user.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto px-1 py-1 flex cursor-pointer" onClick={handleSearchback}>
                        <IoArrowBackSharp size={25} />
                    </div>
                </>
            ) : (
                <>
                    <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
                        <div className="w-auto">
                            {chatUser.length === 0 ? (
                                <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                                    <h1>Why are you alone</h1>
                                </div>
                            ) : (
                                chatUser.map((user) => (
                                    <div key={user._id}>
                                        <div
                                            onClick={() => handleUserClick(user)}
                                            className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer
                                        ${selectedUserId === user?._id ? `bg-sky-500` : ''}`}
                                        >
                                            <div className="avatar">
                                                <div className="w-12 rounded-full">
                                                    <img src={user.profilepic} alt={user.fullName} className="h-10 w-10 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <p className="font-bold text-black">{user.username}</p>
                                                <span className="text-sm text-black">{user.fullName}</span>
                                            </div>
                                        </div>
                                        <div className="divider divide-solid px-3 h-[1px]"></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="mt-auto px-1 py-1 flex">
                        <button onClick={handleLogOut} className="hover:bg-red-600 w-10 cursor-pointer hover:text-white rounded-lg">
                            <BiLogOut size={25} />
                        </button>
                        <p>LogOut</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
