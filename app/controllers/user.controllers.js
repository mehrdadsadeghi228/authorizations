const Controller = require("./base.Controller");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const bcrypt=require('bcrypt');
const { CheckExistUser, newHashPass, codeERSali } = require("../utils/utils");
const { UserModel } = require("../models/user.model");
require('dotenv').config();
const {validationResult}=require('express-validator')
const  empty = require('is-empty');
const userModel = require("../models/user.model");

class UserControllerClass extends Controller{

    UserIndex(req,res,next) {
         return res.status(HttpStatus.OK).json({
            statusCodes:HttpStatus.OK,
            message:'index page User'
        });
    }

    async signupUser(req,res,next){

       try {
        const errorValidator=validationResult(req);
        if(empty(errorValidator)){
            res.status(HttpStatus.BAD_REQUEST).json({
                statusCodes:HttpStatus.BAD_REQUEST,
                where:'/UserControllerClass/signupUser',
                message:errorValidator
            });
        }
        const {password , email , userName , lastName , mobile , name }=req.body
        CheckExistUser(userName);  
        const newPass=newHashPass(password)     
        const newUser= await UserModel.create({
            userName:userName,name:name,lastName:lastName,mobile:mobile,password:newPass,email:email
        });
        return res.status(HttpStatus.OK).json({
                statusCodes:HttpStatus.OK,
                where:'/UserControllerClass/signupUser',
                Modified:newUser.isModified,
                Data:newUser
            });
       } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCodes:HttpStatus.INTERNAL_SERVER_ERROR,
            where:'/UserControllerClass/signupUser',
            Modified:false,
            Error:error
        });
      }
    } 
       
    async checkIsModifyAndSendCodeAccount(req,res){
        try {
            const {id}=req.body;
            const modify=await UserModel.findById(id)
            console.log(modify.isModify);
            if(!modify.isModify){
               
                let code = codeERSali()
                console.log(code);
                const otp1=await UserModel.findOneAndUpdate({_id:id},
                    {"$set":{"otp.code":code,"otp.expireIn":30000}}

                );
                console.log(otp1);
                return res.status(HttpStatus.OK).json({
                    statusCodes:HttpStatus.OK,
                    where:'/UserControllerClass/checkIsModifyAndSendCodeAccount',
                    Modified:otp1.isModified,
                    Data:otp1
                });
            }


            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCodes:HttpStatus.INTERNAL_SERVER_ERROR,
                where:'/UserControllerClass/checkIsModifyAndSendCodeAccount',
                Modified:"Failed",
                
            });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCodes:HttpStatus.INTERNAL_SERVER_ERROR,
                where:'/UserControllerClass/checkIsModifyAndSendCodeAccount',
                Modified:false,
                Error:error
            });
        }
       }

    
    async  checkIsModifyAndGetCodeAccount(req,res) {
           try {
            const {codeOTP , id}=req.body
            const user=await UserModel.findById(id)
            console.log(user);
            if(user.otp.code==codeOTP){
                    console.log("code is correct");
                    await UserModel.findOneAndUpdate(
                            {_id:id},
                      
                          { "$set":{"isModify":true} });

                    return res.status(HttpStatus.OK).json({
                        statusCodes:HttpStatus.OK,
                        where:'/UserControllerClass/checkIsModifyAndGetCodeAccount',
                        Modified:user.isModified,
                        Data:user
                    });

            }
           } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCodes:HttpStatus.INTERNAL_SERVER_ERROR,
                where:'/UserControllerClass/checkIsModifyAndGetCodeAccount',
                Modified:false,
                Error:error
            });
           }


        
       }


}

module.exports={
    UserControllerAuth:new UserControllerClass()
}