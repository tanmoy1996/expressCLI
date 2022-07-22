const createRoute = (schema)=>{
  return `
import express from 'express';
import createError from 'http-errors';
import ${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)} from '../models/${schema.name.toLowerCase()}.js';
import { new${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}Validation, update${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}Validation, } from '../helper/validation/${schema.name.toLowerCase()}.js';

const router = express.Router();

router.post('/', async (req,res, next)=>{
  try {
    const validatedReq = await new${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}Validation.validateAsync(req.body);
    const ${schema.name.toLowerCase()} = new ${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}(validatedReq);
    
    const savedObject = await ${schema.name.toLowerCase()}.save();
    res.send(savedObject);
  } catch (error) {
    if(error.isJoi === true) error.status = 422;
    next(error);
  }
})

router.get('/', async (req,res, next)=>{
  try {
    const ${schema.name.toLowerCase()} = await ${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}.find();
    res.send(${schema.name.toLowerCase()})
  } catch (error) {
    next(error);
  }  
})

router.patch('/', async (req,res, next)=>{
  try {
    const validatedReq = await update${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}Validation.validateAsync(req.body);
    const ${schema.name.toLowerCase()} = await ${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}.findById(validatedReq.id);
    if(!${schema.name.toLowerCase()}) throw createError.NotFound('${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)} not present')

    Object.assign(${schema.name.toLowerCase()},validatedReq);
    const saved${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)} = await ${schema.name.toLowerCase()}.save();
    
    res.send(saved${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)});
  } catch (error) {
    if(error.isJoi === true) error.status = 422;
    next(error);
  }
})

router.delete('/', async (req,res, next)=>{
  try {
    const id = req.query.id;
    if(!id) throw createError.UnprocessableEntity();

    const ${schema.name.toLowerCase()} = await ${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}.findById(id);
    if(!${schema.name.toLowerCase()}) throw createError.NotFound('${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)} not found')
    const removed${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)} = await ${schema.name.toLowerCase()}.remove();
    res.send(removed${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)});
  } catch (error) {
    next(error);
  }  
})

export default router;`
}
module.exports = { createRoute }