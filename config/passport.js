const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/User');
const key = require('../config/keys');
const opts= {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey =  key.secretOrKey;

module.exports = passport => {
 passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{//payload in user.js
//console.log(jwt_payload);
     User.findById(jwt_payload.id)
         .then(user => {
             if(user){
                 return done(null , user);
             }
             return done(null, false);//no user
             }
         )
         .catch((err)=>console.log(err));
 }));
};
//export the server.js