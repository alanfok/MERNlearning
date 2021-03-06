const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')

const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys =require('../../config/keys');
const passport =require('passport');//router the passport in the config

//User Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');



// Load User model
const User = require('../../models/User');

//@router   Get api/users/test
//@desc     Tests user route
//@access   Public
router.get('/test', (req, res) => res.json({msg : "User Works"}));

//@router   post api/users/register
//@desc     register user
//@access   Public
router.post('/register', (req, res) => {
    const {errors, isValid } = validateRegisterInput(req.body);
        // Check Validation
    if(!isValid){
            return res.status(400).json(errors);
        }





    User.findOne({ email : req.body.email})
        .then((user) => {
            if(user) {
                errors.email= 'Email already exists';
                return res.status(400).json(errors);
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


//@router   Get api/users/login
//@desc     Login user / Returning JWT Token
//@access   Public
router.post('/login', (req, res) =>{

    const {errors, isValid } = validateLoginInput(req.body);
    // Check Validation
    if(!isValid){
        return res.status(400).json(errors);
    }


    const email = req.body.email;
    const password = req.body.password;

    // find user by email

    User.findOne({email})
        .then((user)=>{
            if(!user){
                errors.email = 'User not found';
                return res.status(404).json(errors)
            }

            //check password
            bcrypt.compare(password,user.password).then(isMatch=>{
                if(isMatch){
                   //User Matched

                    const payload= { id : user.id, name: user.name, avatar: user.avatar}

                    //Sign Token
                    jwt.sign(payload,
                        keys.secretOrKey,// save in config
                        {expiresIn: 3600 }, // expired time
                        (err, token)=>{
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    });




                }else {
                    errors.password= 'Password incorrect'
                    return res.status(400).json(errors);
                }
            })
        })

});




//@router   Get api/users/current
//@desc     Return current route
//@access   Private


router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
       // res.json({msg: "success"});
        res.json(req.user);//return the object
    }
);



module.exports =router;