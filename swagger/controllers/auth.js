const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


//DASHBOARD
exports.getSignUp = (req, res, next)=>{
  let message = req.flash('error');

    if(message.length > 0){
        message = message[0];   
    }else{
        message = null
    }

  res.render('auth/signup',{
    title: 'Sign Up',
    errorMessage : message,
    oldInput:{
      email:'',
      password:'',
      confirmPassword: ''
    },
    validationError:[]
  });
}

exports.postSignUp = (req, res, next)=>{
  const {email, password} = req.body;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log(errors.array())
    return res.status(422).render('auth/signup', {
      title:'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email:email,
        password:password, 
        confirmPassword: req.body.confirmPassword
      },
      validationError: errors.array()
    })
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPassword =>{
      const user = new User({
        email, password: hashedPassword, role: 'admin'
      })
      return user.save()
    })
    .then(result =>{
      res.redirect('/login');
    })
    .catch(err=>{
      console.log(err);
      res.redirect('/signup')
    })
}

exports.getLogin = (req, res, next)=>{
  let message = req.flash('error');

  if(message.length > 0){
      message = message[0];   
  }else{
      message = null
  }
  res.render('auth/login', {
    title: 'Login',
    errorMessage : message,
  });
}

exports.postLogin = (req, res, next)=>{
  const {email, password} = req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('auth/login',{
      title: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email, password
      },
      validationError : errors.array()
    })
  }
  User.findOne({email})
    .then(user =>{
      if(user.role !== 'admin'){
        return res.status(422).render('auth/login',{
          title: 'Login',
          errorMessage: 'Not Admin!',
          oldInput: {
            email, password
          },
          validationError: []
        })
      }
      if(!user){
        return res.status(422).render('auth/login',{
          title: 'Login',
          errorMessage: 'Invalid email!',
          oldInput: {
            email, password
          },
          validationError: []
        })
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if(doMatch){
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err=>{
              res.redirect('/')
            });
          }
          return res.status(422).render('auth/login', {
            title: 'Login',
            errorMessage: 'Invalid Password!',
            oldInput:{
              email,
              password
            },
            validationError : []
          })
        })
        .catch(err=>{
          console.log(err, 'something wrong');
          res.redirect('/login')
        })
    })
    .catch(err=>{
      console.log(err, 'eror ni')
    })
}

exports.getDataUsers = async (req, res, next)=>{
  const users = await User.find({});
  res.render('auth/datausers',{
    title: 'Data Users',
    users
  })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
      res.redirect('/login');
  });
}

exports.getHome = (req, res, next)=>{
  res.render('auth/home',{
    title: 'Homepage'
  })
}

//API
exports.adminRegister = (req, res, next)=>{
  const errors = validationResult(req);
  const {email, name, password} = req.body;
  if(!errors.isEmpty()){
    const error = new Error('Validation Failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPw =>{
      const user = new User({
        email: email,
        password: hashedPw,
        role: 'admin'
      });
      return user.save()
    })
    .then(result=>{
      res.status(201).json({message: 'Register berhasil, silahkan login!', role: result.role})
    })
    .catch(err=>{
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.playerRegister = (req, res, next)=>{
  const errors = validationResult(req);
  console.log(errors);
  const {email, password} = req.body;
  if(!errors.isEmpty()){
    const error = new Error('Validation Failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPw =>{
      const user = new User({
        email: email,
        password: hashedPw,
        role: 'player'
      });
      return user.save()
    })
    .then(result=>{
      res.status(201).json({message: 'Register berhasil, silahkan login!', role: result.role})
    })
    .catch(err=>{
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.playerLogin = (req, res, next) => {
  const {email, password} = req.body;
  let loadedUser;

  User.findOne({email})
    .then(user => {
      if(!user){
        const error = new Error('User not found!')
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual =>{
      if(!isEqual){
        const error = new Error('Wrong Password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'thisissecret',
        {expiresIn: '1h'}
      )
      res.status(200).json({token, userId: loadedUser._id.toString(), role: loadedUser.role});
    })
    .catch(err=>{
      if(!err.statusCode){
        err.statusCode = 500
      }
      next(err)
    })
}

exports.adminLogin = (req, res, next) => {
  const {email, password} = req.body;
  let loadedUser;

  User.findOne({email})
    .then(user => {
      if(user.role !== 'admin'){
        const error = new Error('User Admin is not found!')
        error.statusCode = 401; //not authorized / not yet login
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual =>{
      if(!isEqual){
        const error = new Error('Wrong Password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'thisissecret',
        {expiresIn: '1h'}
      )
      res.status(200).json({token, userId: loadedUser._id.toString(), role: loadedUser.role});
    })
    .catch(err=>{
      if(!err.statusCode){
        err.statusCode = 500
      }
      next(err)
    })
}
