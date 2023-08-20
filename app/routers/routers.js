const { UserController } = require('../controllers/user.controllers');
const { userRouter } = require('./user.router');

const router=require('express').Router();


router.get('/',userRouter);

module.exports=router();
