import exp from "express"
import { authenticate } from "../Services/authService.js"
import { UserTypeModel } from "../models/UserModel.js"
import bcrypt from "bcrypt"
export const commonRouter = exp.Router()

//login
commonRouter.post("/login",async(req,res)=>{
    //get user creditiantial object
        let userCred=req.body
        //call authenticate services
        let{token,user}=await authenticate(userCred)
        //save token as httpOnly cookie
        res.cookie("token",token,{
            httpOnly:true,
            sameSite:"lax",
            secure:false
        });
        //send res 
        res.status(200).json({message:"login success",payload:user})
})


//logout for user,author and admin
commonRouter.get('/logout',(req,res)=>{
    //clear the cookie named 'token
    res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:'lax'
    })
    res.status(200).json({message:"logged out successfully"});
})



//change password
commonRouter.put('/change-password',async(req,res)=>{
    //get current password and new password
    let {email,currentPassword,newPassword}=req.body

    const user=await UserTypeModel.findOne({email});
    if (!user){
        const err=new Error ("Invalid email ")
        err.status=401;
        throw err;
    }

    
    //check the current password is correct
    const isMatch=await bcrypt.compare(currentPassword,user.password)
        if (!isMatch){
            const err=new Error ("Invalid password")
            err.status=401;
            throw err;
        }
    

        let updatedPassword=await bcrypt.hash(newPassword,10)
    //replace current password with the new password

    let updatedUser=await UserTypeModel.findByIdAndUpdate(user._id,{$set:{password:updatedPassword}},{new:true})
    //send res
    res.status(200).json({message:"password is updated"})
})