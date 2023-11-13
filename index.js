
const express = require('express');
const ejs = require('ejs');
require('dotenv').config()
const session = require("express-session");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connect = require("connect-flash")
const Todos = require("./models/todos");



mongoose.connect("process.env.MONGODB_URI",{})
.then(()=>{
    console.log("Database Connected")
}).catch(()=>{
    console.log("Database not connected")
})

const app = express();

app.use("/public", express.static("Assets"));
app.use(bodyParser.urlencoded({ extended: true }));


app.set("view engine", "ejs");

//home page
app.get('', (req, res)=>{
    Todos.find().sort({createdAt: -1})
    .then((result)=>{
        res.render("index", {title: "Home", todos:result})
    })
    .catch((err)=>{
        console.log(err)
    })
})


//add
app.get("/add",(req, res)=>{
    let err =" "
    res.render("add", {title:"AddTodo", err: err})
})
app.post("/add", (req, res)=>{
    const todo = new Todos(req.body);
    todo.save().then((result)=>{
        // console.log(result)
        res.redirect('/')
    }).catch((err)=>{
        
        if(err){
    const message = (`*** ${err._message}: Field cannot be empty ***`);
            res.render('add', {err:message, title: "AddTodo"})
            
        }
     
    })
});

app.post('/add',(req,res) => {

})

//delete 
app.post("/delete/:id", (req, res)=>{
    Todos.findByIdAndDelete(req.params.id)
    .then ((result)=> {
        res.redirect("/")
    })
    .catch((err)=>{
        console.log(err)
    })
})
//edit or update
app.get("/edit/:id", (req ,res )=> {
    Todos.findByIdAndUpdate(req.params.id)
    .then((result) =>{
        let err = ""
        // console.log(result)
        res.render("edit", {todo:result, title: "edit", err})
    })
})

app.post("/edit/:id", (req, res)=>{
    const id= req.params.id;
    Todos.findByIdAndUpdate(id, {...req.body}, {new: true})
    .then((result)=>{
        res.redirect("/")
    })
    .catch((err)=>{
        console.log(err)
    })
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on: http://localhost:${process.env.PORT}`)
})