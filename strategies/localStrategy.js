const localStrategy = require('passport-local')
module.exports = new localStrategy(async(username , password , done)=>{
   console.log(username , password);
   
})