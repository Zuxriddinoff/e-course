import { Enrollment } from "../models/enrolment.model.js";
import { Course } from "../models/course.model.js";
import {User} from "../models/users.model.js"
import { enrollmentValidation } from "../validation/enrollment.validation.js";
import { otpGenerator } from "../utils/otp-generator.js";
import { transporter } from "../utils/mailer.js";
import { catchError } from "../utils/error-response.js";
import {getCache, setCache} from '../utils/cache.js'

export class EnrollmentController {
  async createEnnrolment(req, res) {
    try {
      const { error, value } = enrollmentValidation(req.body);

      if (error) {
        return catchError(res, 500, error);
      }

      const { user_id, course_id } = value;

      const course = await Course.findById(course_id);

      if (!course) {
        return catchError(res, 404, `Course not found By Id ${course_id}`);
      }

      const user = await User.findById(user_id)
      if(!user){
        return catchError(res, 404, `user not found By Id ${user_id}`);
      }

      const email = user.email

      const otp = otpGenerator();
      const mailMessage = {
        from: process.env.SMPT_USER,
        to: email,
        subject: "e-course",
        text: otp,
      };
      console.log(otp);

      transporter.sendMail(mailMessage, function (err, info) {
        if (err) {
          console.log(`error on sending to mail: ${err}`);
          return catchError(res, 400, err);
        } else {
          console.log(info);
          setCache(user.email, otp);
        }
      });

      return res.status(201).json({
        statusCode: 201,
        message: "success",
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async confirmEnrollment(req, res) {
    try {
      const {user_id, course_id, otp } = req.body;

      const course = await Course.findById(course_id);

      if (!course) {
        return catchError(res, 404, `Course not found By Id ${course_id}`);
      }

      const user = await User.findById(user_id)
      if(!user){
        return catchError(res, 404, `user not found By Id ${user_id}`);
      }

      const otpcache = getCache(user.email);
      if (!otpcache || otp != otpcache) {
        return catchError(res, 400, "OTP expired");
      }
      
      const enrollment = await Enrollment.create({
        user_id,
        course_id
      })

      const courseName = course.title
      const userName = user.fullName

      const mailMessage = {
        from: process.env.SMPT_USER,
        to: email,
        subject: "e-course",
        text: `Tabriklaymiz  ${userName}!!! Siz ${courseName} kursini sotib oldingiz...!!!`,
      };

      transporter.sendMail(mailMessage, function (err, info) {
        if (err) {
          console.log(`error on sending to mail: ${err}`);
          return catchError(res, 400, err);
        } else {
          console.log(info);
        }
      });

      return res.status(201).json({
        statusCode:201,
        message:'success',
        data:enrollment
      })



    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllEnrollment(req, res) {
    try {
      const enrollment = await Enrollment.find().populate("user_id course_id");

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: enrollment,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getByIdEnrollment(req, res) {
    try {
      const enrollment = await EnrollmentController.findById(
        res,
        req.params.id
      );

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: enrollment,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateEnrollmentById(req, res) {
    try {
      const id = req.params.id;
      await EnrollmentController.findById(res, id);

      const updateEnrollment = await Enrollment.findByIdAndUpdate(id, req.body);

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: updateEnrollment,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteByIdEnrollement(req, res) {
    try {
      const id = req.params.id;
      await EnrollmentController.findById(res, id);

      await Enrollment.findByIdAndDelete(id);

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  static async findById(res, id) {
    try {
      const enrollment = await Enrollment.findById(id).populate(
        "user_id course_id"
      );
      if (!enrollment) {
        return catchError(res, 404, `enrollment not found by ID ${id}`);
      }
      return enrollment;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
