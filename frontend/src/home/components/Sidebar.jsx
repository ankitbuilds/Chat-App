import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
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


    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await axios.get(`/api/user/currentchatters`)
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);

                }
                setLoading(false)
                setChatUser(data)
            } catch (error) {
                setLoading(false);
                console.log(error)
            }
        }
    })



    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = response.data;

            if (!data.success) {
                setLoading(false);
                console.log(data.message);
                return;
            }

            const users = data.users || []; // extract users array
            setLoading(false);

            if (users.length === 0) {
                toast.info("User Not Found");
            } else {
                setSearchUser(users); // ✅ set only users, not whole response
            }
        } catch (error) {
            setLoading(false);
            console.error("❌ Search error:", error);
        }
    };


    // const handleSearchSubmit = async (e) => {
    //     e.preventDefault();

    //     // Prevent empty search
    //     if (!searchInput.trim()) {
    //         toast.info("Please enter a search term");
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         const res = await axios.get(`/api/user/search`, {
    //             params: { search: searchInput.trim() },
    //             headers: {
    //                 Authorization: `Bearer ${authUser?.token}` // Send token for isLogin middleware
    //             }
    //         });

    //         const data = res.data;

    //         // Check backend success flag
    //         if (!data.success) {
    //             toast.error(data.message || "Something went wrong");
    //             setSearchUser([]);
    //             return;
    //         }

    //         if (!data.users || data.users.length === 0) {
    //             toast.info("User Not Found");
    //             setSearchUser([]);
    //         } else {
    //             setSearchUser(data.users);
    //         }

    //     } catch (error) {
    //         console.error("Search error:", error);
    //         toast.error(error.response?.data?.message || "Search failed");
    //         setSearchUser([]);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // const handleSearchSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true)
    //     try {
    //         const search = await axios.get(`/api/user/search?search=${searchInput}`, {
    //             params: { search: searchInput },
    //             headers: {
    //                 Authorization: `Bearer ${authUser?.token}`
    //             }
    //         });

    //         const data = search.data;
    //         if (data.success === false) {
    //             setLoading(false)
    //             console.log(data.message);
    //         }
    //         setLoading(false)
    //         if (data.length === 0) {
    //             toast.info("user Not Found")

    //         } else {
    //             setSearchUser(data)
    //         }

    //     }
    //     catch (error) {
    //         setLoading(false)
    //     }

    // }
    return (
        <div className='h-full w-auto px-1'>
            <div className='flex justify-between gap-2'>
                <form onSubmit={handleSearchSubmit} className='w-auto flex-items-center justify-between bg-white rounded'>
                    <input type="text" className="px-4 w-auto bg-transparent outline-none rounded-full text-black"
                        placeholder="search user" value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)} />
                    <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
                        <FaSearch />
                    </button>

                </form>
                <img onClick={() => navigate(`/profile/${authUser?._id}`)} src={authUser?.profilepic}
                    className="self-center h-12 w-12 hover:scale cursor-pointer" />


            </div>
            <div className="divider px-3"></div>
            {searchUser?.length > 0 ? (
                <></>
            ) : (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar">
                        <div className="w-auto">
                            {chatUser.length === 0 ? (
                                <>
                                    <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                                        <h1>Why are you alone</h1>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {chatUser.map((user, index) => (
                                        <div key={user._id}></div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Sidebar