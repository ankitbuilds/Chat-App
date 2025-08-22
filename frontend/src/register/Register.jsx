import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth;
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({});

  const handleInput = (e) => {
    setInputData({
      ...inputData, [e.target.id]: e.target.value
    })

  }

  const selectGender = (gender) => {
    setInputData((prev) => ({
      ...prev,
      gender: prev.gender === gender ? '' : gender,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (inputData.password !== inputData.confpassword) {
      setLoading(false);
      return toast.error("Passwords don't match");
    }


    try {
      const register = await axios.post(`/api/auth/register`, inputData);
      const data = register.data;
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      localStorage.setItem('chatapp', JSON.stringify(data));
      setAuthUser(data);
      setLoading(false);
      navigate('/login');
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  };
  return (
    <div className='flex flex-col items-center justify-center mix-w-full mx-auto'>
      <div className="w-full p-6 rounded-lg shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur">
        <h1 className="text-3xl font-bold text-center text-white">SignUp <span className="text-black">Chatters</span></h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col items-center justify-center">
            <label className="text-1xl font-bold text-black text">FullName:</label>
            <input onChange={handleInput} id="fullname" className="bg-white text-gray-600 input input-bordered h-10" type="text" placeholder="Enter FullName" required ></input>
            <label className="text-1xl font-bold text-black">UserName:</label>
            <input onChange={handleInput} className=" bg-white text-gray-600  input input-bordered h-10" type="text" id="username" placeholder="Enter UserName" required></input>
            <label className="text-1xl font-bold text-black text">Email:</label>
            <input onChange={handleInput} id="email" className="bg-white text-gray-600 input input-bordered h-10" type="email" placeholder="Enter Email" required ></input>
            <label className="text-1xl font-bold text-black text">Password:</label>
            <input onChange={handleInput} id="password" className="bg-white text-gray-600 input input-bordered h-10" type="password" placeholder="Enter Password" required ></input>
            <label className="text-1xl font-bold text-black text">Confirm Password:</label>
            <input onChange={handleInput} id="confpassword" className="bg-white text-gray-600 input input-bordered h-10" type="password" placeholder="Confirm Password" required ></input>
          </div>
          <div className="flex gap-1" id="gender">
            <label className="cursor-pointer label flex gap-2">
              <span className="label-text font-semibold text-gray-950">male</span>
              <input onChange={() => selectGender('male')} type="checkbox" className="checkbox checkbox-info"></input>
            </label>
            <label className="cursor-pointer label flex gap-2">
              <span className="label-text font-semibold text-gray-950">female</span>
              <input onChange={() => selectGender('female')} type="checkbox" className="checkbox checkbox-info"></input>
            </label>
          </div>
          <button type='submit'
            className='mt-4 self-center 
                            w-auto px-2 py-1 bg-gray-950 
                            text-lg hover:bg-gray-900 
                            text-white rounded-lg hover: scale-105'>
            {loading ? "loading.." : "Register"}
          </button>
        </form>
        <div className='pt-2'>
          <p className='text-sm font-semibold
                         text-gray-800'>
            Have an Acount ? <Link to={'/login'}>
              <span
                className='text-gray-950 
                            font-bold underline cursor-pointer
                             hover:text-green-950'>
                Login Now!!
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register