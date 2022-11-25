import Target  from '../models/target.js';
import  express  from 'express';
import Joi from 'joi';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/',auth, async(req,res) => {
    try{
        const targets = await Target.find()
        .sort({date: -1});
        const filteredTargets = targets.filter(target => target.uid === req.user._id)
        res.send(filteredTargets); 
    } catch(error){
        res.status(500).send(error.message);
        console.log(error.message);
    }
})

router.post('/',auth, async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(70).required(),
        author: Joi.string().min(2).max(24),
        uid: Joi.string(),
        isComplete: Joi.boolean(),
        date: Joi.date()
    })

    const {error} = schema.validate(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const {name, author, isComplete, date, uid} = req.body;
    
    let target = new Target({
        name, 
        author, 
        isComplete, 
        date, 
        uid, 
    });

    try{
        target = await target.save();
        res.send(target);
    } catch(error){
        res.status(500).send(error.message);
        console.log(error.message)
    }
});

router.put('/:id',auth, async(req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(70).required(),
        author: Joi.string().min(2).max(24),
        uid: Joi.string(),
        isComplete: Joi.boolean(),
        date: Joi.date()
    });

    const {error} = schema.validate(req.body)

    if(error) return res.status(400).send(error.details[0].message);

    try{   
    const target = await Target.findById(req.params.id);

    if(!target) return res.status(404).send('Target not found .');

    if(target.uid !== req.user._id) 
      return res.status(401).send('Target update failed, user not authorized.');

    const {name, author, isComplete, date, uid} = req.body;

    
        const updatedTarget = await Target.findByIdAndUpdate(
            req.params.id, 
        {
            name, 
            author, 
            isComplete, 
            date, 
            uid, 
        }, 
        {new: true}
        );
    
        res.send(updatedTarget);
    } catch(error){
        res.status(500).send(error.message);
        console.log(error.message)
    }
    
});

router.patch("/:id", auth, async (req,res) => {
    const target = await Target.findById(req.params.id);

    if (!target) return res.status(404).send("Target not found.");
    if(target.uid !== req.user._id) 
      return res.status(401).send('Target check/uncheck failed, user not authorized.');

    try{
       const updatedTarget = await Target.findByIdAndUpdate(req.params.id, {
        isComplete: !target.isComplete,
    }, {new: true});

    res.send(updatedTarget)
    } catch(error){
        res.status(500).send(error.message);
        console.log(error.message);
    }
});

router.delete('/:id',auth, async(req,res) => {
    try{

    const target = await Target.findById(req.params.id);
    if (!target) return res.status(404).send('Target not found.')
        const deleteTarget = await Target.findByIdAndDelete(req.params.id);
    if(target.uid !== req.user._id) 
      return res.status(401).send('Target deletion failed, user not authorized.');

        res.send(deleteTarget);
    } catch(error){
        res.status(500).send(error.message);
        console.log(error.message);
    }
    });

export default router;
