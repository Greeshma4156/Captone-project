import exp from 'express'
import {connect} from 'mongoose'
import {config} from 'dotenv'
import { userRoute } from './APIs/UserApi.js'
import { authorRoute } from './APIs/AuthorApi.js'
import { adminRoute } from './APIs/AdminApi.js'
import cookieparser from 'cookie-parser'
import { commonRouter } from './APIs/commonApi.js'
config() //process.env

const app=exp()
//add body parser middleware
app.use(exp.json())
//add cookie parser
app.use(cookieparser())
//connect apis
app.use('/user-api',userRoute)
app.use('/author-api',authorRoute)
app.use('/admin-api',adminRoute)
app.use('/common-api',commonRouter)

//connect to db
const connectDB=async()=>{
    try{
        await connect(process.env.DB_URL)
        console.log("DB connection is success")
        //start http server
        app.listen(process.env.PORT,()=>console.log("server started"))
    }catch(err){
        console.log("Error in DB connection", err)
    }
}
connectDB()

//dealing the invalid path
app.use((req,res,next)=>{
    res.json({message:`${req.url} is invalid path` })
})


//error handling middleware
app.use((err,req,res,next)=>{//next is added - to know this is a middleware
    console.log("err:",err)
    res.json({message:"error",reason:err.message})
})