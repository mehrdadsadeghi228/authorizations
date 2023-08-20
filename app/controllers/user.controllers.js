const Controller = require("./controller");
const createError = require("http-errors");
const {StatusCodes: HttpStatus} = require("http-status-codes");

class UserController extends Controller{

    UserIndex(res,req,next) {
        res.StatusCodes(HttpStatus.OK).json({
            statusCodes:HttpStatus.OK,
            message:'index page User'
        });
    }



}


module.exports={
    UserController:new UserController()
}