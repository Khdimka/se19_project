import  targets  from './routes/targets.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import signUp from './routes/signUp.js';
import signIn from './routes/signIn.js';

dotenv.config();

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/targets", targets)
app.use("/api/signup", signUp)
app.use("/api/signin", signIn)

app.get('/', (req,res) => {
    res.send('Welcome to our api.')
})

const db_string = process.env.DB_STRING
const port = process.env.PORT || 5001

app.listen(port, () => {
    console.log(`Connection good at ${port}`)
})

mongoose.connect(db_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}) 
.then(() => console.log("MongoDB connection established."))
.catch((error) => console.error('conection failed', error.message))