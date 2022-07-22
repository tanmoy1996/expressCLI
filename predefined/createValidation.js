const createValidation = (schema)=>{
  return `
import Joi from '@hapi/joi';
const new${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}Validation = Joi.object({
  ${schema.properties.map((props)=>{ return (` ${props.name}:Joi.${props.type.toLowerCase()}()${props.required?'.required()':''},`) }).join('\n')}
})
const update${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}Validation = Joi.object({
  ${schema.properties.map((props)=>{ return (`${props.name}:Joi.${props.type.toLowerCase()}(),`)}).join('\n')}
  id: Joi.string().required(),
})

export {
  new${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}Validation, 
  update${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)}Validation,
};`
}
module.exports = { createValidation }

