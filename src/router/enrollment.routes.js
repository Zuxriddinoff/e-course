import { Router } from "express";
import { EnrollmentController } from "../controller/enrollment.controller.js";
import { JwtAuthGuard } from "../middleware/jwt_auth.guard.js";
import { UserGuard } from "../middleware/user.guard.js";

const router = Router()
const controller = new EnrollmentController()

router
    .post("/",JwtAuthGuard, UserGuard, controller.createEnnrolment)
    .get('/', JwtAuthGuard, UserGuard, controller.getAllEnrollment)
    .get('/:id',JwtAuthGuard, UserGuard, controller.getByIdEnrollment)
    .put("/:id", JwtAuthGuard, UserGuard, controller.updateEnrollmentById)
    .delete("/:id",JwtAuthGuard, UserGuard, controller.deleteByIdEnrollement)  

export {router as EnrollmentRouter}