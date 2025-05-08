import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import {JwtAuthGuard} from "../middleware/jwt_auth.guard.js"
import { SuperAdminGuard } from "../middleware/superAdmin.guard.js";
import { AdminGuard } from "../middleware/admin.guard.js";


const router = Router()
const controller = new UserController()

router
    .post('/', JwtAuthGuard, SuperAdminGuard, controller.createAdmin)
    .post("/signin", controller.login)
    .post('/confirm-signin', controller.confirmsignIn)
    .post('/signout', controller.signout)
    .post('/token', controller.accessToken)
    .get('/', JwtAuthGuard, SuperAdminGuard, controller.getAllAdmins)
    .get('/:id',JwtAuthGuard, AdminGuard, controller.getById)
    .put('/:id', JwtAuthGuard, AdminGuard, controller.updateById)
    .delete("/:id", JwtAuthGuard, SuperAdminGuard, controller.deleteById)

export {router as adminRouter}