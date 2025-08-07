import express from "express";
import { userRegister, userLogin, userLogout, getAllUsers } from "../Controllers/userroutecontroller.js";
const router = express.Router();

router.get('/register', getAllUsers)
router.post('/register', userRegister)
router.post('/login', userLogin)
router.post('/logout', userLogout)

export default router;