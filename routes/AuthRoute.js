import express from 'express';
import { Login, Me, logOut} from '../controllers/Auth.js';
import { createUser } from '../controllers/Users.js';
const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.post('/signup', createUser);
router.delete('/logout', logOut);

export default router;