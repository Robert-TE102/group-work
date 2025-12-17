import { db } from './dbConnection.js';
import cors from "cors";
import express from "express";

const app = express();

//config cors
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`This app is running on port ${PORT}`));

console.log(`test line 14`);

app.post("/sendForm", async (req, res) => {
    try{
        const totalCO2 = req.body.totalCO2;
        const userName = req.body.name;
        console.log(req.body);
        console.log(totalCO2);
        const query = await db.query(
            `INSERT INTO userdata (totalco2, username) VALUES ($1, $2)`,
            [totalCO2, userName]
        );
        res.json({status: "success", values: totalCO2});
    } catch(error){
        res.status(500).json({Error: error.message});
    }
});

app.get('/readForm', async (req, res) => {
    try{
        const query = await db.query(`SELECT id, totalCO2 FROM userData;`);
        res.json(query.rows);
        console.log(query.rows);
    } catch(error){
        console.log("db error: ", error);
        res.status(500).json({Error: error.message});
    }
});

// app.delete('/:id', async (req, res) => {
//     try{    
//         const objRow = req.params.id;
//         const query = await db.query(`DELETE FROM messageboard WHERE id = ${objRow}`)
//     } catch (error){
//         console.error(`Error Message line 43: ${error.message}`);
//     }
// });