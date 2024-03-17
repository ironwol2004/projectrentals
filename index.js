const express=require("express");
const session=require("express-session");
const bodyParser=require("body-parser");
const _=require("lodash");
const mongoose=require("mongoose");
const ejs=require("ejs");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://admin-ironwol:IronWol2004@ironwol.znds0nw.mongodb.net/projectrentals",{useNewUrlParser:true});
app.use(session({
    secret:'this is secret',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false,httpOnly:true}
}));
const tenantsSchema=new mongoose.Schema({
    name:String,
    members:Number,
    roomsreq:Number,
    duration:Number,
    email:String,
    pass:String,
    contact:Number,
    city:String,
    state:String,
    requestsent:[String],
    gotroom:Boolean
});
const landownersSchema=new mongoose.Schema({
    name:String,
    address:String,
    roomsavail:Number,
    email:String,
    pass:String,
    city:String,
    state:String,
    requestrecieved:[String],
    roomempty:Boolean
});
const Tenant= mongoose.model("Tenant",tenantsSchema);
const Landowner= mongoose.model("Landowner",landownersSchema);
app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.get("/",(req,res)=>{
    res.render("signin");
});
app.post("/",(req,res)=>{
    var tenant=req.body.user==="Tenant"?true:false;
    if(tenant){
        Tenant.findOne({email:req.body.email}).then((t)=>{if(t && t.pass===req.body.pass){
            res.render("thome",{useremail:t.email});
        }
        else if(t){
            res.redirect("/");
        }
        else{
            const temp={
                email:req.body.email,
                pass:req.body.pass
            };
            res.render("wantroomform",{user:temp});
        }});
        
    }
    else{
        Landowner.findOne({email:req.body.email}).then((l)=>{
            if(l && l.pass===req.body.pass){
                res.render("lhome",{useremail:l.email});
            }
            else if(l){
                res.redirect("/");
            }
            else{
                const temp={
                    email:req.body.email,
                    pass:req.body.pass
                };
                res.render("rentroomform",{user:temp});
            }
        });
        
    }
});
app.post("/wantroomform",(req,res)=>{
    const temp=new Tenant({
    name:req.body.name,
    members:req.body.members,
    roomsreq:req.body.rooms,
    duration:req.body.duration,
    email:req.body.email,
    pass:req.body.pass,
    contact:req.body.contact,
    requestsent:[],
    gotroom:false,
    city:req.body.city,
    state:req.body.city
    });
    temp.save();
    res.render("thome",{useremail:temp.email});
});
app.post("/rentroomform",(req,res)=>{
    const temp=new Landowner({
        name:req.body.name,
    address:req.body.address,
    roomsavail:req.body.rooms,
    email:req.body.email,
    pass:req.body.pass,
    requestrecieved:[],
    city:req.body.city,
    state:req.body.state,
    roomfull:false
    });
    temp.save();
    res.render("lhome",{useremail:temp.email});
});
app.get("/wantroomform",(req,res)=>{
    res.render("wantroomform");
});
app.get("/thome",(req,res)=>{
    res.render("thome");
});
app.get("/lhome",(req,res)=>{
    res.render("lhome");
});
app.get("/tabout",(req,res)=>{
    res.render("tabout");
});
app.get("/labout",(req,res)=>{
    res.render("labout");
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