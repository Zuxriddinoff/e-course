import { Rewiev } from "../models/rewiev.model.js";
import { rewiewValidation } from "../validation/rewiev.validation.js";
import { catchError } from "../utils/error-response.js";

export class RewievController {
  async createRewiev(req, res) {
    try {
      const { error, value } = rewiewValidation(req.body);

      if (error) {
        return catchError(res, 400, error);
      }

      const rewiev = await Rewiev.create(value);

      return res.status(201).json({
        statusCode: 201,
        message: "success",
        data: rewiev,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getAllRewiev(req, res) {
    try {
      const rewievs = await Rewiev.find().populate('user_id course_id')

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: rewievs,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async getByIdRewiev(req, res) {
    try {
      const rewiev = await RewievController.findById(res, req.params.id);

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: rewiev,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async updateRewievById(req, res) {
    try {
      const id = req.params.id;
      await RewievController.findById(res, id);


      const updateRewiev = await Rewiev.findByIdAndUpdate(id, req.body);

      return res.status(200).json({
        statusCode: 200,
        message: "success",
        data: updateRewiev,
      });
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }

  async deleteByIdRewiev(req, res) {
    try {
      const id = req.params.id;
      await RewievController.findById(res, id);

      await Rewiev.findByIdAndDelete(id);

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
      const rewiew = await Rewiev.findById(id).populate('user_id course_id');
      if (!rewiew) {
        return catchError(res, 404, `rewiev not found by ID ${id}`);
      }
      return rewiew;
    } catch (error) {
      return catchError(res, 500, error.message);
    }
  }
}
