const mongoose =require ("mongoose");
mongoose.connect("mongodb+srv://hrishabh1800:uIzYLsK2d1ClpixB@cluster0.xu6y95e.mongodb.net/paytm");
// database name = paytm

// defining the schema 
// trim is for ignoring the white spaces
const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:30,
        trim:true
    },
    password : {
        type:String,
        required:true,
        minLength:6
    },
    firstName : {
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    lastName :{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    }
});

const accountSchema = new mongoose.Schema({
    userId : {
        type :mongoose.Schema.Types.ObjectId, 
        ref:'User',
        required:true
    },
    balance:{
        type :Number,
        required:true
    }
})
// Create a model for the userSchema
const User = mongoose.model('User',userSchema);
const Account = mongoose.model('Account',accountSchema);
module.exports ={
    User,
    Account
}