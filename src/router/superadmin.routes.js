import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import {JwtAuthGuard} from "../middleware/jwt_auth.guard.js"
import { SuperAdminGuard } from "../middleware/superAdmin.guard.js";

const router = Router()
const controller = new UserController()

router
    .post('/', controller.createSuperAdmin)
    .post("/signin", controller.login)
    .post('/confirm-signin', controller.confirmsignIn)
    .post('/signout', controller.signout)
    .post('/token', controller.accessToken)
    .get('/', JwtAuthGuard, SuperAdminGuard, controller.getSuperAdmin)
    .put('/:id', JwtAuthGuard, SuperAdminGuard, controller.updateById)

export {router as superAdminRouter}