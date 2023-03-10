const express=require('express')
const mongoose=require('mongoose')
const jwt=require("jsonwebtoken")
const secreteKey="secreteKey"


var cors = require('cors')

const app=express()
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors())



mongoose.connect("mongodb+srv://vishal:vishal@cluster0.ngbzanr.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true,

},(err)=>{
    if(err){
        console.log("mongoDB not connected");
    }else{
        console.log("Successfully Connected");
    }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sch={
    email:String,
    password:String
}

//bellow we define collections allinoneusers database name test
const monmodel=mongoose.model('allinoneusers',sch)


app.post("/post",async(req,res)=>{
    console.log("inside the post function",req.body);
    const data=new monmodel({
        email:req.body.email,
        password:req.body.password
    })

    const val=await data.save()
    //bellow line we commented because we only have token that user crete when user get login
    // res.json(val)

    console.log("get res of post request",val);

    //when we get repose we send that response in jwt token
    //this token expire in 5 min that is 300 sec 
    jwt.sign({val},secreteKey,{expiresIn:'300s'},(err,token)=>{
        res.json({
            token
        })
        // console.log("get token in console",token)
    })


})

app.post("/profile",verifyToken,(req,res)=>{
    //in jwt.verify here we check genrated token add get token are same or not , if same then we get that user creaditional
    // console.log("profil req token",req.token);
    jwt.verify(req.token,secreteKey,(err,authdata)=>{
        if(err){
            res.send({
                result:"Invalid Token, Token expire"
            })
        }else{
            res.json({
                message:"profile access",
                authdata
            })
        }
    })
})


//here we pass req of token that get by post request of login 
function verifyToken(req,res,next){
    //here we get token we pass in body 
    const bearerbody=req.body.authentication
    // console.log("get rew body",bearerbody);
    if(typeof bearerbody !== 'undefined'){
        const bearer=bearerbody
        const token= bearer
        req.token=token;
        next()
    }else{
        res.send({
            result:'Token is not valid'
        })
    }
}


app.get("/get",async(req,res)=>{
   monmodel.find({},(err,data)=>{
    if(data==null){
        res.send("nothing found")
    }else{
        res.send(data)
        console.log("get api res");
    }
   })
})


//get existing email
app.post("/get/:email",async(req,res)=>{
    let userEmail=req.params.email
    console.log("get email in console",userEmail);
    monmodel.find({email:userEmail},(err,data)=>{
     if(data==null){
         res.send("nothing found")
     }else{
         res.send(data)
         console.log("get email api res",data);
     }
    })
 })

 //check login creadintioal is right or not
 app.post("/auth",async(req,res)=>{
    const body={
        email:req.body.email,
        password:req.body.password
    }
    console.log("body of auth",body);
    monmodel.find(body,(err,data)=>{
     if(data==null){
         res.send("nothing found")
     }else{
         res.send(data)
         console.log("user auth found api res",data);
     }
    })
 })


app.post("/getid/:id",async(req,res)=>{
    let userId=req.params.id;
    monmodel.findById({_id:userId},(err,data)=>{
        if(data==null){
            console.log("not get data");
        }else{
            res.send(data)
            console.log("user by id res",data);
        }
    })
})

app.put("/update/:id",async(req,res)=>{
    let userId=req.params.id;
    let emailId=req.body.email;
    let passwordId=req.body.password;

    monmodel.findByIdAndUpdate({_id:userId},{$set:{email:emailId,password:passwordId}},{new:true},(err,data)=>{
        if(data==null){
            res.send("nothing found")
        }else{
            res.send(data)
            console.log("display updated data",data);
        }
    })
})

app.post("/delete/:id",async(req,res)=>{
    let userId=req.params.id;
    monmodel.findByIdAndDelete({_id:userId},(err,data)=>{
        if(data==null){
            res.send("nothing found")
        }else{
            res.send(data)
            console.log("display deleted data",data);
        }
    })
})



app.listen(3000,()=>{
    console.log("on port 3000 !!!");
})
