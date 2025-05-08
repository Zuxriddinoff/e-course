import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './config/db.js'
import { superAdminRouter, adminRouter, userRouter, categoryRouter, CourseRouter, EnrollmentRouter, rewievRouter, authorRouter} from './router/index.js'
import cookieParser from 'cookie-parser'
config()

const app = express()
app.use(express.json())
app.use(cookieParser())
const PORT = +process.env.PORT || 5555

app.use('/superadmin', superAdminRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)
app.use("/category", categoryRouter)
app.use("/course", CourseRouter)
app.use('/enrollment', EnrollmentRouter)
app.use('/rewiev', rewievRouter)
app.use('/author', authorRouter)

await connectDB()
app.listen(PORT, () => {
    console.log('server is running on port', PORT);
})