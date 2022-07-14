import express, { json } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import Users from './models/Users.js'
import dayjs from 'dayjs'
import Admins from './models/Admins.js'
import cookieParser from 'cookie-parser'
import { authenticationMiddle, authenticationMiddleware, httpMethodsMiddleware, issueJWT, issueRefreshToken } from './utils/authUtils.js'
import crypto from 'crypto'
import { generatePassword, validatePassword } from './utils/pwdUtils.js'
import { issueJWTAdmin } from './utils/authUtils.js'
import {sendVerificationEmail} from './utils/authUtils.js'
import EmailVerifs from './models/EmailVerifiers.js'
import ParkSpots from './models/parkSpots.js'
import UserSubscription from './models/dbUserSubscription.js'
import Pusher from 'pusher'
import PlaceReservation from './models/PlaceReservation.js'
import Barrier from './models/Barrier.js'
import { reserveTimeChecker } from './utils/reservUtils.js'
import { cp } from 'fs'
//App Config
const pusher = new Pusher({
  appId : process.env.PUSH_APP_ID,
  key : process.env.PUSH_KEY,
  secret : process.env.PUSH_SECRET,
  cluster : "eu",
  useTLS : true
})
const app = express()
const port = process.env.PORT || 9000
// const connection_url =  'mongodb://127.0.0.1:27017/parking'
const connection_url = process.env.MONGO_CONNECTION_URL
//Middleware
app.use(cookieParser())
app.use(express.json())
//app.use(cors())
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(httpMethodsMiddleware)
//DB Config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(
  ()=>{
    console.log('connected')
    ParkSpots.watch().on('change', change=>{
      console.log("change:", change)
      if(change.operationType==="update"){
        const updatedFields = change.updatedFields
        pusher.trigger("parkspots", "updated", {
          updatedFields : updatedFields
        })
      }else{
        console.log('error triggering pusher')
      }
    })
  }
)
app.post('/hello',(req, res)=>{
  ParkSpots.updateOne({name: "1"}, {state: true},(err, result)=>{
    if(err){
      error = true
      errors += err
      console.log(`error`)
      res.status(201).send("bad")
    }else{
      console.log(`success`)
      res.status(201).send("good")
    }
  })
})

  // const msgCollection = db.collection("")
  // const changeStream = msgCollection.watch()
  // changeStream.on('change', change => {
  // console.log(change)
  // if(change.operationType === "insert") {
  // const messageDetails = change.fullDocument
  // pusher.trigger("messages", "inserted", {
  // name: messageDetails.name,
  // message: messageDetails.message,
  // timestamp: messageDetails.timestamp,
  // received: messageDetails.received
  // })
  // } else {
  // console.log('Error trigerring Pusher')
  // }
  // })
// const parS = {
//   name : '6',
//   state : false
// } 
// ParkSpots.create(parS, (err)=> {
//   if(err){
//     console.log('true')
//   }else{
//     console.log('false')
//   }
// })

// const dummyData = {
//   '1' : true,
//   '2' : true,
//   '3' : false,
//   '4' : true,
//   '5' : false,
//   '6' : true
// }
// Object.keys(dummyData).map(function(key, index){
//   ParkSpots.updateOne({name: key}, {state: dummyData[key]},(err, result)=>{
//     if(err){
//       console.log(`error at ${label}`)
//     }else{
//       console.log('Done')
//     }
//   })
// })
//API Endpoints
app.get('/', (req, res) => res.status(200).send('Hello TheWebDev'))
//USERS RESERVATION
// app.post("/users/reservation",reserveTimeChecker, (req, res) =>{
//   const value = req.body.beginTime
//   const newDate = new Date()
//   newDate.setHours(value.split(':')[0])
//   newDate.setMinutes(value.split(':')[1])
//   newDate.setMilliseconds(0)
//   console.log(Date.parse(newDate))
//   const dbPlaceReservation = {
//       ...req.body,
//       beginReservation : Date.parse(newDate),
//       endReservation : Date.parse(newDate) + (parseInt(req.body.reservationDur) * 3600000)
//     }
//   PlaceReservation.create(dbPlaceReservation, (err,data)=>{
//     if(err)
//       res.status(500).json({success: false, message: err})
//     else
//       res.status(201).json({success: true, data: data, message: 'SUCCESSFULY_RESERVED'})     
//     })
// })
function timeToNumber(timeString) {
  var hm = timeString.split(":");
  var hours = Number(hm[0]);
  hours = hours * 60 + Number(hm[1]);
  return hours;
}
function timeCompare(min, max, ref) {
  return (min <= ref) && (ref <= max);
}  
app.post('/users/reservation',(req, res) => {
  let message = {}
  let state = true
  PlaceReservation.find({  namePlace : req.body.namePlace  },(err, reservation)=>{
    if(err){
      res.status(500).json({success: false, message: err})
    }else{
      if(reservation){
        reservation.map(function(r){
        if(timeCompare(timeToNumber(r.beginReservation) + new Date(r.beginDateReservation).getTime(),timeToNumber(r.endReservation) + new Date(r.endDateReservation).getTime(), timeToNumber(req.body.beginReservation) + new Date(req.body.beginDateReservation).getTime()) === true ||
        timeCompare(timeToNumber(req.body.beginReservation) + new Date(req.body.beginDateReservation).getTime(),timeToNumber(req.body.endReservation) + new Date(req.body.endDateReservation).getTime(), timeToNumber(r.beginReservation) + new Date(r.beginDateReservation).getTime()) === true){
          // console.log('begin',timeToNumber(r.beginReservation) +new Date(r.beginDateReservation).getTime())
          // console.log('end',timeToNumber(r.endReservation) +new Date(r.endDateReservation).getTime())
          // console.log('inputbegin',timeToNumber(req.body.beginReservation) + new Date(req.body.beginDateReservation).getTime())
          // console.log('inputend',timeToNumber(req.body.endReservation) + new Date(req.body.endDateReservation).getTime())
          message.beginReservationM = 'BR_TAKEN'
          state = false
        }
        if(timeCompare(timeToNumber(r.beginReservation) + new Date(r.beginDateReservation).getTime(),timeToNumber(r.endReservation) + new Date(r.endDateReservation).getTime(), timeToNumber(req.body.endReservation) + new Date(req.body.endDateReservation).getTime()) === true || 
        timeCompare(timeToNumber(req.body.beginReservation) + new Date(req.body.beginDateReservation).getTime(),timeToNumber(req.body.endReservation) + new Date(req.body.endDateReservation).getTime(), timeToNumber(r.endReservation) + new Date(r.endDateReservation).getTime() === true)){
          message.endReservationM = 'ER_TAKEN'
          state = false 
        }})
        if (state === false){
          res.status(201).json({success :false, message: message}) 
        }
        if(state === true){ 
          const dbPlaceReservation = req.body  
          PlaceReservation.create(dbPlaceReservation, (err,data)=>{
           if(err){
            res.status(500).json({success: false, message: err})
           }
           else{
            res.status(201).json({success: true, data: data, message: 'SUCCESSFULY_RESERVED'})     
           }
          })

        }
      }
    }
  })
})
//FIND ALL THE RESERVATION BY THE PLACE NUMBER
app.get("/users/reservation/:namePlace", (req, res) => {
  PlaceReservation.find({namePlace: req.params.namePlace}, function (err, data) {
    if (err){
      res.status(500).send(err)
  } else {
      res.status(200).send(data)
  }
  }); 
})
//USERS SUBSCRIPTION
// app.post("/users/subscription", (req, res) =>{
//   const dbUserSubscription = req.body
//   UserSubscription.create(dbUserSubscription, (err,data)=>{
//     if(err)
//       res.status(500).json({success: false, message: err})
//     else
//       res.status(201).json({success: true, data: data, message: 'SUCCESSFULY_ADDED'})     
//     })
// })
//CHANGE THE DEFAULT VALUE OF SUBSCRIPTION WHEN A USER FINALLY HAVE A SUBSCRIPTION
app.post("/users/subscription/add/:id", (req, res) => {
        Users.findOneAndUpdate({_id: req.params.id},{
          $set:{
            subscription: 1
          }
        }, function (err, data) {
          if (err){
            res.status(500).send(err)
        } else {
          res.status(200).send({data, message: 'UPDATED_SUBSC'})
        }
        }) 
  })
 //GO BACK TO THE DEFAULT VALUE OF SUBSCRIPTION WHEN A SUBSCRIPTION IS DELETED
app.post("/users/subscription/remove/:id", (req, res) => {
        Users.findOneAndUpdate({_id: req.params.id},{
          $set:{
            subscription: 0
          }
        }, function (err, data) {
          if (err){
            res.status(500).send(err)
        } else {
          res.status(200).send({data, message: 'REMOVED_SUBSC'})
        }
        }) 
  })
// DELETE SUBSCRIPTION
app.delete("/users/subscription/remove/:userId", (req, res) => {
  UserSubscription.deleteOne({userId: req.params.userId}, function (err) {
    if (err){
      res.status(500).send(err)
  } else {
      res.status(200).send({message: 'DELETED_SUBSC'})
  }
  }); 
})
//SUBSCRIPTION MODIFICATION
app.get("/users/subscription/modify/:userId", (req, res) => {
  UserSubscription.findOneAndUpdate({userId: req.params.userId},{
    $set:{
      period: req.body.period
    }
  }, function (err, data) {
    if (err){
      res.status(500).send(err)
  } else {
    res.status(200).send({data, message: 'MODIVIED_SUBSC'})
  }
  }) 
})
//SHOW SUBSCRIPTION
app.get("/users/subscription/:userId", (req, res) => {
  UserSubscription.findOne({userId: req.params.userId}, function (err, data) {
    if (err){
      res.status(500).send(err)
  } else {
      res.status(200).send(data)
  }
  }); 
})
//BLOCKING SUBSCRIPTION
app.get("/usersubscription/block/:userId", (req, res) => {
  UserSubscription.findOne({userId: req.params.userId}, function (err, data) {
    if (err){
      res.status(500).send(err)
    } 
    else{ 
      if(data){
        UserSubscription.updateOne({_id: data._id},{blocked: !data.blocked},(err)=>{
          if(err){
            res.status(500).send(err)
          }else{
            res.status(200).json({success: true, message:{blockedNewStatus: !data.blocked}})
          }
        })
      }else{
        res.status(201).json({success : false ,message: "SUBSCRIPTION_NOT_FOUND"})  
      }
    }
  })
})

// show users without subscription
app.get("/users/users_without_subscription", (req, res)=>{
  Users.find({ subscription : 0 },(err, data) => {
      if (err){
          res.status(500).send(err)
      } else {
          console.log('users nbo subc data ; ', data)
          res.status(200).send(data)
      }
  })
})
// show users with subscription
app.get("/users/users_with_subscription", (req, res)=>{
  Users.find({ subscription : 1  },(err, data) => {
      if (err){
          res.status(500).send(err)
      } else {
        console.log('users with subsc : ', data)
          res.status(200).send(data)
      }
  })
})
// Register route
//TODO : add verification for username and email and phoneNumber
// app.post('/open/barrier/ent', authenticationMiddle, (req, res)=>{
//   const userInfo = req.jwt
//   Users.findOne({_id : userInfo.sub}, (err, user)=>{
//     if(err){
//       res.status(500).json({success: false, error: err})
//     }else{
//       if(user){
//         res.status(201).json({success: true})
//       }else{  
//         res.status(201).json({success: false})
//       }
//     }
//   })
// })
app.post('/open/barrier/ent', authenticationMiddle,(req,res)=>{
  console.log('Im in open barrier ent')
  let state = true
  const userInfo = req.jwt
  console.log('user info  ; ' , userInfo)
  Users.findOne({_id: userInfo.sub},(err, user)=>{
    if(err){
      res.status(500).json({success: false, error: err})
    }else{
      console.log('user name : ', user.username)
      PlaceReservation.find({username: user.username},(err, data)=>{
        if(err){
          res.status(500).json({success: false, error: err})
        }
        if (!data){
          console.log('empty reservation')
          res.status(201).json({success: true, data, message: 'EMPTY_RESERVATION'})
        }else{
          data.map(function(d){
            console.log('found a reservation')
            // console.log('begin',timeToNumber(d.beginReservation) + new Date(d.beginDateReservation).getTime())
            // console.log('end',timeToNumber(d.endReservation) + new Date(d.endDateReservation).getTime())
            // console.log('actual',timeToNumber(new Date().getHours() +":"+ new Date().getMinutes()) + new Date(new Date().getFullYear() , (new Date().getMonth() ) , new Date().getDate(), 2 , 0).getTime())
            if(timeToNumber(d.beginReservation) + new Date(d.beginDateReservation).getTime() <= timeToNumber(new Date().getHours() +":"+ new Date().getMinutes())  + new Date(new Date().getFullYear() , (new Date().getMonth() ) , new Date().getDate(), 2 , 0).getTime() && timeToNumber(d.endReservation) + new Date(d.endDateReservation).getTime() >= timeToNumber(new Date().getHours() +":"+ new Date().getMinutes())  + new Date(new Date().getFullYear() , (new Date().getMonth() ) , new Date().getDate(), 2 , 0).getTime()){             
              state = false
              res.status(201).json({success: true, data, message: 'EXISTED_RESERVATION'})
            }
          })
           if(state === true){
              res.status(201).json({success: true, data, message: 'NOT_EXISTED_RESERVATION'})
          }    
        }      
      }) 
    }
  })
})
app.post('/open/barrier/exi', authenticationMiddle, (req, res)=>{
  const userInfo = req.jwt
  Users.findOne({_id : userInfo.sub}, (err, user)=>{
    if(err){
      res.status(500).json({success: false, error: err})
    }else{
      if(user){
        res.status(201).json({success: true})
      }else{  
        res.status(201).json({success: false})
      }
    }
  })
})
app.post('/md/ps/stts', (req, res)=>{
  const data = req.body
  const error = false
  let errors = []
  console.log(req.body)
  Object.keys(data).map(function(key, index){
    ParkSpots.updateOne({name: key}, {state: data[key] == 'true' ? true : false},(err, result)=>{
      if(err){
        error = true
        errors += err
        console.log(`error at ${key}`)
      }else{
        console.log(`success at ${key}`)
      }
    })
  })
  if(error){
    res.status(500).json({success: false, error: errors})
  }else{
    res.status(201).json({success: true})
  }
})
app.post('/spots/all',(req, res)=>{
  ParkSpots.find((err,data)=>{
    if(err){
      res.status(500).send(err)
    }else{
      console.log('spots: ', data)
      res.status(200).send(data)
    }
  }) 
})
// email verification route (sending email)
app.post('/send/verif/email',authenticationMiddle, (req, res)=>{
  Users.findOne({_id: req.jwt.sub},(err, user)=>{
    if(err){
      res.status(500).json({success: false, message: err})
    }else{
      if(!user){
        res.status(201).json({success: false, message: "ERROR_SENDING_EMAIL"})
      }else{
        const newEmailVerif = {
          username : user.username,
          verifCode : crypto.randomBytes(32).toString('hex')
        }
        EmailVerifs.create(newEmailVerif,(err,data)=>{
          if(err){
            console.log("error when making verif email")
            res.status(201).json({success: false, message: "ERROR_SENDING_EMAIL"})
          }else{
            sendVerificationEmail(user.email,data.verifCode)
            res.status(201).json({success: true, message: "EMAIL_SENT"})
          }
        })
      }
    }
  })
})
app.post('/users/register',(req, res) => {
  let message = {}
  Users.findOne({ $or: [ { username : req.body.username  }, { email: req.body.email } ] },(err,user)=>{
    if(err){
      res.status(500).json({success: false, message: err})
    }else{
      if(user){
        if(user.username === req.body.username){
          message.usernameD = 'USERNAME_TAKEN'
        }
        if(user.email === req.body.email){
          message.emailD = 'EMAIL_TAKEN'
        }
        res.status(201).json({success :false, message: message})
      }else{
        const {salt, hash} = generatePassword(req.body.password)
        const {password, ...rest} = req.body  
        const newUser = {
          ...rest,
          verifiedState : false,
          blocked : false,
          admin : false,
          hash : hash,
          salt : salt,
          subscription: 0
        }
        Users.create(newUser, (err,data)=> {
          if(err){
            res.status(500).json({success: false, message: err})
          }else{
            const newEmailVerif = {
              username : newUser.username,
              verifCode : crypto.randomBytes(32).toString('hex')
            }
            EmailVerifs.create(newEmailVerif,(err,data)=>{
              if(err){
                console.log("error when making verif email")
              }else{
                sendVerificationEmail(newUser.email,data.verifCode)
              }
            })
            res.status(201).json({success :true, message: 'CREATED'})
          }
          console.log(newUser)
        })
      }
    }
  })
})
app.post('/email/verify',(req,res)=>{
  console.log('in verify')
  EmailVerifs.findOne({verifCode : req.body.code},(err, emailVerif)=>{
    if(err){
      res.status(500).json({error: err})
    }else{
      if(emailVerif){
        Users.updateOne({username:emailVerif.username},{verifiedState:true},(err,user)=>{
          if(err){
            res.status(500).json({error:err})
          }else{
            res.status(201).json({success:true, message:'EMAIL_VERIFIED'})
          }
        })
      }else{
        res.status(201).json({success:false, message:'EMAIL_NOT_VERIFIED'})
      }
    }
  })
})
app.post('/users/block',(req, res)=>{
  Users.updateOne({_id: req.body._id}, {blocked : !req.body.blocked}, function(err, user){
    if(err){
      res.status(500).json({error: err})
    }else{
      res.status(201).json({success: true, message: 'BLOCK_STATUS_MODIFIED'})
    }
  })
})
app.get("/users/all", (req, res)=>{
  Users.find((err, data) => {
      if (err){
          res.status(500).send(err)
      } else {
          res.status(200).send(data)
      }
  })
})
// change password
app.post("/user/changepassword",authenticationMiddle, (req, res) => {
  Users.findOne({_id: req.jwt.sub},(err, user)=>{
    if(err){
      res.status(201).json({success: false, message:"ERROR"})
    }else{ 
      if(!user){
        res.status(201).json({success: false, message:"ERROR"})
      }else{
        const isPasswordValid = validatePassword(req.body.currentPassword.toString(), user.hash, user.salt)
        if(isPasswordValid){
          const {salt, hash} = generatePassword(req.body.password)
          Users.updateOne({_id: user._id},{salt: salt, hash: hash},(err, data)=>{
            if(err){
              res.status(201).json({success: false, message:"ERROR"})
            }else{ 
              if(data.acknowledged === true){
                res.status(201).json({success: true})
              }else{
                res.status(201).json({success: false, message:"ERROR"})
              }
            } 
          }) 
        }else{
          res.status(201).json({success: false, message:"WRONG_CURRENT_PASSWORD"})
        }
      }
    }
  })
})

// delete user by username
app.get('/user/:username', (req, res) => {
  Users.deleteOne({username: req.params.username}, function (err) {
    if (err){
      res.status(500).send(err)
  } else {
      res.status(200).send({message: 'DELETED'})
  }
  }); 
})
//show a user details by username
app.get("/users/find/:username", (req, res) => {
  Users.findOne({username: req.params.username}, function (err, data) {
    if (err){
      res.status(500).send(err)
  } else {
      res.status(200).send(data)
  }
  }); 
})
//block a user by username
app.get("/user/block/:username", (req, res) => {
  Users.findOne({username: req.params.username}, function (err, user) {
    if (err){
      res.status(500).send(err)
    } 
    else{ 
      if(user){
        Users.updateOne({_id: user._id},{blocked: !user.blocked},(err,data)=>{
          if(err){
            res.status(500).send(err)
          }else{
            res.status(200).json({success: true, message:{blockedNewStatus: !user.blocked}})
          }
        })
      }else{
        res.status(201).json({success : false ,message: "USER_NOT_FOUND"})  
      }
    }
  })
})
// users logout
app.post("/logout", (req, res) => {
  res
  .clearCookie('ausc')
  .status(200)
  .json({ message: "LOGGED_OUT" });
});
// //test
// app.get('/user/s',(req,res)=>{
//   res.cookie("secureCookie", JSON.stringify({
//     msg: "done"
//   }), {
//     secure: false,
//     httpOnly: true,
//     expires: dayjs().add(30, "days").toDate(),
//   });
// })
app.get("/users/all", (req, res)=>{
  Users.find((err, data) => {
      if (err){
          res.status(500).send(err)
      } else {
          res.status(200).send(data)
      }
  })
})
// TODO: access and refresh token cookies
// login route
app.post('/users/login', (req, res) => {
  //console.log(req.cookies)
  // grabbing userinfo from req object
  const userInfo = req.body
  // looking for user with the requested username
  Users.findOne({ $or: [ { username : userInfo.username  },{ email : userInfo.username}]}, function (err, user) {
    if (err) {
      res.status(500).send(err)
    } else {
      // if user exists
      if (user !== null) {
        // checking if password is correct
        const isPasswordValid = validatePassword(userInfo.password.toString(), user.hash, user.salt)
        if (isPasswordValid) {
          // creating access token and refresh token
          const tokenObj = issueJWT(user)
          const rTokenObj = issueRefreshToken()
          // updating user info with current refresh token
          Users.updateOne({_id: user._id}, {refreshT : rTokenObj.refreshToken}, function(err, user){
            if(err){
              res.status(500).json({error: err})
            }
          })
          /*
          res.cookie("rusc", rTokenObj.refreshToken, {
            secure: false,
            httpOnly: true,
            expires: dayjs().add(1, "minute").toDate(),
          });
          */
          res.cookie("ausc", tokenObj.token,{
            secure: false,
            httpOnly: true,
            expires: tokenObj.expires,
          })
          res.status(201).json({success: true, rusc: rTokenObj.refreshToken, user: user, message: 'AUTHENTICATED', token: tokenObj.token, 
          expiresIn: tokenObj.expires, 
          refreshToken : rTokenObj.refreshToken})
        } else {
          res.status(201).json({success: false, message:'WRONG_PASSWORD'})
        }
      } else {
        res.status(201).json({success: false, message: 'NOT_FOUND'})
      }
    } 
  })
})
//TODO interceptor : we send request if it returns 403 unauthorized cause no access token then we send refresh if no refresh then return unauthorized
// get new access refresh token pair // test
app.post('/refresh', (req, res)=>{
  console.log(req.body)
  Users.findOne({refreshT :req.body.rusc},function(err, user){
    if(err){
      res.status(500).json({message: err})
    }else{
      if(user !== null){
        const tokenObj = issueJWT(user)
        const rTokenObj = issueRefreshToken()
        Users.updateOne({_id: user._id}, {refreshT : rTokenObj.refreshToken}, function(err, user){
          if(err){
            res.status(500).json({error: err})
          }
        })
        res.cookie("ausc", tokenObj.token,{ 
          secure: false,
          httpOnly: true,
          expires: tokenObj.expires,
        })
        res.status(201).json( {message: `ACCESS_REFRESHED`, user: user ,ausc: tokenObj.token, rusc: rTokenObj.refreshToken} )
      }
      else{
        Admins.findOne({refreshT :req.body.rusc},function(err, user){
          if(err){
            res.status(500).json({message: err})
          }else{
            if(user !== null){
              const tokenObj = issueJWT(user)
              const rTokenObj = issueRefreshToken()
              Admins.updateOne({_id: user._id}, {refreshT : rTokenObj.refreshToken}, function(err, user){
                if(err){
                  res.status(500).json({error: err})
                }
              })
              res.cookie("ausc", tokenObj.token,{ 
                secure: false,
                httpOnly: true,
                expires: tokenObj.expires,
              })
              res.status(201).json( {message: `ACCESS_REFRESHED`, user: user.username ,ausc: tokenObj.token, rusc: rTokenObj.refreshToken} )
            }
            else{
              res.status(403).json({message: "UNAUTHORIZED"})
            }
          }
        })
      }
    }
  })
})
 //ADMINISTRATORS
//   app.post("/admin/new", (req, res) =>{
//     const dbAdmins=req.body
//     Admins.create(dbAdmins, (err,data)=>{
//         if(err)
//          res.status(500).send(err)
//         else
//          res.status(201).send(data)       
//     })
// })
app.post('/admin/new',(req, res) => {
  let message = {}
  Admins.findOne({ $or: [ { adminname : req.body.adminname  }, { email: req.body.email } ] },(err,admin)=>{
    if(err){
      res.status(500).json({success: false, message: err})
    }else{
      if(admin){
        if(admin.adminname === req.body.adminname){
          message.adminnameD = 'ADMINNAME_TAKEN'
        }
        if(admin.email === req.body.email){
          message.emailD = 'EMAIL_TAKEN'
        }
        res.status(201).json({success :false, message: message})
      }else{
        const {salt, hash} = generatePassword(req.body.password)
        const {password, ...rest} = req.body  
        const newAdmin = {
          ...rest,
          admin : true,
          blocked : false,
          adminType: "MAIN_ADMIN",
          hash : hash,
          salt : salt
        }
        Admins.create(newAdmin, (err)=> {
          if(err){
            res.status(500).json({success: false, message: err})
          }else{
            res.status(201).json({success :true, message: 'ADMIN_CREATED'})
          }
          console.log(newAdmin)
        })
      }
    }
  })
})
app.get("/admin/all", (req, res)=>{
  Admins.find((err, data) => {
      if (err){
          res.status(500).send(err)
      } else {
          res.status(200).send(data)
      }
  })

})
app.post('/admin/login', (req, res) => {

  const adminInfo = req.body
  Admins.findOne({ $or: [ { adminname : adminInfo.adminname  },{ email : adminInfo.adminname}]}, function (err, admin) {
    if (err) {
      res.status(500).send(err)
    } else {
      if (admin !== null) {
        // checking if password is correct
        const isPasswordValid = validatePassword(adminInfo.password.toString(), admin.hash, admin.salt)
        if (isPasswordValid) {
          // creating access token and refresh token
          const tokenObj = issueJWTAdmin(admin)
          const rTokenObj = issueRefreshToken()
          // updating user info with current refresh token
          Users.updateOne({_id: admin._id}, {refreshT : rTokenObj.refreshToken}, function(err, admin){
            if(err){
              res.status(500).json({error: err})
            }
          })
          res.cookie("ausc", tokenObj.token,{
            secure: false,
            httpOnly: true,
            expires: tokenObj.expires,
          })
          res.status(201).json({success: true, rusc: rTokenObj.refreshToken, admin: admin, message: 'AUTHENTICATED', token: tokenObj.token, 
          expiresIn: tokenObj.expires, 
          refreshToken : rTokenObj.refreshToken})
        } else {
          res.status(201).json({success: false, message:'WRONG_PASSWORD'})
        }
      } else {
        res.status(201).json({success: false, message: 'NOT_FOUND'})
      }
    } 
  })
})
//delete admin by username
app.delete('/admin/:adminname', (req, res) => {
  Admins.deleteOne({adminname: req.params.adminname}, function (err) {
    if (err){
      res.status(500).send(err)
  } else {
      res.status(200).send({message: 'DELETED'})
  }
  }); 
})
//get admin by username
app.get("/admin/:adminname", (req, res) => {
  Admins.findOne({adminname: req.params.adminname}, function (err, data) {
    if (err){
      res.status(500).send(err)
  } else {
      res.status(200).send(data)
  }
  }); 
})
//update admin info
app.put("/admin/:adminname", (req, res) => {
  Admins.findOneAndUpdate({adminname: req.params.adminname},{
    $set:{
      email : req.body.email,
      adminname: req.body.adminname
    }
  }, function (err, data) {
    if (err){
      res.status(500).send(err)
  } else {
      res.status(200).send(data)
  }
  })
})
app.post('md/pw',authenticationMiddle,(req, res)=>{
  Users.findOne({_id : req.jwt.sub},function(err, user){
    if(err){
      res.status(500).send(err)
    }else{
      if(data){
        const {salt, hash} = generatePassword(req.body.password)
        Users.updateOne({_id: user._id},{hash: hash, salt: salt},function(err, data){
          if(err){
            res.status(500).json({success: false, message:{data: "UPDATE_FAILURE"}})
          }else{
            res.status(500).json({success: True, message:{data: "UPDATE_SUCCESSFULL"}})
          }
        })
      }else{
        res.status(200).json({success: false, message:{data: "USER_NOT_FOUND"}})
      }
    }
  })
})
app.post('md/ema',authenticationMiddle,(req, res)=>{
  Users.findOne({_id : req.jwt.sub},function(err, user){
    if(err){
      res.status(500).send(err)
    }else{
      if(data){
        Users.updateOne({_id: user._id},{email: req.body.email, verifiedState: false},function(err, data){
          if(err){
            res.status(500).json({success: false, message:{data: "UPDATE_FAILURE"}})
          }else{
            const newEmailVerif = {
              username : user.username,
              verifCode : crypto.randomBytes(32).toString('hex')
            }
            EmailVerifs.create(newEmailVerif,(err,data)=>{
              if(err){
                res.status(500).json({success: false, message:{data: "VERIF_EMAIL_SENT"}})
              }else{
                sendVerificationEmail(newUser.email,data.verifCode)
                res.status(500).json({success: true, message:{data: "UPDATE_SUCCESSFULL"}})
              }
            })
          }
        })
      }else{
        res.status(200).json({success: false, message:{data: "USER_NOT_FOUND"}})
      }
    }
  })
})
app.post('md/usn', authenticationMiddle,(req, res)=>{
  Users.findOne({_id : req.jwt.sub},function(err, user){
    if(err){
      res.status(500).send(err)
    }else{
      if(user){
        Users.findOne({username: req.body.username}, function(err, user){
          if(err){
            res.status(500).json({success: false, message:{data: "REQ_FAILURE"}})
          }else{
            if(user){
              res.status(200).json({success: false, message:{data: 'USERNAME_TAKEN'}})
            }else{
              Users.updateOne({_id: user._id},{username: req.body.username},function(err, data){
                if(err){
                  res.status(500).json({success: false, message:{data: "UPDATE_FAILURE"}})
                }else{
                  res.status(500).json({success: true, message:{data: "UPDATE_SUCCESSFULL"}})
                }
              })
            }
          }
        })
      }else{
        res.status(200).json({success: false, message:{data: "USER_NOT_FOUND"}})
      }
    }
  })
})
app.post('md/ntel', authenticationMiddle, (req,res)=>{
  Users.findOne({_id : req.jwt.sub},function(err, user){
    if(err){
      res.status(500).send(err)
    }else{
      if(data){
        Users.updateOne({_id: user._id},{number: req.body.number},function(err, data){
          if(err){
            res.status(500).json({success: false, message:{data: "UPDATE_FAILURE"}})
          }else{
            res.status(500).json({success: True, message:{data: "UPDATE_SUCCESSFULL"}})
          }
        })
      }else{
        res.status(200).json({success: false, message:{data: "USER_NOT_FOUND"}})
      }
    }
  })
})
/*
// create user
app.post("/users/new", (req, res) =>{
  const {salt, hash} = generatePassword(req.body.password)
  const {password, ...rest} = req.body  
  const dbregister = {
    ...rest,
    hash : hash,
    salt : salt
  }
  Users.findOne({email : req.body.email},(err, userWithSameEmail)=>{
    if(err){
      res.status(400).json({
        succes: false,
        message:'error getting mail try again',
      });
    }else if(userWithSameEmail){
      res.status(200).json({succes: false,message:'This mail is taken'});
    }
    else if(!userWithSameEmail) {     
      Users.findOne({username: req.body.username},(err, userWithSameUsername)=>{
      if(err){
        res.status(400).json({
          succes: false,
          message:'error getting username try again',
        });
      }else if(userWithSameUsername){
        res.status(200).json({succes: false,message:'This username is taken'});
      }
      else {
        Users.create(dbregister, (err)=>{
            if(err)
             res.status(500).json({success: false, message: err})
            else
             res.status(201).json({success :true, message: 'created'})   
        }
        )}
    })
    }
})
})
*/
// to delete : just for testing jwt middleware
app.get('/users/protected', authenticationMiddle,(req, res)=>{
  // console.log(req.cookies)
  Users.findOne({_id: req.jwt.sub},function(err, user){
    if(err){
      res.status(500).json({message: err})
    }else{
      if(user !== null){
        res.status(200).json( { user: user, message: `AUTHENTICATED`/*`connected as ${user.username}`*/,token: req.jwt} )
      }
      else{
        Admins.findOne({_id: req.jwt.sub},function(err, user){
          if(err){
            res.status(500).json({message: err})
          }else{
            if(user !== null){
              res.status(200).json( { user: user, message: `AUTHENTICATED`/*`connected as ${user.username}`*/,token: req.jwt} )
            }
            else{
              res.status(200).json({message: "user not found"})
            }
          }
        })
      }
    }
  })
})

//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))

