//dependencies declaration

const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');


app.use(express.json());
app.use(cors());
dotenv.config();


//db connection
const db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

//check if connected to db
db.connect((err) =>{
    //No
    if(err) return console.log("error connecting to db");

    //yes
    console.log("successfully connected to db as id: ", db.threadId);

    //my code goes here

    // 1 initialize
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    //question 1
    app.get('/data', (req, res) =>{
        // retrieve data from db
        db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients', (err, results) =>{
            if(err){
                console.error(err);
                res.status(500).send('error retrieving data');

            }else{
                //display records
                res.render('data', {results: results});
            }
        });
    });


    //question2
    app.get('/providers', (req, res)=>{
        //retrieve data from providers table

        db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) =>{
            if(err){
                console.error(err);
                res.status(500).send('error fetching providers data');
            }else{
                //display records
                res.render('providers', {results:results});
            }
        });
    });

    //question 3

    app.get('/patients', (req, res) => {
        const firstName = req.query.first_name;
    
        // If no first name is provided, retrieve all patients
        let query = 'SELECT * FROM patients';
        let queryParams = [];
    
        if (firstName) {
            query += ' WHERE first_name = ?'; // Add condition to query
            queryParams.push(firstName);
        }
    
        // Execute the query
        db.query(query, queryParams, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving data');
            }
            // Render the patients.ejs template with the results
            res.render('patients', { results: results });
        });
    });

    //question 4
    app.get('/specialty', (req, res) => {
        const providerSpecialty = req.query.provider_specialty;

        let query = 'SELECT * FROM providers';
        let queryParams = [];

        if (providerSpecialty) {
            query += ' WHERE provider_specialty = ?'; 
            queryParams.push(providerSpecialty);
        }

        db.query(query, queryParams, (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error retrieving data');
            }
            res.render('specialty', { results: results });
        });
    });

    
    

    app.listen(process.env.PORT, ()=>{
        console.log(`Server listening on port ${process.env.PORT}`);
        
        //send msg to the browser
        console.log('Sending msg to browser....');
        app.get('/', (req, res)=>{
            res.send('server started successfully')
        })
    });
});

