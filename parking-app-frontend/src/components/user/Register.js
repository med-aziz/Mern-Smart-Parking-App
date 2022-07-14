import React from 'react'
import { Button } from '@material-ui/core'
import './Register.css'
import {Link} from'react-router-dom';
import image from '../../images/Logowithoutbackground.png';
import PersonIcon from "@material-ui/icons/Person";
import MailIcon from "@material-ui/icons/Mail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import CallIcon from "@material-ui/icons/Call";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import axios from '../axios'
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react'

const Register = (props) => {
  const initialInputValues = {
    username: '',
    email: '',
    password: '',
    repassword: '',
    number: '',
    numidentity: ''
  } 
  const [values, setValues] = useState(initialInputValues)
  const handleInputChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    //const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
  }   
  const [formErrors, setFormErrors] = useState({})
  const [isSubmit, setIsSubmit] = useState(false)
  let existedUsername 
  let existedEmail
  const sendRegister = async (e) => {
  e.preventDefault()
  // setIsSubmit(true)  
  console.log(Object.keys(formErrors).length)
  if(validate()){
  await axios.post('/users/register', {
    ...values,
    dateCreation : new Date().toUTCString()
  }).then((res) =>{    
    console.log(res)
      if(res.data.message.usernameD === 'USERNAME_TAKEN'){
        existedUsername=1
        validate();       
        }
      if(res.data.message.emailD === 'EMAIL_TAKEN'){
        existedEmail=1
        validate()
        }
      if (res.data.message === 'CREATED') {
          // alert("User ajouter! Veuillez recevoir un e-mail de confirmation ")
          toast.success("User ajouter! Veuillez recevoir un e-mail de confirmation")
          }
    })   
  }
  }
  
  useEffect(() =>{
    console.log(formErrors);

  },[formErrors])

  const validate = () => {
    let valid = true
   let errors = {}
   const regexEmail = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
   const regexUsername= /[a-zA-Z][a-zA-Z]{2,}/
   const regexNumber = /(9|2|5)[0-9 ]{7}/
   const regexCin = /(1|0)[0-9]{7}/
   if(!values.email){
     errors.mail="Champ vide !";
     valid = false
   }else if(!regexEmail.test(values.email)){
     errors.mail="Email incorrect !"
     valid = false
   }else if(existedEmail===1){
     errors.mail="Email déja utilisé !"
     valid = false
  }
   if(!values.username){
    errors.username="Champ vide !";
    valid = false
  }else if(!regexUsername.test(values.username)){
    errors.username="Username incorrect !"
    valid = false
  }else if(existedUsername===1){
    errors.username="Username déja utilisé !"
    valid = false
  }
  if(!values.password){
    errors.password="Champ vide !";
    valid = false
  }else if(values.password.length <5){
    errors.password="Court mdp !"
    valid = false
  }
  if(!values.repassword){
    errors.repassword="Champ vide !";
    valid = false
  }else if(values.repassword !== values.password){
    errors.repassword="Mdp different !"
    valid = false
  }
  if(!values.number){
    errors.number="Champ vide !";
    valid = false
  }else if(!regexNumber.test(values.number)){
    errors.number="Vérifier numéro !"
    valid = false
  } 
   setFormErrors(errors)
   return valid
  };
 return ( 
 <div className="Register">
  <div className="Register__container">
   <img src={image} alt="Our Logo" />
   <div className="Register__text">
    <h1>Créer un compte</h1>
   </div>
 {/*<div className="loginG">
 <div className="loginWithGoogle"> 
 <img src="Google-Logo.jpg" alt="GoogleLogo"  />*/}
 <form method='Post'>
     <div className='formInputs'> 
      <div>
       <div className="iconsintegredtoinputs">
        <PersonIcon />
        <input name='username' value={values.username} onChange={handleInputChange} placeholder="Entrer Username" type="text"/>
        <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.username}</small>
       </div>
       <div className="iconsintegredtoinputs">
        <MailIcon />
        <input name='email' value={values.email} onChange={handleInputChange} placeholder="Entrer Votre Email" type="email"/>
        <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.mail}</small>
       </div>
      </div>
      <div>
       <div className="iconsintegredtoinputs">
        <VpnKeyIcon />
        <input name='password' value={values.password} onChange={handleInputChange} placeholder="Entrer Votre Mot de Passe" type="Password"/>
        <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.password}</small>
       </div>
       <div className="iconsintegredtoinputs">
        <VpnKeyIcon />
        <input name='repassword' value={values.repassword} onChange={handleInputChange} placeholder="Re-entrer Votre Mot de Passe" type="Password"/>
        <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.repassword}</small>
       </div>
      </div>
      <div className='singleitemchange'>
       <div className="iconsintegredtoinputs">
        <CallIcon />
        <input name="number" value={values.number} onChange={handleInputChange} placeholder="Entrer Votre Numéro de Télèphone" type="text"/>
        <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.number}</small>
       </div>
      </div>
     </div>
     <Button onClick={sendRegister} type="submit">Créer</Button>
 </form>
 <div className='ConnectButton'>
  <Button><Link style={{  color: 'white', textDecoration: 'none'}} to='/userslogin' >Login</Link></Button>
 </div>
 </div>
 </div>
 
 )
}
export default Register