const { UserController } = require('../controllers/user.controllers');

const router=require('express').Router();


router.get('/',UserController.UserIndex());

module.exports={
    userRouter:router
}