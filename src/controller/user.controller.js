import {User} from '../models/users.model.js'
import {catchError} from '../utils/error-response.js'
import { UserValidator } from '../validation/user.validation.js'
import {encode, decode} from "../utils/bcrypt-encrypt.js"
import {otpGenerator} from '../utils/otp-generator.js'
import { transporter } from '../utils/mailer.js'
import {setCache, getCache} from '../utils/cache.js'
import { generateAccessToken, generateRefreshToken } from '../utils/generate-token.js'
import { refTokenWriteCookie } from '../utils/write-cookie.js'
import jwt from 'jsonwebtoken'


export class UserController{
    async createSuperAdmin(req, res) {
        try {
          const { error, value } = UserValidator(req.body);

          if (error) {
            return catchError(res, 400, error);
          }

          const {fullName, email, password } = value;
          const checkSuperAdmin = await User.findOne({ role: 'superadmin' });
          
          if (checkSuperAdmin) {
            return catchError(res, 409, 'Super admin already exist');
          }
          
          const hashedPassword = await encode(password, 7);
          
          const superadmin = await User.create({
            fullName,
            email,
            hashedPassword,
            role: 'superadmin',
          });
          
          return res.status(201).json({
            statusCode: 201,
            message: 'success',
            data: superadmin,
          });
        
        } catch (error) {
            console.log(error);
          return catchError(res, 500, error.message);
        }
    }

    async createAdmin(req, res) {0
        try {
          const { error, value } = UserValidator(req.body);
          
          if (error) {
            return catchError(res, 400, error);
          }
          
          const {fullName, email, password } = value;
          const hashedPassword = await encode(password, 7);
          
          const admin = await User.create({
            fullName,
            email,
            hashedPassword,
            role: 'admin',
          });
          
          return res.status(201).json({
            statusCode: 201,
            message: 'success',
            data: admin,
          });
        
        } catch (error) {
          return catchError(res, 500, error.message);
        }
    }

    async createUser(req, res){
      try {
        const { error, value } = UserValidator(req.body);

        if (error) {
          return catchError(res, 400, error);
        }

        const {fullName, email, password } = value;
        const hashedPassword = await encode(password, 7);
        
        const admin = await User.create({
          fullName,
          email,
          hashedPassword,
          role: 'user',
        });
        
        return res.status(201).json({
          statusCode: 201,
          message: 'success',
          data: admin,
        });      
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }

    async createAuthor(req, res){
      try {
        const { error, value } = UserValidator(req.body);

        if (error) {
          return catchError(res, 400, error);
        }

        const {fullName, email, password } = value;
        const hashedPassword = await encode(password, 7);
        
        const admin = await User.create({
          fullName,
          email,
          hashedPassword,
          role: 'author',
        });
        
        return res.status(201).json({
          statusCode: 201,
          message: 'success',
          data: admin,
        });      
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }


    async getSuperAdmin(req, res){
      try {
        const superAdmin = await User.findOne({role:'superadmin'})
        return res.status(201).json({
          statusCode: 201,
          message: 'success',
          data: superAdmin
        });
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }

    async getAllAdmins(req, res){
      try {
        const admin = await User.find({role:'admin'});
        return res.status(201).json({
          statusCode: 201,
          message: 'success',
          data:admin
        });
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }

    async getAllUsers(req, res){
      try {
        const user = await User.find({role:'user'})
        // .populate({
        //   path: 'Enrollment',
        //   populate: {
        //     path: 'course_id', 
        //     model: 'Course'
        //   }
        // });


        return res.status(200).json({
          statusCode: 200,
          message: 'success',
          data:user
        });
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }

    async getAllAuthor(req, res){
      try {
        const user = await User.find({role:'author'}).populate('Course')
        return res.status(201).json({
          statusCode: 201,
          message: 'success',
          data:user
        });
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }
    
    
    async getById(req, res){
      try {
        const admin = await UserController.findById(res, req.params.id)
        
        return res.status(200).json({
          statusCode:200,
          message:'success',
          data:admin
        })
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }

  

    async deleteById(req, res){
      try {
        const id = req.params.id;
        const admin = await UserController.findById(res, id);
      
        await User.findByIdAndDelete(id);
        
        return res.status(200).json({
          statusCode: 200,
          message: 'success',
          data: {},
        });
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }


    async updateById(req, res){
      try {
        const id = req.params.id
        const Superadmin = await UserController.findById(res, id)

        if (req.body.email) {
          const existemail = await User.findOne({
            email: req.body.email,
          });

          if (existemail && id != existemail._id) {
            return catchError(res, 409, 'email already exist');
          }
        }

        let hashedPassword = Superadmin.hashedPassword;
        
        if(req.body.password){
          hashedPassword = encode(req.body.password, 7)
          delete req.body.password
        }

        const updatedSuperAdmin = await User.findByIdAndUpdate(id, req.body, {
          ...req.body,
          hashedPassword
        });

        return res.status(200).json({
          statusCode: 200,
          message: 'success',
          data: updatedSuperAdmin,
        });

      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }

    async login(req, res){
      try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        
        if(!user){
          return catchError(res, 404, 'user not found')
        }
        
        const isMatchPassword = await decode(password, user.hashedPassword)

        if(!isMatchPassword){
          return catchError(res, 400, 'invalid password')
        }

        const otp = otpGenerator();
        const mailMessage = {
          from:process.env.SMPT_USER,
          to:email,
          subject:"e-course",
          text:otp
        }
        console.log(otp);

        transporter.sendMail(mailMessage, function(err, info){
          if(err){
            console.log(`error on sending to mail: ${err}`);
            return catchError(res, 400, err);
          }else{
            console.log(info);
            setCache(user.email, otp)
          }
        })

        return res.status(200).json({
          statusCode:200,
          message:"succes",
          data:{},
        })
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }
    async confirmsignIn(req, res){
      try {
        const {email, otp} = req.body
        const user = await User.findOne({email})

        if(!user){
          return catchError(res, 404, 'User not found')
        }

        const otpcache = getCache(email);
        if(!otpcache || otp != otpcache){
          return catchError(res, 400, 'OTP expired');
        }

        const payload = {id:user._id, role: user.role};
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload);
        refTokenWriteCookie(res, 'refreshTokenAdmin', refreshToken);

        return res.status(200).json({
          statusCode:200,
          message:'success',
          data:accessToken
        })
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }
    async accessToken(req, res){
      try {
        const refreshToken = req.cookies.refreshTokenAdmin;

        if(!refreshToken){
          return catchError(res, 401, 'refresh token expired');
        }

        const decodedToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_KEY
        );

        const payload = {id:decodedToken.id, role:decodedToken.role};
        const accessToken = generateAccessToken(payload);
        
        return res.status(200).json({
          statusCode:200,
          message:'success',
          data:accessToken
        })
      } catch (error) {
          return catchError(res, 500, error.message)
      }
    }
    
    async signout(req, res){
      try {
        const refreshToken = req.cookies.refreshTokenAdmin
        if(!refreshToken){
          return catchError(res, 401, 'refresh token not found')
        }

        const decodedToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_KEY
        );

        if(!decodedToken){
          return catchError(res, 401, 'refresh token expired')
        }

        res.clearCookie('refreshTokenAdmin');

        return res.status(200).json({
          statusCode:200,
          message:'success',
          data:{}
        });
      } catch (error) {
        return catchError(res, 500, error.message)
      }
    }


    static async findById(res, id) {
      try {
        const admin = await User.findById(id).populate('Course')
        .populate({
          path: 'Enrollment',
          populate: {
            path: 'course_id', 
            model: 'Course'
          }
        });;
        if (!admin) {
          return catchError(res, 404, `Not found by ID ${id}`);
        }
        return admin;
      } catch (error) {
        return catchError(res, 500, error.message);
      }
    }
}