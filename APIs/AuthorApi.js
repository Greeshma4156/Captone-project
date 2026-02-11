import exp from "express";
import { authenticate,register } from "../Services/authService.js";
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const authorRoute=exp.Router()

//Register author
authorRoute.post('/users',async(req,res)=>{
    //get user obj from req
    let userObj=req.body;
    //call register
    const newUserObj=await register({...userObj,role:"AUTHOR"})
    //send res
    res.status(201).json({message:"Author created",payload:newUserObj})
});


//Authenticate author

//create article
authorRoute.post('/articles',verifyToken,checkAuthor,async(req,res)=>{
    //get article from req
    let article=req.body
    //create article document
    let newArticleDoc=new ArticleModel(article)
    //save
    let createdArticleDoc=await newArticleDoc.save()
    //send res
    res.status(201).json({message:"article created",payload:createdArticleDoc})
})


//Read articles of author
authorRoute.get('/articles/:authorId',verifyToken,checkAuthor,async(req,res)=>{
    //get author id
     let aid=req.params.authorId;
    //read articles by this author which are active
    let articles=await ArticleModel.find({author:aid,isArticleActive:true}).populate("author","firstName email")
    //send res
    res.status(200).json({message:"articles",payload:articles})
})

//Edit article
authorRoute.put('/articles',verifyToken,checkAuthor,async(req,res)=>{
    //get modified article from req
    let {articleId,title,category,content,author}=req.body
    //find article
    let articleOfDB=await ArticleModel.findOne({_id:articleId,author:author})
    if(!articleOfDB){
        return res.status(401).json({message:"Article not found"})
    }
    //update the article
    let updatedArticle=await ArticleModel.findByIdAndUpdate(articleId,
        {$set:{ title,category,content }},
        { new:true});
    //send res(updated article)
     res.status(200).json({message:"Article updated",payload:updatedArticle})
})

//delete(soft delete) article
authorRoute.put('/articles/:articleId',verifyToken,checkAuthor,async(req,res)=>{
    let {articleId}=req.params
    //find article
    let articleOfDB=await ArticleModel.findOne({_id:articleId,author:req.userId})
    if(!articleOfDB){
        return res.status(401).json({message:"Article not found"})
    }
    //update isActive to false
    let modifiedArticle=await ArticleModel.findByIdAndUpdate(articleId,{$set:{isArticleActive:false}},{new:true});
    //send res
    res.status(200).json({message:"Article modified",payload:modifiedArticle})

})