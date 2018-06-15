const path=require('path');
const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const postsRoutes= require("./routes/posts");
const userRoutes = require("./routes/user");

//User monog 'erik-mongo' and Password mongo 'uhZ4Qv1LBt9Qimvu'
//Ip for mongo db:177.228.49.30
mongoose.connect("mongodb+srv://erik-mongo:"+process.env.MONGO_ATLAS_PW +"@clusterignitiweb-hcvs7.mongodb.net/node-angular")
.then(() => {
    console.log('DataBase Connected!');
})
.catch((error)=>{
    console.log('The data base connection has been failed!'+error);
});



const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images",express.static(path.join("backend/images")));

app.use((req, res,next)=>{
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
        "Access-Control-Allow-Headers", 
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"); 
        next();
    });

app.use("/api/posts",postsRoutes);
app.use("/api/user",userRoutes);


module.exports=app;