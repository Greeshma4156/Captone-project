import { UserTypeModel } from "../models/UserModel.js"
export const checkAuthor=async (req,res,next)=>{
    //get author id from the body and the paramaeters
    const aid=req.body?.author||req.params?.authorId
    //verify author
    const author = await UserTypeModel.findById(aid);
    //if author not found
    if(!author)
        {
            return res.status(401).json({message:"Invalid author"})
        }
    //if author is found but role is different
    if (author.role !== "AUTHOR")
    {
        return res.status(403).json({message:"user is not author"})
    }
    //if author is blocked
    if (!author.isActive)
    {
        return res.status(403).json({message:"Author account is not active"})
    }
        next()
}