const createSchema = (schema)=>{
  return `
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ${schema.name}Schema = new Schema({
  ${schema.properties.map((props)=>{ return (
  `${props.name}:{
    type:${props.type},
    required:${props.required}
  },
  `)
    }).join('')
 }}, 
  {
    timestamps:true,
    versionKey: false
  })
  
  const ${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)} = mongoose.model('${schema.name}', ${schema.name}Schema);
  export default ${schema.name.charAt(0).toUpperCase()+schema.name.substring(1)};
  `
}
module.exports = { createSchema }