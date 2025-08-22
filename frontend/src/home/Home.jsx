import React from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './components/Sidebar';
import MessageContainer from './components/MessageContainer';

const Home = () => {
    const { authUser } = useAuth();
    return (
        <div className="flex justify-between min-w-full md:min-w-[550px]
        md:h-full rounded-xl shadow-lg bg-gray-400 bg-clip-padding
        backdrop-filter bckdrop-blur-lg bg-opacity-0">
            <div>
                <Sidebar />
            </div>
            <div>
                <MessageContainer />
            </div>
        </div>
    )
}

export default Home