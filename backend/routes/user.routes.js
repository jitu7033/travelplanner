import express from 'express';
import { getAllUsers,addUser,loginUser } from '../controllers/user.controller.js';


const router  = express.Router();

router.get('/',getAllUsers);
router.post('/',addUser);
router.post('/login',loginUser);

export default router;