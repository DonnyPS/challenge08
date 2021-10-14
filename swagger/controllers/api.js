const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gameResult = [];
let p1Scors = 0;
let p2Scors = 0;
const User = require('../models/user');
const Room = require('../models/room');
const HistoryGame = require('../models/user_game_history');

exports.allUsers = async(req, res, next)=>{
  const users = await User.find({});
  res.send(users);
}

exports.createRoom = (req, res, next)=>{
  const {name} = req.body;
  const errors = validationResult(req);
  let loadedRoom;
  if(!errors.isEmpty()){
    const error = new Error('Failed to create room!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error
  }
  const room = new Room({
    name, 
    createdBy: req.userId
  })
  loadedRoom = room;
  
  const token = jwt.sign(
      {
        name: loadedRoom.name,
        userId: loadedRoom._id.toString()
    },
    'thisissecret',
    {expiresIn: '1h'}
  )
  room.save()
    .then(result=>{
      res.status(200).json({
        message: 'Room Created!',
        room_name: room.name,
        room_id: room._id,
        token
      })
    })
    .catch(err=>{
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    })
}

exports.fightRoom = (req, res, next)=>{
  const roomId = req.params.room;
  Room.findById(roomId)
    .then(room =>{
      if(!room){
        const error = new Error("Room doesn't exist. Please create new room!");
        error.statusCode = 404;
        throw error
      }
      res.status(200).json({message: 'Berhasil masuk room!'});
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

exports.playGame = (req, res, next)=>{
  let p1Choice = req.body.p1Choice;
  let choice = ['R', 'P', 'S'];
  let random = Math.floor(Math.random()*3);
  let p2Choice = choice[random];
  let winner;

  if(!p1Choice){
    res.status(401).json({message: 'Player 1 Choice (p1Choice) is required!'});
  }

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    const error = new Error('Failed to play the game!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error
  }
  const historyGame = new HistoryGame({
    p1Scors,
    p2Scors,
    winner: 'belum ada',
    game_room: req.params.room,
  });

  if(p1Choice === 'R' || p1Choice === 'P' ||p1Choice === 'S'){
    console.log(p1Choice, p2Choice);
    if(gameResult.length < 3){
      switch(p1Choice+p2Choice){
        case 'SS':
        case 'PP':
        case 'RR':
          gameResult.push('draw');
          res.json(gameResult)
          break;
        case 'RS':
        case 'SP':
        case 'PR':
          p1Scors++;
          console.log(p1Scors)
          gameResult.push('p1');
          res.json(gameResult)
          break;
        case 'SR':
        case 'PS':
        case 'RP':
          p2Scors++
          console.log(p2Scors);
          gameResult.push('p2');
          res.json(gameResult)
          break;
      }
      return gameResult
    }else{
      if(historyGame.p1Scors > historyGame.p2Scors){
        historyGame.winner = 'P1'
      }else if(historyGame.p1Scors === historyGame.p2Scors){
        historyGame.winner = 'draw'
      }else{
        historyGame.winner = 'P2'
      }
        console.log(gameResult);
        historyGame.save()
          .then(result=>{
            res.status(201).json({
              message: 'GAME OVER!',
              winner,
              p1Scors,
              p2Scors
            })
          })
          .catch(err=>{
            if(!err.statusCode){
              err.statusCode = 500;
            }
            next(err);
          })
    }
  }else{
    res.status(401).json('Tolong isi input pilihan dengan benar! Pilih R, P, dan S.')
  }
}

exports.resultGame = (req, res, next)=>{
  const roomId = req.params.room;
  HistoryGame.findOne({game_room: roomId})
    .then(game =>{
      if(!game){
        const error = new Error("History Game doesn't exist.");
        error.statusCode = 404;
        throw error
      }
      console.log(game);
      res.status(200).json({
        message: 'History game',
        winner: game.winner,
        p1Scors: game.p1Scors,
        p2Scors: game.p2Scors,
        game_room: game.game_room
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}