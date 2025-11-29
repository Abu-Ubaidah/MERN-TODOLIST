// backend/src/routes/user.route.js
import { Router } from "express";
import { registerUser , loginUser, logoutUser, refreshUser, getUser} from "../controllers/user.controller.js";
import { verifyJWT, verifyRefreshToken } from "../middlewares/auth.middleware.js";


const router = Router();

//auth
router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").post(verifyJWT,logoutUser);
//get
router.route("/auth/user/me").get(verifyJWT, getUser);
//refrsh
router.route("/auth/refresh").get(verifyRefreshToken,refreshUser)

export default router;