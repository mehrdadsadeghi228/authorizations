const { body } = require('express-validator');

const validatorUser=[
    body('userName').notEmpty().trim().isString().toLowerCase(),
    body('name').notEmpty().trim().isString().toLowerCase().isLength({min:3,max:15}).withMessage(" name is not valid"),
    body('lastName').notEmpty().trim().isString().toLowerCase().isLength({min:3,max:15}).withMessage(" lastName is not valid"),
    body('email').isEmail().normalizeEmail().notEmpty().withMessage(" email is not valid"),
    body('password').notEmpty().isString().isLength({min:6 ,max:15}).trim().withMessage(" password is not valid"),
    body('mobile').notEmpty().isNumeric().isMobilePhone('ir-IR').withMessage(" mobile is not valid")

]
module.exports={
    validatorUser
}