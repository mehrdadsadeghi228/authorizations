require('dotenv').config();

const Controller = require("./base.Controller");
const {StatusCodes: HttpStatus} = require("http-status-codes");
const bcrypt=require('bcrypt');
const { CheckExistUser, newHashPass, codeERSali, CreatedJWT, CreatedRefreshJWT, CreatedRefreshIfJWT, checkRefreshToken, checkAccessesToken } = require("../utils/utils");
const { UserModel } = require("../models/user.model");
const {validationResult}=require('express-validator')
const  empty = require('is-empty');
const userModel = require("../models/user.model");
const JWT=require('jsonwebtoken');
const KEYTOKEN="6d65687264616473616465676869";
const KEYREFRESH="6865646e686d6a672c6a632c63686b2c6b6a2c6b6b2c686b2e";



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

        const tokenAccess = CreatedJWT({id:newUser._id,Username:newUser.userName},KEYTOKEN);
        const RefreshToken=CreatedRefreshJWT({id:newUser._id,Username:newUser.userName},KEYREFRESH)

        return res.status(HttpStatus.OK).json({
                statusCodes:HttpStatus.OK,
                where:'/UserControllerClass/signupUser',
                Modified:newUser.isModified,
                tokenAccess:tokenAccess,
                RefreshToken:RefreshToken,
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
            if(this.CheckAccessToken()){
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    statusCodes:HttpStatus.UNAUTHORIZED,
                    where:'/UserControllerClass/checkIsModifyAndGetCodeAccount',
                    Modified:false,
                    message: "Token of "
                });
            }
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
    
       async CheckRefreshTokenAndCreatedAccessToken(req,res,next){
        const {refreshToken ,id}= req.body;
        const newUser=await UserModel.findById(id);
        if (refreshToken == null) return res.sendStatus(HttpStatus.UNAUTHORIZED)
        if (!refreshTokens.includes(refreshToken)) return res.sendStatus(HttpStatus.UNAUTHORIZED)
       
        return CreatedRefreshIfJWT(refreshToken,KEYREFRESH,{id:newUser._id,Username:newUser.userName},KEYTOKEN)
      


    }
    CheckAccessToken(req,res){
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)        
        checkAccessesToken(token,KEYTOKEN)
        return true
    }


}

module.exports={
    UserControllerAuth:new UserControllerClass()
}