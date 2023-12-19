const express = require('express');
const path = require('path');
const app = express();
const port = 4131;
const data = require("./data")

app.set("views", "templates");
app.set("view engine", "pug");

app.use(express.json());

app.use("/resources", express.static("/resources"));
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res)=> {
    let pageNum = parseInt(req.query.page) || 1;
    let orderBy = req.query.orderby || "id";
    let pageLimit = 10;
    let messages = await data.getMessages(pageNum, pageLimit, orderBy);
    let allMessageCount = (await data.getAllMessages()).length;
    let totalPages = Math.ceil(allMessageCount / pageLimit);
    res.status(200).render("mainpage", {messages:messages, totalPages, currentPage:pageNum, orderBy:orderBy});
});

app.get("/main", async (req, res)=> {
    let pageNum = parseInt(req.query.page) || 1;
    let orderBy = req.query.orderby || "id";
    let pageLimit = 10;
    let messages = await data.getMessages(pageNum, pageLimit, orderBy);
    let allMessageCount = (await data.getAllMessages()).length;
    let totalPages = Math.ceil(allMessageCount / pageLimit);
    res.status(200).render("mainpage", {messages:messages, totalPages, currentPage:pageNum, orderBy:orderBy});
});

app.get("/login", async (req, res)=> {
    res.status(200).render("login");
});

app.get("/createaccount", async (req, res)=> {
    res.status(200).render("createaccount");
});

app.get("/account", async (req, res)=> {
    
    res.status(200).render("myaccount");
});

app.get("/create-post", async (req, res)=> {
    res.status(200).render("createpost");
});

app.get("/css/main", async (req, res)=> {
    res.status(200).type("text/css").sendFile(path.join(__dirname, "resources/css/main.css"));
});

app.get("/js/main.js", async (req, res)=> {
    res.status(200).type("text/javascript").sendFile(path.join(__dirname, "resources/js/main.js"));
});

app.get("/js/account.js", async (req, res)=> {
    res.status(200).type("text/javascript").sendFile(path.join(__dirname, "resources/js/account.js"));
});

app.get("/js/post.js", async (req, res)=> {
    res.status(200).type("text/javascript").sendFile(path.join(__dirname, "resources/js/post.js"));
});

app.get("/js/createaccount.js", async (req, res)=> {
    res.status(200).type("text/javascript").sendFile(path.join(__dirname, "resources/js/createaccount.js"));
});


app.post("/api/checkuser", async (req, res)=>{
    let user = await data.login(req.body.username, req.body.password);
    if(!user) {
        res.status(400).type("text/plain").send("invalid");
    }
    else {
        res.status(200).type("text/plain").send("valid");
    }
});

app.post("/login", async (req, res)=>{
    let user = await data.login(req.body.username, req.body.password);
    if(!user) {
        res.status(400).render("loginerror", {message:"Username or password incorrect"})
    }
    res.status(200).render("login", {userInfo:user})
});

app.post("/create-account", async (req, res)=>{
    let user = await data.createAccount(req.body.username, req.body.password);
    if(!user) {
        res.status(400).render("loginerror", {message:"Failed to create account"})
    }
    let user2 = await data.login(req.body.username, req.body.password);
    res.status(200).render("createaccount", {userInfo:user2})
});

app.post("/api/getPostsByUser", async (req, res)=>{
    let pageNum = parseInt(req.body.page) || 1;
    let orderBy = req.body.orderby || "id";
    let pageLimit = 10;
    let posts = await data.getPostsByUser(req.body.id, pageNum, pageLimit, orderBy);
    let allMessageCount = (await data.getAllPostsByUser(req.body.id)).length;
    let totalPages = Math.ceil(allMessageCount / pageLimit);
    res.status(200).type("application/json").send({posts:posts, totalPages, currentPage:pageNum, orderBy:orderBy, allMessageCount:allMessageCount})
});

app.post("/api/create-post", async (req, res)=>{
    let user = await data.login(req.body.username, req.body.password);
    if(user) {
        if(req.body.message.length < 420) {
            let post = await data.createPost(user.id, req.body.message);
            res.status(200).type("text/plain").send("valid");
        }
        else 
            res.status(400).type("text/plain").send("invalid");
    }
    else 
        res.status(400).type("text/plain").send("invalid");
});

app.post("/api/like-post", async (req, res)=>{
    let user = await data.login(req.body.username, req.body.password);
    if(user) {
        let post = await data.likePost(req.body.id);
        res.status(200).type("text/plain").send("valid");
    }
    else 
        res.status(400).type("text/plain").send("invalid");
});

app.post("/api/update-post", async (req, res)=>{
    let user = await data.login(req.body.username, req.body.password);
    if(user) {
        if(req.body.message.length < 420) {
            let post = await data.updatePost(req.body.id, req.body.message);
            res.status(200).type("text/plain").send("valid");
        }
        else 
            res.status(400).type("text/plain").send("invalid");
    }
    else 
        res.status(400).type("text/plain").send("invalid");
});

app.delete("/api/delete-post", async (req, res) => {
    let user = await data.login(req.body.username, req.body.password);
    if(user) {
        let post = await data.deletePost(req.body.id);
        if(post) 
            res.status(200).type("text/plain").send("valid");
    }
});

app.use((req, res, next) => {
    res.status(404).render("404");
});

setTimeout(() => {
    let port = 4131;
    app.listen(port);
    console.log(`Server running on port ${port}`);
  }, 1000);