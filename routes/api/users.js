const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const User = require('../../models/User');
const bcrypt =require('bcryptjs');

//@router   Get api/users/test
//@desc     Tests user route
//@access   Public
router.get('/test', (req, res) => res.json({msg : "User Works"}));

//@router   post api/users/register
//@desc     register user
//@access   Public
router.post('/register', (req, res) => {
    User.findOne({ email : req.body.email})
        .then((user) => {
            if(user) {
                return res.status(400).json({email : 'Email already exists'});
            }else{
                const avatar  = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg',  //pg
                    d: 'mm'  //Default
                });


                const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        avatar,
                        password: req.body.password
                    });


                bcrypt.genSalt(10 ,(err,salt)=>{  //hash the password to security
                    bcrypt.hash(newUser.password , salt, (err ,hash)=>{
                    if(err) throw err;
                    newUser.password =hash;
                        newUser
                         .save()
                         .then(user => res.json(user))
                         .catch(err=>console.log(err));

                    })
                })
            }
        })
});











module.exports =router;