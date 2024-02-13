import express from 'express';
import { Login, Me, logOut, verifyToken} from '../controllers/Auth.js';
import { createUser } from '../controllers/Users.js';
const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.post('/signup', createUser);
router.delete('/logout', logOut);
router.get('/users/:id/verify/:token', verifyToken);


export default router;