import express from 'express';
import { Login, Me, logOut, verifyToken} from '../controllers/Auth.js';
import { createUser } from '../controllers/Users.js';
import { refreshToken } from '../controllers/RefreshToken.js';
const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.post('/signup', createUser);
router.delete('/logout', logOut);
router.get('/users/:id/verify/:token', verifyToken);
router.get('/token', refreshToken);




export default router;