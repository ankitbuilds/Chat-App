import { useState } from 'react'
import './App.css'
import { Login } from './login/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import { Register } from './register/Register';
import Home from './home/Home';
import { VerifyUser } from './utils/VerifyUser';
import axios from "axios";

axios.defaults.withCredentials = true;


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<VerifyUser />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>

      <ToastContainer />
    </>
  )
}

export default App
