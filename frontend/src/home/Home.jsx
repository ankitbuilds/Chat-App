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
        <div className="block md:flex justify-between w-full md-w[550px]
        rounded-xl shadow-lg
           bg-[#f0f0f0] bg-clip-padding
             backdrop-blur-lg 
            bg-opacity-0">
            <div className={` p-4 md:flex ${isSidebarVisible ? '' : 'hidden'}`}>
                <Sidebar onSelectUser={handleUserSelect} />
            </div>
            {/* <div className={`divider divider-horizontal px-1 md:flex ${isSidebarVisible ? '' : 'hidden'} ${selectedUser ? 'block' : 'hidden'}`}></div> */}
            <div className={`flex-auto ${selectedUser ? '' : 'hidden md:flex'} bg-white justify-center items-center`}>
                <MessageContainer onBackUser={handleShowSidebar} />
            </div>
        </div>
    )
}

export default Home