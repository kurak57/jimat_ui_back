import express from 'express';
import { 
    getInterests,
    getInterestById,
    createInterest,
    updateInterest,
    deleteInterest,
    getAvgInterest,
    getAvgInterests,
} from "../controllers/Interests.js";
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/interests', verifyUser, getInterests);
router.get('/interests/:id',verifyUser, getInterestById);
router.get('/interests/:id/avg', verifyUser, getAvgInterest);
router.get('/interests/:id/avgall', verifyUser, getAvgInterests);
router.post('/interests', verifyUser, createInterest);
router.patch('/interests/:id', verifyUser, updateInterest);
router.delete('/interests/:id', verifyUser, deleteInterest);

export default router;