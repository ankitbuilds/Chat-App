import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './components/Sidebar';
import MessageContainer from './components/MessageContainer';

const Home = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const { authUser } = useAuth();
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setIsSidebarVisible(false);


    }
    const handleShowSidebar = () => {
        setIsSidebarVisible(true);
        setSelectedUser(null);
    }
    return (
        <div className="flex justify-between min-w-full md:min-w-[550px]
        md:h-full rounded-xl shadow-lg bg-[#f0f0f0] bg-clip-padding
        backdrop-filter bckdrop-blur-lg bg-opacity-0">
            <div className={` py-2 md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
                <Sidebar onSelectUser={handleUserSelect} />
            </div>
            <div className={`divider divider-horizontal px-3 md:flex ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div>
            <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-white`}>
                <MessageContainer onBackUser={handleShowSidebar} />
            </div>
        </div>
    )
}

export default Home