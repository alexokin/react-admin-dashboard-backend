import  express  from "express";
import { getAdmins } from "./management.controller.js";

const router = express.Router();

router.get("/admins", getAdmins)

export default router

