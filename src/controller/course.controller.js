import { Course } from "../models/course.model.js";
import {Category} from '../models/category.model.js'
import { catchError } from "../utils/error-response.js";
import { CourseValidation } from "../validation/course.validation.js";

export class CourseController {
  async createCourse(req, res) {
    try {
      const { error, value } = CourseValidation(req.body);

      if (error) {
        return catchError(res, 400, error);
      }

      if (req.body.title) {
        const existName = await Course.findOne({
          title: req.body.title,
        });

        if (existName) {
          return catchError(res, 409, "Title already exist");
        }
      }

      const course = await Course.create(value);

      return res.status(201).json({
        statusCode: 201,
        message: "success",
        data: course,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllCourse(req, res) {
    try {
      const course = await Course.find().populate('category author');

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: course,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getByIdCourse(req, res) {
    try {
      const course = await CourseController.findById(res, req.params.id);

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: course,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateCourseById(req, res) {
    try {
      const id = req.params.id;
      await CourseController.findById(res, id);

      if (req.body.title) {
        const existtitle = await Course.findOne({
          title: req.body.title,
        });

        if (existtitle && id != existtitle._id) {
          return catchError(res, 409, "title already exist");
        }
      }

      const updateCourse = await Course.findByIdAndUpdate(id, req.body);

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: updateCourse,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteByIdCourse(req, res) {
    try {
      const id = req.params.id;
      await CourseController.findById(res, id);

      await Course.findByIdAndDelete(id);

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: {},
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getByFilter(req, res){
    try {
      const {category, price} = req.query
      const categoryData = await Category.findOne({name:category})
      const course = await Course.find({
        price:parseFloat(price),
        categoryId:categoryData._id
      })

      return res.status(200).json({
        statusCode:200,
        message:'success',
        data:course
      })
    } catch (error) {
      return catchError(res, 500, error.message)
    }
  }

  static async findById(res, id) {
    try {
      const course = await Course.findById(id).populate('category');
      if (!course) {
        return catchError(res, 404, `Course not found by ID ${id}`);
      }
      return course;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
