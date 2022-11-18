import Joi from "joi";
import express  from "express";
import User from "../models/user.js";
import bcrypt from 'bcrypt'; 
import  jwt  from "jsonwebtoken";

const router = express.Router();

router.post("/", async (req, res) => {
    const schema = Joi.object({
      email: Joi.string().min(2).max(90).email().required(),
      password: Joi.string().min(5).max(200).required(),
    });
  
    const { error } = schema.validate(req.body);
  
    if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Invalid email or password.");

        const validpassword = await bcrypt.compare(req.body.password, user.password)
        if(!validpassword)
            return res.status(400).send("Invalid email or password.");
            const secretKey = process.env.SECRET_KEY
            const token = jwt.sign({_id: user._id, name: user.name, email: user.email}, secretKey)
            res.send(token);
    } catch(error){
        res.status(500).send(error.message);
        console.log(error.message);
    } 
})  

export default router;