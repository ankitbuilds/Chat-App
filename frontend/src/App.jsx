import { useState } from 'react'
import './App.css'
import { Login } from './login/Login'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Route, Routes} from 'react-router-dom';
import {Register} from './register/Register';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
      
      <ToastContainer/>
    </>
  )
}

export default App
