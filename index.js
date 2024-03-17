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
    sent:[],
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
    recieved:[],
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
    sent:[],
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
    recieved:[],
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
app.post("/thome",(req,res)=>{
    res.render("thome",{useremail:req.body.email});
});
app.get("/lhome",(req,res)=>{
    res.render("lhome",{useremail:req.body.email});
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
app.post("/rooms",(req,res)=>{
    const ue=req.body.email;
    console.log(ue);
    Tenant.findOne({email:ue}).then((t)=>{
        Landowner.find({city:t.city,__v:0,roomsavail:{$gte:t.roomsreq}}).then((r)=>{
            res.render("rooms",{owners:r,useremail:ue});
        })
    });
});
app.get("/tenantdetails",(req,res)=>{
    res.render("tenantdetails");
});
app.post("/tenantdashboard",(req,res)=>{
    const ue=req.body.email;
    var ten;
    Tenant.findOne({email:ue}).then((t)=>{
        ten=t.sent;
    });
    var x=[];
    var yo=[];
    for(var i=0;i<ten.length;i++){
        var t=0;
        var e=ten[i];
        for(var j=0;j<x.length;j++){
            f=x[j];
            if(f===e){
                t=1;
            }
            if(t===0){
                x.push(e);
                Landowner.findOne({email:e},(o)=>{
                    yo.push(o);
                });
            }
        }
    }
    res.render("tenantsdashboard",{ownners:yo});
});
app.post("/request",(req,res)=>{
    const ue=req.body.useremail;
    const oe=req.body.owneremail;
    var ten;
    Tenant.findOne({email:ue}).then((t)=>{
        var arr=t.sent.length>0?t.sent:[];
        arr.push(oe);
        Tenant.findOneAndUpdate({email:ue},{sent:arr});
    });
    Landowner.findOne({email:oe}).then((t)=>{
        var arr=t.recieved.length>0?t.recieved:[];
        arr.push(ue);
        Landowner.findOneAndUpdate({email:oe},{recieved:arr});
    });
    // Tenant.findOne({email:ue}).then((t)=>{
    //     ten=t.requestsent;
    // });
    // var x=[];
    // var yo=[];
    // for(var i=0;i<ten.length;i++){
    //     var t=0;
    //     var e=ten[i];
    //     for(var j=0;j<x.length;j++){
    //         f=x[j];
    //         if(f===e){
    //             t=1;
    //         }
    //         if(t===0){
    //             x.push(e);
    //             Landowner.findOne({email:e},(o)=>{
    //                 yo.push(o);
    //             });
    //         }
    //     }
    // }
    res.render("thome",{useremail:ue});
});
app.listen(3000,()=>{
    console.log("server started");
});