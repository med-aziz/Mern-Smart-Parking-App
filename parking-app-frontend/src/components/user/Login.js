import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import './Login.css'
import { auth, provider } from '../../firebase'
import { actionTypes } from '../../actions'
import { useStateValue } from '../StateProvider'
import { signInWithPopup } from 'firebase/auth'
import { Link } from 'react-router-dom'
import image from '../../images/Logowithoutbackground.png'
import PersonIcon from '@material-ui/icons/Person'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import axios from '../axios'
import { addRToken } from '../../utils/authUtils'
import useRt from '../../hooks/useRt' // test
import { useNavigate } from 'react-router-dom'
const Login = () => {
  let nameVer,pwdVer
  const navUtil = useNavigate()
  const [formErrors, setFormErrors] = useState({})
  const refresh = useRt() //test
  const [state, dispatch] = useStateValue()
  const findUser = async (e) => {
    e.preventDefault()
    if(verification()){
      await axios
        .post('/users/login', {
          ...values,
        })
        .then((res) => {
          console.log(res.data)
          if (res.data.message === 'NOT_FOUND') {
            nameVer=1
            verification()
            dispatch({
              type: actionTypes.CONNEXION_FAIL,
            })
            //alert('User Not Found, please Verify Your Username!')
          } else {
            if (res.data.message === 'AUTHENTICATED') {
              dispatch({
                type: actionTypes.SET_USER,
                user: res.data.user
              })
              addRToken(res.data.rusc)
              console.log(state)
              alert(`Login Successfull as ${values.username}!`)
              navUtil('/home',{
                replace: true
              })
              setValues(initialInputValues)
            } else if (res.data.message === 'WRONG_PASSWORD') {
              dispatch({
                type: actionTypes.CONNEXION_FAIL,
              })
              pwdVer=1
              verification()
              //alert('Wrong Password!')
            }
          }
        })
    }
  }
  useEffect(() =>{
    console.log('login page ; ', state.user)
    if (state.user !== null && state.user !== false){
      navUtil('/home',{
        replace : true
      })
    }
    console.log(formErrors);

  },[formErrors, state.user])
  const initialInputValues = {
    username: '',
    password: '',
  } 
  const [values, setValues] = useState(initialInputValues)
  const verification = ()=>{
    const errors={}
    let valid = true
    if(!values.username){
     errors.username="Champ vide! Entrez Username ou Email !";
     valid = false
   }
    else
     if(nameVer===1){
       errors.username="Vérifier Usename ou Email ! untrouvable!"
       valid = false
      }    
    if(!values.password){
      errors.password="Champ vide! Entrez votre mot de Passe!";
      valid = false
   }
   else 
     if(pwdVer===1){
      errors.password="Vérifier Mot de passe! Mot de passe uncorrect!";
      valid = false
  }
  setFormErrors(errors)
  return valid
}
  const handleInputChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    //const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
  }   
  //google connection
 const signIn = () => {
    signInWithPopup(auth, provider)
     .then((result) => {
         dispatch({
             type: actionTypes.SET_USER,
             user: result.user,
         })
     })
     .catch((error) => alert(error.message))
 }

 return ( 
 <div className="login"> 
  <div className="login__container">
   <img src={image} alt="Our Logo" />
   <div className="login__text">
    <h1>Connexion</h1>
   </div>
   {/*<div className="loginG">
    <div className="loginWithGoogle"> 
    <img src="Google-Logo.jpg" alt="GoogleLogo"  />*/}
   <form method='Post'>
    <div className='formInputs'>
     <div>
      <div className="inputIntegratedWithErrMes">
       <div className="iconsintegredtoinputs">
        <PersonIcon />
        <input name="username" value={values.username } onChange={handleInputChange} placeholder="Entrer Username ou Email" type="text"/>
       </div>
       <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.username}</small>
      </div>
      <div className="inputIntegratedWithErrMes">
       <div className="iconsintegredtoinputs">
        <VpnKeyIcon />
        <input name="password" value={values.password} onChange={handleInputChange} placeholder="Entrer Mot de Passe" type="Password"/>
       </div>
       <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.password}</small>
      </div>
     </div>
    </div>
    <Button onClick={findUser} type="submit">Login</Button>
   </form>
   {/* <div className='GoogleLogButton'>
    <Button onClick={signIn}>Connexion avec Google</Button>
   </div> */}
   <div className='CreateAccountButton'>
    <Button ><Link style={{  color: 'white',textDecoration: 'none'}}  to='/register' >Créer un compte</Link></Button>
   </div>
  </div>
 </div>
 )
}
export default Login