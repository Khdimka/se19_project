import Joi from "joi";
import express  from "express";
import User from "../models/user.js";
import bcrypt from 'bcrypt'; 
import  jwt  from "jsonwebtoken";

const router = express.Router();

router.post('/', async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(24).required(),
        email: Joi.string().min(2).max(90).required().email(),
        password: Joi.string().min(5).max(200).required(),
      })

    const { error } = schema.validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    
    try{
    let user = await User.findOne({ email: req.body.email})
    if (user) return res.status(400).send("User already registered.");
    const { name, email, password } = req.body;

    user = new User({
        name,email, password
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    const secretKey = process.env.SECRET_KEY
    const token = jwt.sign({_id: user._id, name: user.name, email: user.email}, secretKey)
    res.send(token);

    res.send("User succsesfuly created!")
    
    } catch(error){
        res.status(500).send(error.message);
        console.log(error.message);
    } 
})

export default router;