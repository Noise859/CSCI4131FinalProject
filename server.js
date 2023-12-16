const express = require('express');
const path = require('path');
const app = express();
const basicAuth = require('express-basic-auth');
const port = 4131;

app.set("views", "templates");
app.set("view engine", "pug");

app.use(express.json());

app.use("/resources", express.static("/resources"));
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    const originalSend = res.send;

    res.send = function (body) {
        console.log(`${req.method} ${req.url} with status ${res.statusCode} \n  - contactsList.length=${contactsList.length} : saleMessage=\"${saleMessage}\"`);

        originalSend.call(this, body);
    };

    next();
});

app.get("/", async (req, res)=> {
    res.status(200).render("mainpage");
});

app.get("/main", async (req, res)=> {
    res.status(200).render("mainpage");
});

app.get("/css/main", async (req, res)=> {
    res.status(200).type("text/css").sendFile(path.join(__dirname, "resources/css/main.css"));
});

app.get("/js/main.js", async (req, res)=> {
    res.status(200).type("text/javascript").sendFile(path.join(__dirname, "resources/js/main.js"));
});

app.get("/js/contact.js", async (req, res)=> {
    res.status(200).type("text/javascript").sendFile(path.join(__dirname, "resources/js/contact.js"));
});

app.get("/js/table.js", async (req, res)=> {
    res.status(200).type("text/javascript").sendFile(path.join(__dirname, "resources/js/table.js"));
});

app.get("/js/confetti.js", async (req, res)=> {
    res.status(200).type("text/javascript").sendFile(path.join(__dirname, "resources/js/confetti.js"));
});

app.get("/js/sale.js", async (req, res) => {
    res.status(200).type("text/javascript").sendFile(path.join(__dirname, "resources/js/sale.js"));
});

app.get("/api/sale", async (req, res) => {
    res.status(200).type('application/json').send(saleMessage);
});

app.post("/contact", async (req, res)=>{
    var contactAdded = false;
    if(req.body) {
        if(req.body.nname != ("" || undefined || null) && req.body.eemail.includes("@") && req.body.eemail != ("" || undefined || null) && req.body.ddate != ("" || undefined || null) & req.body.mmoney != ("" || undefined || null)){
            contactAdded = true;
            var rred = "No :(";
            if(req.body.ccheckbox == "on") {rred = "Yes :)"}
            contactsList.push({
                id: contactsList.length,
                name: req.body.nname,
                email: req.body.eemail,
                preferredMeetingDate: req.body.ddate,
                money: req.body.mmoney,
                red: rred
            });
            res.status(201).render("contactsubmitted");
        }
    }
    else {
        res.status(400).render("contacterror");
    }
    
    if(!contactAdded) {
        res.status(400).render("contacterror");
    }
});

app.post("/api/sale", async (req, res)=> {
    if(req.body.message != (null || undefined)){
        if(req.body.message == ""){
            res.status(400).type("text/plain").send("Message property empty");
        }
        else {
            saleMessage = req.body.message;
            res.status(200).type("text/plain").send(saleMessage);
        }   
    }
    else {
        res.status(400).type("text/plain").send("Message property invalid");
    }
});

app.delete("/api/contact", async (req, res) => {
    var contactFound = false;
    for(contact in contactsList) {
        if(contactsList[contact].id == req.body.id) {
            contactsList.splice(contact, 1)
            contactFound = true;
            res.status(200).send("ok");
            break 
        }
    }
    if(!contactFound) { res.status(404).type("text/plain").send("id not found");}
});

app.delete("/api/sale", async (req, res) => {
    saleMessage = "";
    res.status(200).type("text/plain").send("ok");
});

app.use((req, res, next) => {
    res.status(404).render("404");
});

app.listen(port , () => {
    console.log(`App listening on port ${port}`);
});