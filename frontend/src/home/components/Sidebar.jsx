import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaSearch } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const { authUser } = useAuth();

    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [chatUser, setChatUser] = useState([]);

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
                console.error("Chat users fetch error:", error);
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

    return (
        <div className='h-full w-auto px-1'>
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
                <img
                    onClick={() => navigate(`/profile/${authUser?._id}`)}
                    src={authUser?.profilepic}
                    alt="Profile"
                    className="self-center h-12 w-12 hover:scale-105 cursor-pointer rounded-full"
                />
            </div>

            <div className="divider px-3"></div>

            {loading ? (
                <div className="flex justify-center items-center h-32 text-gray-500">Loading...</div>
            ) : searchUser.length > 0 ? (
                <div className="overflow-y-auto max-h-[80%] scrollbar">
                    {searchUser.map((user) => (
                        <div key={user._id} className="p-2 flex items-center gap-2 hover:bg-gray-100 rounded cursor-pointer">
                            <img src={user.profilepic} alt={user.fullName} className="h-10 w-10 rounded-full" />
                            <span>{user.fullName}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
                    <div className="w-auto">
                        {chatUser.length === 0 ? (
                            <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                                <h1>Why are you alone</h1>
                            </div>
                        ) : (
                            chatUser.map((user) => (
                                <div key={user._id} className="p-2 flex items-center gap-2 hover:bg-gray-100 rounded cursor-pointer">
                                    <img src={user.profilepic} alt={user.fullName} className="h-10 w-10 rounded-full" />
                                    <span>{user.fullName}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
