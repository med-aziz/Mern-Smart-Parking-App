import jsonwebtoken from 'jsonwebtoken'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path'
import randtoken from 'rand-token'
import dayjs from 'dayjs'
import { randomBytes } from 'crypto';
import transporter from './mailConfig.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 
const privateKeyPath = path.join(__dirname, 'id_rsa_priv.pem');
const publicKeyPath = path.join(__dirname,'id_rsa_pub.pem')
const PRIVATE_KEY = fs.readFileSync(privateKeyPath, {encoding: "utf8", flag:'r'});
const PUBLIC_KEY = fs.readFileSync(publicKeyPath, {encoding: "utf8", flag:'r'});
//TODO add expiry if statement for access token
// http request methods anti TRACE middleware
function httpMethodsMiddleware(req, res, next){
  const methodsAllowed =  [
    "OPTIONS",
    "HEAD",
    //"CONNECT",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    //"PATCH"
  ]
  if(!methodsAllowed.includes(req.method)){
    res.status(405).send(`${req.method} Method Not Allowed`)
  }else{
    next()
  }
}
// TODO add refresh token functionality if access token not found
function authenticationMiddle(req, res, next){
  console.log("authMiddle")
  // split Bearer and access token
  try{
    console.log(req.cookies.ausc)
    const tokenParts = req.cookies.ausc.split(' ')
    // check if token structure is correct
    if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
      try {
        // verify jsonwebtoken
        const verification = jsonwebtoken.verify(tokenParts[1], PUBLIC_KEY, { algorithms: ['RS256'] });
        req.jwt = verification;
        console.log(verification)
        if(Date.now() > verification.exp){
          console.log("Date now : ", Date().now())
          console.log("exp : ", verification.exp)
          res.status(403).json({ success: false, msg: "You are not authorized to visit this route" });
        }else{
          // pass to the next middleware => next()
          next();
        }
        

      } catch(err) {
        res.status(403).json({ success: false, msg: "You are not authorized to visit this route" });
      }
  
    } else {
      res.status(403).json({ success: false, msg: "You are not authorized to visit this route" });
    }
  }catch(error){
    res.status(403).json({message : 'UNAUTHORIZED'})
  }
}
function authenticationMiddleAdmin(req, res, next){
  console.log("authMiddle")
  // split Bearer and access token
  try{
    console.log(req.cookies.ausc)
    const tokenParts = req.cookies.ausc.split(' ')
    // check if token structure is correct
    if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
      try {
        // verify jsonwebtoken
        const verification = jsonwebtoken.verify(tokenParts[1], PUBLIC_KEY, { algorithms: ['RS256'] });
        req.jwt = verification;
        console.log(verification)
        if(Date.now() > verification.exp || verification.admin !== true){
          console.log("Date now : ", Date().now())
          console.log("exp : ", verification.exp)
          res.status(403).json({ success: false, msg: "You are not authorized to visit this route" });
        }else{
          // pass to the next middleware => next()
          next();
        }
        

      } catch(err) {
        res.status(403).json({ success: false, msg: "You are not authorized to visit this route" });
      }
  
    } else {
      res.status(403).json({ success: false, msg: "You are not authorized to visit this route" });
    }
  }catch(error){
    res.status(403).json({message : 'UNAUTHORIZED'})
  }
}
// auth middleware
function authenticationMiddleware(req, res, next){
  // split Bearer and token
  const tokenParts = req.headers.authorization.split(' ');
  // check if token structure is correct
  if (tokenParts[0] === 'Bearer' && tokenParts[1].match(/\S+\.\S+\.\S+/) !== null) {
    try {
        // verify jsonwebtoken
        const verification = jsonwebtoken.verify(tokenParts[1], PUBLIC_KEY, { algorithms: ['RS256'] });
        req.jwt = verification;
        console.log(verification)
        // if access token expired
        if(Date.now() > verification.exp){
          console.log("expired access")
          res.status(403).json({ success: false, msg: "You are not authorized to visit this route" });
        }else{
          // pass to the next middleware => next()
          next();
        }
        


    } catch(err) {
      res.status(403).json({ success: false, msg: "You are not authorized to visit this route" });
    }

  } else {
    res.status(403).json({ success: false, msg: "You are not authorized to visit this route" });
  }
}
// create refresh token as 256 unique identifier
function issueRefreshToken(){
  return {
    refreshToken: randtoken.uid(256),
  }
  }
// create JWT token using some user info (FOR ADMIN)
function issueJWTAdmin(user) {
  const _id = user._id;
  // usability duration
  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now(),
    random: randomBytes(6),
    admin: user.admin,
    adminType: user.adminType
  };
  // sign token
  const signedToken = jsonwebtoken.sign(payload, PRIVATE_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
  
  return {
    token: 'Bearer ' + signedToken,
    expires: dayjs().add(1, "minute").toDate()
  }
}
// create JWT token using some user info
function issueJWT(user) {
    const _id = user._id;
    // usability duration
    const expiresIn = '1d';
  
    const payload = {
      sub: _id,
      iat: Date.now(),
      random: randomBytes(6),
      admin: false
    };
    // sign token
    const signedToken = jsonwebtoken.sign(payload, PRIVATE_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });
    
    return {
      token: 'Bearer ' + signedToken,
      expires: dayjs().add(1, "minute").toDate()
    }
}
function sendVerificationEmail(toAddress, code){
  const mailOptions = {
    from: 'The Idea project',
    // to : toAdress
    to: "aziz.jedidi1742@gmail.com",
    subject: 'My first Email!!!',
    html : `
    <!DOCTYPE html>
    <html lang="en">
    <body style="background-image: url('https://i.pinimg.com/originals/e3/68/8b/e3688b37f216a91b026d7f9dcd0b2951.jpg');
                display: grid;
                place-items: center;
                ">
        <div style="
        margin-top: 100px;
        padding: 60px;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 10px;
        box-shadow: -1px 4px 20px -6px rgba(0, 0, 0, 0.75)">  
            <img style="
            object-fit: contain;
            height: 180px;" 
            src="cid:parkiniilogo"/>
            <h1 style="color:white;">To Verify Your Email, Click the Button</h1>
            <button style="
              padding: 20px;
              border-radius: 30px;
              width: 180px;
              margin-top: 20px;
              background-color: #276e74 !important;
              ">
            <a style="color: white; font-weight: bold; text-decoration: none;" href='http://localhost:3000/verify/email/${code}'>Verify Email</a>
          </button>   
        </div>         
    </body>
    </html>
    `,
    attachments: [{
      filename: 'Logowithoutbackground.png',
      path: `images/Logowithoutbackground.png`,
      cid: 'parkiniilogo',
    }]
  };
  transporter.sendMail(mailOptions, (result)=>{
    console.log('mail sent ; ', result)
  })
}
export {sendVerificationEmail, authenticationMiddle, authenticationMiddleware, issueJWT, issueJWTAdmin , issueRefreshToken, httpMethodsMiddleware}