import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import {JwtAuthGuard} from "../middleware/jwt_auth.guard.js"
import { SuperAdminGuard } from "../middleware/superAdmin.guard.js";
import { AuthorGuard } from "../middleware/author.guard.js";
import { AdminGuard } from "../middleware/admin.guard.js";

const router = Router()
const controller = new UserController()

router
    .post('/',JwtAuthGuard, AuthorGuard, controller.createAuthor)
    .post("/signin", controller.login)
    .post('/confirm-signin', controller.confirmsignIn)
    .post('/signout', controller.signout)
    .post('/token', controller.accessToken)
    .get('/', JwtAuthGuard, AdminGuard, controller.getAllAuthor)
    .get('/:id', JwtAuthGuard, AuthorGuard, controller.getById)
    .put('/:id', JwtAuthGuard, AuthorGuard, controller.updateById)
    .delete("/:id", JwtAuthGuard, AdminGuard, controller.deleteById)

export {router as authorRouter}