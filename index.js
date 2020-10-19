const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileupload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
// console.log(process.env.DB_USER);







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ntkdr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;





const app = express()

app.use(bodyParser.json());
app.use(cors());
// app.use(express.static('services'));
app.use(fileupload());


const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db("creativeAgencyClient").collection("collect");
    const orderCollection = client.db("creativeAgencyClient").collection("order");
    const reviewCollection = client.db("creativeAgencyClient").collection("review");
    const adminCollection = client.db("creativeAgencyClient").collection("admin");


    // add service
    app.post('/addService', (req, res) => {
        const file = req.files.file;
        const title = req.body.title;
        const description = req.body.description;
        // console.log(file, title, description);
        const newImg = req.files.file.data;
        const encImg = newImg.toString('base64');
        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        }
        serviceCollection.insertOne({ title, description, image })
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //see service in client
    app.get('/seeService', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    // //order
    app.post('/addOrder', (req, res) => {
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const service = req.body.service;
        const description = req.body.description;
        const price = req.body.price;
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        };

        orderCollection.insertOne({ name, email, service, description, price, image })
            .then(result => {
                res.send(result);
            })
    })

    app.get('/orders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })

    })
    // //

    app.get('/totalorders', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })

    })

    // //review
    app.post('/review', (req, res) => {
        const name = req.body.name;
        const description = req.body.description;
        const designation = req.body.designationAndCompany;
        const newImg = req.files.file.data;
        // console.log(name, description, designation);
        const encImg = newImg.toString('base64');
        var img = {
            contentType: req.files.file.mimetype,
            size: req.files.file.size,
            img: Buffer.from(encImg, 'base64')
        }
        // console.log(name, description, designation, img);
        reviewCollection.insertOne({ name, description, designation, img })
            .then(result => {
                console.log(result);
                res.send(result)
            })
    })

    // //get review
    app.get('/seeReview', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // // set admin
    app.post('/setAdmin', (req, res) => {
        const email = req.body.email;
        console.log(email);
        adminCollection.insertOne({ email })
            .then(result => {
                console.log(result);
                res.send(result)
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })

});

app.listen(process.env.PORT || port)