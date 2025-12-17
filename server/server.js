import { db } from './dbConnection.js';
import cors from "cors";
import express from "express";

const app = express();

//config cors
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`This app is running on port ${PORT}`));

app.post("/sendForm", async (req, res) => {
    try{
        const totalCO2 = req.body.totalCO2;
        const query = await db.query(
            `INSERT INTO userData (totalCO2) VALUES ($1)`,
            [totalCO2]
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