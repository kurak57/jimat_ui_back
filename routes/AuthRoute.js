import express from 'express';
import { Login, Me, logOut, signUp } from '../controllers/Auth.js';
const router = express.Router();

router.get('/me', Me);
router.post('/login', Login);
router.post('/signup', signUp);
router.delete('/logout', logOut);

export default router;