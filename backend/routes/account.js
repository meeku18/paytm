const express = require("express");
const { authMiddleWare } = require("./middleware");
const { Account} = require("../db");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/balance",authMiddleWare,async (req,res)=>{
    const userid = req.userId;
    //console.log(userid);
    const account= await Account.findOne({
        userId: userid
    })
    //console.log(account);
    res.status(200).json({
        balance : account.balance
    })
})

router.post("/transfer",authMiddleWare,async (req,res)=>{
    // const {to,amount} = req.body;
    // console.log(req.userId);
    // const fromAccount = await Account.findOne({userId:req.userId});
    // //console.log(fromAccount);
    // // i have to send from my account to 'to' account
    // const toAccount = await Account.findOne({userId:to});
    // if(!toAccount){
    //     return res.json({
    //         message:"Invalid account"
    //     })
    // }
    // if(fromAccount.balance< amount){
    //     return res.json({
    //         message:"Insufficient Balance"
    //     })
    // }
    // await Account.findOneAndUpdate({userId:req.userId},{$inc:{balance:-amount}});
    // await Account.findOneAndUpdate({userId:to},{$inc:{balance:amount}});
    // res.json({
    //     message:"Tranfer Successfull"
    // })
    //----------------------------------------- above approach has some issue when 2 user simulataneously request for the change or when 1 transaction gets failed and other gets sucessfully updateed---------

    // to remove these isse i will use session provided by mongo
    const session = await mongoose.startSession();
    session.startTransaction();
    const {amount,to } = req.body;

    // sender account 
    const fromAccount = await Account.findOne({
        userId : req.userId
    }).session(session);

    if(!fromAccount || fromAccount.balance< amount){
        await session.abortTransaction();
        return res.json({
            message :"Insufficient Balance"
        });
    }
    if(to===req.userId){
        return res.json({
            message:"Cannot send money to yourself"
        })
    }

    const toAccount = await Account.findOne({
        userId:to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.json({
            message:"Invalid account"
        })
    }

    await Account.updateOne({userId:req.userId},{$inc:{balance : -amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance : amount}}).session(session);
    await session.commitTransaction();
    res.json({
        message :"Transfer successfull"
    })
    
})

module.exports = router;