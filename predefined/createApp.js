const createApp = (schemaNames)=>{
  return `
import express from 'express'
import createError from 'http-errors';
import 'dotenv/config';
import './helper/connect-mongo.js';
import userRoute from './router/user.js'
${schemaNames.map(schema=>{return `import ${schema}Route from './router/${schema}.js'`}).join('\n')}

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(process.env.PORT,()=>{
  console.log("Connect to PORT "+process.env.PORT)
})
  
app.get('/', async(req,res,next)=>{ res.send("Hello Buddy!!!");})
app.get('/api', async(req,res,next)=>{ res.send(new Date().toDateString());})
app.use('/api/user/', userRoute);
${schemaNames.map(schema=>{return `app.use('/api/${schema.toLowerCase()}/', ${schema}Route);`}).join('\n')}

app.use((req, res, next)=>{
  next(createError.NotFound())
})
  
app.use((err, req, res, next)=>{
  res.status(err.status || 500)
  res.send({
    error:{
      status: err.status || 500,
      message: err.message,
    }
  })
})`
}
module.exports = { createApp }