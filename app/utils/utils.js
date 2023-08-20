const { UserModel } = require("../models/user.model");
const {StatusCodes: HttpStatus} = require("http-status-code");

async function CheckExistUser(username){
    const exist=await UserModel.findOne({userName:username})
    if(!exist) throw "user is Exist"
    return exist
}

module.exports={
    CheckExistUser
}