import { Category } from "../models/category.model.js";
import { categoryValidation } from "../validation/category.validation.js";
import { catchError } from "../utils/error-response.js";


export class CategoryController{
    async createCategory(req, res){
        try {
            const {error, value} = categoryValidation(req.body)

            if(error){
                return catchError(res, 400, error)
            }

            if(req.body.name){
                const existName = await Category.findOne({
                    name:req.body.name
                })

                if(existName){
                    return catchError(res, 409, 'Name already exist')
                }
            }

            const category = await Category.create(value)

            return res.status(201).json({
                statusCode:201,
                message:'success',
                data:category
            })
        } catch (error) {
            return catchError(res, 500, error.message)            
        }
    }

    async getAllCategory(req, res){
        try {
            const category = await Category.find().populate('Course')

            return res.status(200).json({
                statusCode:200,
                message:'success',
                data:category
            })
        } catch (error) {
            return catchError(res, 500, error.message)
        }
    }

    async getByIdCategory(req, res){
        try {
            const category = await CategoryController.findById(res, req.params.id)

            return res.status(200).json({
                statusCode:200,
                message:'success',
                data:category
            })
        } catch (error) {
            return catchError(res, 500, error.message)
        }
    }

    async updateCategoryById(req, res){
        try {
            const id = req.params.id
            await CategoryController.findById(res, id)

            if(req.body.name){
                const existName = await Category.findOne({
                    name:req.body.name
                })

                if(existName && id != existName._id){
                    return catchError(res, 409, 'Name already exist')
                }
            }

            const updateCategory = await Category.findByIdAndUpdate(id, req.body)

            return res.status(200).json({
                statusCode:200,
                message:'success',
                data:updateCategory
            })
        } catch (error) {
            return catchError(res, 500, error.message)
        }
    }

    async deleteByIdCategory(req, res){
          try {
            const id = req.params.id;
            await CategoryController.findById(res, id);
          
            await Category.findByIdAndDelete(id);
            
            return res.status(200).json({
              statusCode: 200,
              message: 'success',
              data: {},
            });
          } catch (error) {
            return catchError(res, 500, error.message)
          }
    }

    static async findById(res, id) {
        try {
          const category = await Category.findById(id).populate('Course');
          if (!category) {
            return catchError(res, 404, `Category not found by ID ${id}`);
          }
          return category;
        } catch (error) {
          return catchError(res, 500, error.message);
        }
    }
}
