const { Pool } = require("pg");
const express = require ('express')
const cors = require('cors');

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

const pool = new Pool({
    user: "app",
    password: "12345",
    host: "localhost",
    port: 5432,
    database: "zithara",
  });

app.get('/getUsers',async (req,res)=>{
    pool.query("SELECT * FROM users;", (err, result) => {
        if (err) console.error(err);
        res.status(200).json(result.rows);
    })
})

app.listen(port, () => {
    console.log("Server started at port " + port);
});