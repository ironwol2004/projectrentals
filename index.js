const express=require("express");
const bodyParser=require("body-parser");
const _=require("lodash");
const mongoose=require("mongoose");
const ejs=require("ejs");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://admin-ironwol:IronWol2004@ironwol.znds0nw.mongodb.net/projectrentals",{useNewUrlParser:true});
const tenantsSchema=new mongoose.Schema({
    name:String,
    members:Number,
    roomsreq:Number,
    durationdays:Number,
    parkingreq:Boolean,
    drinkorsmoke:Boolean,
    id:String,
    pass:String,
    constact:Number,
    requesstsent:[String],
    gotroom:Boolean
});
const landownersSchema=new mongoose.Schema({
    name:String,
    address:String,
    roomsavail:Number,
    parkingavail:Boolean,
    id:String,
    pass:String,
    drinkersorsmokerspermitted:Boolean,
    requestsrecieved:[String],
    roomempty:Boolean
});
const Tenant= mongoose.model("Tenant",tenantsSchema);
const Landowner= mongoose.model("Landowner",landownersSchema);
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.get("/",(req,res)=>{
    res.render("signin");
});
app.get("/wantroomform",(req,res)=>{
    res.render("wantroomform");
});
app.get("/home",(req,res)=>{
    res.render("home");
});
app.get("/about",(req,res)=>{
    res.render("about");
});
app.get("/landownerdetails",(req,res)=>{
    res.render("landownerdetails");
});
app.get("/ownerdashboard",(req,res)=>{
    res.render("landownersdashboard");
});
app.get("/rentroomform",(req,res)=>{
    res.render("rentroomform");
});
app.get("/rooms",(req,res)=>{
    res.render("rooms");
});
app.get("/tenantdetails",(req,res)=>{
    res.render("tenantdetails");
});
app.get("/tenantdashboard",(req,res)=>{
    res.render("tenantsdashboard");
});
app.listen(3000,()=>{
    console.log("server started");
});