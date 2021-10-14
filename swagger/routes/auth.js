const express = require('express');
const {check, body} = require('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth');
const adminAuth = require('../middleware/admin-auth');
const router = express.Router();

//DASHBOARD
router.get('/', authController.getHome);

router.get('/signup', authController.getSignUp);

router.post('/signup', [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email!')
    .custom((value, {req})=>{
      console.log(value)
      return User.findOne({email : value})
        .then(userDoc =>{
          if(userDoc){
            return Promise.reject(
            'Email sudah terdaftar, silakan gunakan email lain.'
            )
          }
        })
    })
    .normalizeEmail(),
  body('password')
      .isLength({min :5})
      .withMessage( 'Password must be have at least 5 character.')
      .isAlphanumeric()
      .trim(),
  body('confirmPassword').custom((value, {req})=>{
    if(value !== req.body.password){
      throw new Error('Password and Confirm Password must be the same!');
    }
    return true;
  })
],
authController.postSignUp
);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/datausers', adminAuth, authController.getDataUsers);

//API

router.put('/admin/register', [
  body('email')
    .isEmail()
    .withMessage('Periksa kembali data anda!')
    .custom((value, {req}) =>{
      return User.findOne({email: value})
        .then(userDoc=>{
          if(userDoc){
            return Promise.reject('Email already exist!');
          }
        })
    })
    .normalizeEmail(),
  body('password').trim().isLength({min: 5}),
  body('name')
    .trim()
    .isEmpty()
], 
authController.adminRegister);

router.put('/api/register', [
  body('email')
    .isEmail()
    .withMessage('Periksa kembali data anda!')
    .custom((value, {req}) =>{
      return User.findOne({email: value})
        .then(userDoc=>{
          if(userDoc){
            return Promise.reject('Email already exist!');
          }
        })
    })
    .normalizeEmail(),
  body('password').trim().isLength({min: 5}),
], 
authController.playerRegister);

router.post('/api/login', authController.playerLogin);
router.post('/admin/login', authController.adminLogin);

module.exports = router;