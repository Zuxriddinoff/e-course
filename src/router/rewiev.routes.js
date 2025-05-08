import {Router} from 'express'
import { RewievController } from '../controller/rewiev.controller.js'
import { JwtAuthGuard } from '../middleware/jwt_auth.guard.js'
import { UserGuard } from '../middleware/user.guard.js'

const router = Router()
const controller = new RewievController()

router
    .post("/", JwtAuthGuard, UserGuard, controller.createRewiev)
    .get('/', controller.getAllRewiev)
    .get('/:id', controller.getByIdRewiev)
    .put('/:id', JwtAuthGuard, UserGuard, controller.updateRewievById)
    .delete('/:id',JwtAuthGuard, UserGuard, controller.deleteByIdRewiev)


export {router as rewievRouter}