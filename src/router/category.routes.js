import { Router } from "express";
import { CategoryController } from "../controller/category.controller.js";
import { JwtAuthGuard } from "../middleware/jwt_auth.guard.js";
import { AdminGuard } from "../middleware/admin.guard.js";


const router = Router()
const controller = new CategoryController()

router
    .post("/", JwtAuthGuard, AdminGuard,  controller.createCategory)
    .get('/', controller.getAllCategory)
    .get('/:id', controller.getByIdCategory)
    .put("/:id", JwtAuthGuard, AdminGuard, controller.updateCategoryById)
    .delete("/:id", JwtAuthGuard, AdminGuard, controller.deleteByIdCategory)  


export {router as categoryRouter}