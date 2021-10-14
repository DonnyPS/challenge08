const express = require('express');
const {body} = require('express-validator');
const Room = require('../models/room');
const apiController = require('../controllers/api');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/admin/allUsers', isAuth, apiController.allUsers);

router.put('/create-room', isAuth, [
  body('name')
    .custom((value, {req}) =>{
      return Room.findOne({name: value})
        .then(roomName=>{
          if(roomName){
            return Promise.reject('Room already exist!');
          }
        })
    })
], apiController.createRoom); //buat room

router.get('/fight/:room', isAuth, apiController.fightRoom); //masuk room

router.put('/fight/:room', isAuth, apiController.playGame); //main game

router.get('/result/:room', apiController.resultGame); //result game

module.exports = router;