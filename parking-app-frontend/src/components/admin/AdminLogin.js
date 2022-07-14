import React from 'react'
import { Button } from '@material-ui/core'
import './AdminLogin.css'
import image from '../../images/LogowithoutbackgroundBlack.png';
import PersonIcon from "@material-ui/icons/Person";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import axios from '../axios'
import { actionTypes } from '../../actions'
import { useStateValue } from '../StateProvider'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { addRToken } from '../../utils/authUtils'
const AdminLogin = () => {
  const [state, dispatch] = useStateValue()
  const navUtil = useNavigate()
  let nameVer,pwdVer
  let navigate= useNavigate()
  const [formErrors, setFormErrors] = useState({})
  const findAdmin = async (e) => {
    e.preventDefault()
    await axios.post('/admin/login', {...values,})
      .then((res) => {
        console.log(res.data)
        if (res.data.message === 'NOT_FOUND') {
          dispatch({
            type: actionTypes.CONNEXION_FAIL,
          })
          nameVer=1
          setFormErrors(validate())
        } else {
          if (res.data.message === 'AUTHENTICATED') {
            dispatch({
              type: actionTypes.SET_USER,
              user: res.data.admin
            })
            addRToken(res.data.rusc)
            navigate('/homeadmin')
            setValues(initialInputValues)
          } else if (res.data.message === 'WRONG_PASSWORD') {
            dispatch({
              type: actionTypes.CONNEXION_FAIL,
            })
            pwdVer=1
            setFormErrors(validate())
          }
        }
      })
      setFormErrors(validate())
  }
  useEffect(() =>{
    console.log(formErrors);
    if (state.user !== null && state.user !== false){
      if(state.user.admin === true){
        navUtil('/homeadmin',{
          replace : true
        })
      }else{
        navUtil('/home',{
          replace : true
        })
      }

    }
  },[formErrors, state.user])

  const initialInputValues = {
    adminname: '',
    password: '',
  } 
  const [values, setValues] = useState(initialInputValues)
  const validate =()=> {
    const errors={}
    if(!values.adminname){
     errors.adminname="Champ vide! Entrez Adminname!";
   }
    else
     if(nameVer===1){
       errors.adminname="Vérifier Adminname! Adminname untrouvable!"
      }    
    if(!values.password){
      errors.password="Champ vide! Entrez votre mot de Passe!";
   }
   else 
     if(pwdVer===1){
      errors.password="Vérifier Mot de passe! Mot de passe uncorrect!";
  }
    return errors;
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

 return (   
 <div className="loginadmin"> 
  <div className="loginadmin__container">
   <img src={image} alt="Our Logo" />
   <div className="login__text">
    <h1>Bienvenue Admin</h1>
   </div>
   <form method='Post'>
    <div className='formInputs'>
     <div>
      <div className="iconsintegredtoinputs">
       <PersonIcon />
       <input name="adminname" value={values.adminname} onChange={handleInputChange}  placeholder="Entrer Adminname" type="text"/>
      </div>
      <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.adminname}</small>
      <div className="iconsintegredtoinputs">
       <VpnKeyIcon />
       <input name="password" value={values.password} onChange={handleInputChange}  placeholder="Entrer Mot de Passe" type="Password"/>
      </div>
      <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.password}</small>
     </div>
    </div>
    <Button onClick={findAdmin}  type="submit">Login</Button>
   </form>
  </div>
 </div>
 )
}
export default AdminLogin