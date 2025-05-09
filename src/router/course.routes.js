import { Router } from "express";
import { CourseController } from "../controller/course.controller.js";
import { JwtAuthGuard } from "../middleware/jwt_auth.guard.js";
import { AuthorGuard } from "../middleware/author.guard.js";
import { AdminGuard } from "../middleware/admin.guard.js";

const router = Router()
const controller = new CourseController()

router
    .post("/", JwtAuthGuard, AuthorGuard, controller.createCourse)
    .get('/', controller.getAllCourse)
    .get('/filter', controller.getByFilter)
    .get('/:id', controller.getByIdCourse)
    .put("/:id", JwtAuthGuard, AuthorGuard, controller.updateCourseById)
    .delete("/:id", JwtAuthGuard, AdminGuard, controller.deleteByIdCourse)  

export {router as CourseRouter}