const express = require("express");
const zod = require("zod");
const {User,Account} = require("../db");
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../config");
const { authMiddleWare } = require("./middleware");

const router = express.Router();


const signupBody = zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})
router.post("/signup",async (req,res)=>{
    // for input validation i will use zod
    const {success} = signupBody.safeParse(req.body);
    if(!success){
        console.log("hello");
        return res.status(411).json({
            "messgage":"Email already taken or invalid input"
        });
    }
    const isExisting = await User.findOne({
        username:req.body.username
    })
    if(isExisting){
        return res.status(411).json({
            "message" :"Email already taken or invalid input"
        })
    }
    const user = await User.create({
        username :req.body.username,
        password :req.body.password,
        firstName:req.body.firstName,
        lastName :req.body.lastName
    })
    const userid = user._id;

    await Account.create({
        userId:userid,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userid
    },JWT_SECRET);
    
    res.json({
        "message":"User created successfully ",
        "token":token
    })
})

router.post("/signin",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const doesExist = await User.findOne({
        username,
        password
    })
    if(!doesExist){
        return res.status(411).json({
            message:"Error while logging in"
        })
    }
    const userid = doesExist._id;
    const token = jwt.sign({
        userid
    },JWT_SECRET);
    res.status(200).json({
        token
    })
})
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName :zod.string().optional(),
    lastName : zod.string().optional(),
})
router.put("/update",authMiddleWare,async (req,res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        return res.json({
            messgage :"Error while updating information "
        })
    }
    const doc = await User.updateOne({
        _id:req.userId
    },req.body)
 

    res.json({
        message: "Update successfully"
    });
})
router.get("/bulk",authMiddleWare,async (req,res)=>{
    const filter = req.query.filter||"";
    console.log(filter);
    const users = await User.find({
        $or:[{
                firstName:{
                "$regex":filter
            }
        },{
                lastName:{
                "$regex":filter
            }
        }]
    })
    console.log(users);
    res.json({
        user : users.map(user=>({
            username :user.username,
            firstName:user.firstName,
            lastName :user.lastName,
            id:user._id
        }))
    });
})
module.exports = router;