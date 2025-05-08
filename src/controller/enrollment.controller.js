import { Enrollment } from "../models/enrolment.model.js";
import {enrollmentValidation} from '../validation/enrollment.validation.js'
import {catchError} from '../utils/error-response.js'

export class EnrollmentController{
    async createEnnrolment(req, res){
        try {
            const {error, value} = enrollmentValidation(req.body)

            if(error){
                return catchError(res, 500, error)
            }

            const ennrolment = await Enrollment.create(value)
             
            return res.status(201).json({
                statusCode:201,
                message:'success',
                data:ennrolment
            })
        } catch (error) {
            return catchError(res, 500, error.message)
        }
    }

      async getAllEnrollment(req, res) {
        try {
          const enrollment = await Enrollment.find().populate('user_id course_id');
    
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
          const enrollment = await EnrollmentController.findById(res, req.params.id);
    
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
          const enrollment = await Enrollment.findById(id).populate('user_id course_id');
          if (!enrollment) {
            return catchError(res, 404, `enrollment not found by ID ${id}`);
          }
          return enrollment;
        } catch (error) {
          return catchError(res, 500, error.message);
        }
      }
}