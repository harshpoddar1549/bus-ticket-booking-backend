import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { validateToken } from "../middlewares/validateToken";

const adminRouter = Router()

adminRouter.put('/platform', validateToken, adminController.reset)

adminRouter.post('/login', adminController.loginAdmin)

adminRouter.post('/register', adminController.registerAdmin)

export default adminRouter