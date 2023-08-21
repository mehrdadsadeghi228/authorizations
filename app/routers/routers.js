const { UserRouter } = require('./user.router');

const router=require('express').Router();


router.use(UserRouter);

module.exports=router;
