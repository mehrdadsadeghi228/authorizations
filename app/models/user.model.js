const { default: mongoose } = require("mongoose");

const userSchema=new mongoose.Schema({
    userName:{type:String,require:true,unique:true},
    name:{type:String,require:true},
    lastName:{type:String,require:true},
    mobile:{type:Number,Min:11,max:12,require:true},
    email:{type:String,require:true},
    password:{type:String, min: 6 , max: 15 ,require:true}


},{
    timestamps:true
});



module.exports={
    UserModel:mongoose.model("userSchema",userSchema)
};