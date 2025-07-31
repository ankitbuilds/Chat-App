import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate=useNavigate();
  const [userInput, setUserInput]=useState({});
  const [loading,setLoading]= useState(false)

  const handleInput=(e)=>{
    setUserInput({
      ...userInput,[e.target.id]:e.target.value
    })

  }
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const login = await axios.post(`/api/auth/login`, userInput);
    const data = login.data;

    if (data.success === false) {
      setLoading(false);
      toast.error(data.message);
      return;
    }

    toast.success(data.message);
    localStorage.setItem('chatapp', JSON.stringify(data));
    setLoading(false);
    navigate('/');
  } catch (error) {
    setLoading(false);
    toast.error(error.response?.data?.message || "Login failed. Please try again.");
    console.log(error);
  }
};

  return (
    <div className='flex flex-col items-center justify-center mix-w-full mx-auto'>
        <div className="w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur">
          <h1 className="text-3xl font-bold text-center text-white">Login <span className="text-black">Chatters</span></h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex flex-col items-center justify-center">
              <label className="text-1xl font-bold text-black text">Email:</label>
              <input onChange={handleInput} id="email" className="bg-white text-gray-600 input input-bordered h-10" type="email" placeholder="Enter your email" required ></input>
              <label className="text-1xl font-bold text-black">Password:</label>
              <input onChange={handleInput} className=" bg-white text-gray-600  input input-bordered h-10" type="password" id="password" placeholder="Enter your password" required></input>
            </div>
            <button type="submit"  className="mt-4 self-center w-auto px-2 py-1 bg-black rounded-md hover:scale-105 cursor-pointer">LogIn</button>
          </form>
          <div className="pt-2">
            <p className="text-sm font-semibold">Dont have an Account ? <Link to={'/register'}>
            <span className="font-bold underline cursor pointer hover:text-green-950">
              Register Now!</span></Link></p>
          </div>
        </div>
    </div>
  )
}
