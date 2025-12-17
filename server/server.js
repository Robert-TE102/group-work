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
    try {
        const totalCO2 = req.body.totalCO2;
        const userName = req.body.name;
        const query = await db.query(
            `INSERT INTO userdata (totalco2, username) VALUES ($1, $2)`,
            [totalCO2, userName]
        );
        res.json({ status: "success", values: totalCO2 });
    } catch (error) {
        res.status(500).json({ Error: error.message });
    }
});

app.get('/readForm', async (req, res) => {
    try {
        // const query = await db.query(`SELECT * FROM userData;`);
        const query = await db.query(`SELECT * FROM (
   SELECT * FROM userData ORDER BY id DESC LIMIT 20
)Var1
   ORDER BY id ASC;`);
        res.json(query.rows);
    } catch (error) {
        console.log("db error: ", error);
        res.status(500).json({ Error: error.message });
    }
});

