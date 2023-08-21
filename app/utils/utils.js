const { UserModel } = require("../models/user.model");
const {StatusCodes: HttpStatus} = require("http-status-code");
const bcrypt=require('bcrypt');
const  empty = require('is-empty');
const jwt = require("jsonwebtoken");

async function CheckExistUser(username){
    const exist=await UserModel.findOne({userName:username})
    if(empty(exist)){
         return  res.status(HttpStatus.BAD_REQUEST).json({
        statusCodes:HttpStatus.BAD_REQUEST,
        where:'/UserControllerClass/signupUser',
        message:errorValidator
            });
        }  
    return false
}

function newGenSalt(){
    return newPass= bcrypt.genSaltSync(12)

}
function newHashPass(password){
    return newPass= bcrypt.hashSync(password,newGenSalt())

}
function compareHashPass(password,userInter){
    return newPass= bcrypt.compareSync(password,userInter)

}
function codeERSali(){
    return Math.round(Math.random()*100000)
}


function CreatedJWT(jsonData,key){
    return jwt.sign(jsonData, key,{ expiresIn: '1h' })
}
function CreatedRefreshJWT(jsonData,key){
    return jwt.sign(jsonData, key,{ expiresIn: '1y' })
}
function CreatedRefreshIfJWT(RefreshToken,key,jsonData,keyAccessToken){
    jwt.verify(RefreshToken,key, (err, user) => {
        if (err) {
            return  res.status(HttpStatus.BAD_REQUEST).json({
                statusCodes:HttpStatus.BAD_REQUEST,
                where:'/utils/CreatedRefreshIfJWT',
                message:err
                    });
                } 
        const accessToken = CreatedJWT(jsonData,keyAccessToken)
        return  res.status(HttpStatus.BAD_REQUEST).json({
            statusCodes:HttpStatus.BAD_REQUEST,
            where:'/utils/CreatedRefreshIfJWT',
            accessToken:accessToken
                });
            
        });
}
function checkRefreshToken(RefreshToken,keyRefreshToken){
    return jwt.verify(RefreshToken, keyRefreshToken)
}
function checkAccessesToken(AccessToken,keyReToken){
    return jwt.verify(AccessToken, keyReToken)
}


module.exports={
    CheckExistUser,
    newHashPass,
    compareHashPass,
    codeERSali,
    CreatedJWT,
    CreatedRefreshJWT,
    CreatedRefreshIfJWT,
    checkRefreshToken,
    checkAccessesToken

}