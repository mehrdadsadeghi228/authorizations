const { UserModel } = require("../models/user.model");
const {StatusCodes: HttpStatus} = require("http-status-code");
const bcrypt=require('bcrypt');
const  empty = require('is-empty');

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
module.exports={
    CheckExistUser,
    newHashPass,
    compareHashPass,
    codeERSali
}