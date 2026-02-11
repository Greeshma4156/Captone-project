import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()
export const verifyToken=async(req, res, next)=>{
    //token verification logic

    //get token from req ( using cookie-parser)
    let Token = req.cookies.token //{ token : "" }
    if (Token === undefined){
        return res.status(400).json({message:"please login first"})
    }
    //verify token validity(decode)
    //if token is invalid , it will throw a error so we use try catch as its not not a part of express or we can use verify
    let decodedToken = jwt.verify(Token,process.env.JWT_SECRET)
    //send to next middleware
    req.user=decodedToken
    next()
}