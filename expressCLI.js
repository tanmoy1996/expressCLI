const modelBuilder = require('./predefined/createSchema');
const routeBuilder = require('./predefined/createRoute');
const validationBuilder = require('./predefined/createValidation');
const appBuilder = require('./predefined/createApp');

var fs = require('fs');

var prompt = require('prompt-sync')({sigint:true});
var types=['','String','Number','Date','Boolean']

var schemas =[];
while(true){
  var name = prompt('Model name :');
  name= name.trim().split(' ').join('').toLowerCase()
  
  var properties = [];
  
  while(true){
    var property = {}
    console.log(`Define Properties of ${name.toUpperCase()}`)
  
    property.name = prompt('Name :');
    if(property.name=='') break;
  
    for(var i in types){
      if(i==0) console.log()
      else console.log(`${i}. ${types[i]}`)
    }
    var type = prompt('Type :');
    property.type = types[type];
    
    console.log('\nRequired?')
    console.log('Y. Yes')
    console.log('N. No')
    var req = prompt('');
    if(req.toLowerCase()=='y'){
      property.required = true;
    }
    else {
      property.required = false;
    }
  
    properties.push(property);
    property={};
  }
  var schema = { name, properties }
  schemas.push(schema);

  console.log('\nCreate another model?')
  console.log('Y. Yes')
  console.log('N. No')
  var another = prompt('');
  if (another.toLowerCase() =='y') continue;
  else break;
}

createServer();

async function createServer(){
  var appContent = appBuilder.createApp(schemas.map(s=>s.name));
  await makeFolders();
  await schemas.forEach(generateFile);
  fs.copyFile("predefined/mongoConnectionFile.txt", "server/helper/connect-mongo.js",(err)=>{});
  fs.copyFile("predefined/userValidation.txt", "server/helper/validation/user.js",(err)=>{});
  fs.copyFile("predefined/userSchema.txt", "server/models/user.js",(err)=>{});
  fs.copyFile("predefined/userRoute.txt", "server/router/user.js",(err)=>{});
  fs.copyFile("predefined/env.txt", "server/.env",(err)=>{});
  fs.writeFile("server/app.js", appContent, function (err) { if (err) throw err;});
  fs.copyFile("predefined/package.txt", "server/package.json",(err)=>{});
}
async function makeFolders(){
  await fs.mkdir('server',function (err) { if (err) throw err;});
  await fs.mkdir('server/helper',function (err) { if (err) throw err;});
  await fs.mkdir('server/helper/validation',function (err) { if (err) throw err;});
  await fs.mkdir('server/models',function (err) { if (err) throw err;});
  await fs.mkdir('server/router',function (err) { if (err) throw err;});
}
async function generateFile(schema){
  var schemaContent = modelBuilder.createSchema(schema);
  var schemaValidation = validationBuilder.createValidation(schema);
  var routecontent = routeBuilder.createRoute(schema);
  fs.writeFile(`server/helper/validation/${schema.name.toLowerCase()}.js`, schemaValidation, function (err) { if (err) throw err;});
  fs.writeFile(`server/models/${schema.name.toLowerCase()}.js`, schemaContent, function (err) { if (err) throw err;});
  fs.writeFile(`server/router/${schema.name.toLowerCase()}.js`, routecontent, function (err) { if (err) throw err;});
}