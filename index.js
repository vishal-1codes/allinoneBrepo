const express=require('express')
const mongoose=require('mongoose')
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

const monmodel=mongoose.model('users',sch)


app.post("/post",async(req,res)=>{
    console.log("inside the post function",req.body);
    const data=new monmodel({
        email:req.body.email,
        password:req.body.password
    })

    const val=await data.save()
    res.json(val)

})

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
