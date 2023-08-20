const Controller = require("./controller");
const createError = require("http-errors");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const bcrypt=require('bcrypt');
const { CheckExistUser } = require("../utils/utils");
const { UserModel } = require("../models/user.model");
class UserController extends Controller{

    UserIndex(res,req,next) {
        res.StatusCodes(HttpStatus.OK).json({
            statusCodes:HttpStatus.OK,
            message:'index page User'
        });
    }
    async signupUser(res,req){
        const {password , email , userName , lastName , mobile , name }=req.body
        CheckExistUser(userName);

        const genSalt= bcrypt.genSaltSync(process.env.SALT)
        const newPass= bcrypt.hashSync(password,genSalt)
        const newUser= await UserModel.create({
            userName,name,lastName,mobile,password:newPass,email
        });

        res.statusCodes(HttpStatus.Ok).json({
            statusCodes:200,
            message:newUser
        })



    }


}


module.exports={
    UserController:new UserController()
}