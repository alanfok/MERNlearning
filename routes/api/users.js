const express = require('express');
const router = express.Router();
const gravatar = require('gravatar')
const User = require('../../models/User');
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys =require('../../config/keys');
const passport =require('passport');


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


//@router   Get api/users/login
//@desc     Login user / Returning JWT Token
//@access   Public
router.post('/login', (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;

    // find user by email

    User.findOne({email})
        .then((user)=>{
            if(!user){
                return res.status(404).json({email : 'User not found'})
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
                    return res.status(400).json({password: 'Password incorrect'});
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
        res.json(req.user);//return the object
    }
);



module.exports =router;