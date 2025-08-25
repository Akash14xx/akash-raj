import express from 'express';
import upload from "../middlewares/upload.js";
import{
    registerController,
    loginController,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", upload.single('profileImage'), registerController);
router.post("/login", loginController);

export default router;