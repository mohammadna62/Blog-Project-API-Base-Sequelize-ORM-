const { User } = require('../db');
const bcrypt = require("bcrypt")
const localStrategy = require('passport-local').Strategy

module.exports = new localStrategy(async(username , password , done)=>{

   const user = await User.findOne({
      where:{
         username
      },
      raw: true, //* For resave Raw Data
   })
   if(!user)return done(null,false)
      const isPasswordValid = await bcrypt.compare(password,user.password)
   if(!isPasswordValid)return done(null,false)
      return done(null,user) //* set this user to req.user = user

})