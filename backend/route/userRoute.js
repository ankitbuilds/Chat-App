import express from 'express';
import isLogin from '../Middleware/isLogin.js';
import { getUserBySearch,getCurrentchatters } from '../Controllers/userhandlerController.js';
const router=express.Router()

router.get('/search',isLogin,getUserBySearch)
router.get('/currentchatters',getCurrentchatters)
export default router
