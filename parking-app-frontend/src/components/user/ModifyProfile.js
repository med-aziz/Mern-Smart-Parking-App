import React, {useState, useEffect} from 'react';
import './ModifyProfile.css'
import { useStateValue } from '../StateProvider';
import { Avatar } from '@material-ui/core'
import axios from '../axios'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import usePrivateInstance from '../../hooks/usePrivateInstance';

function ModifyProfile(props) {
    const privateInstance = usePrivateInstance()
    const navUtil = useNavigate()
    const [{user}, dispatch] = useStateValue()
    const [formErrors, setFormErrors] = useState({})
    const initialInputValues = {
        password: '',
        repassword: '',
        currentPassword: ''
      } 
      const [values, setValues] = useState(initialInputValues)
      const handleInputChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setValues({
          ...values,
          [name]: value,
        })
      }  
    let usernamee = user && user.username
    const updatePassword = async (e) =>{
        e.preventDefault()
        if (validate()){
        const response = await privateInstance.post(`/user/changepassword`,{
            ...values
        });
        if (response.status === 201){
            // navUtil('/home')
            if(response.data.success === true){
              toast.success("Le Mot de Passe a été modifier avec succes",{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            setValues(initialInputValues)
            }else{
              if(response.data.message === "WRONG_CURRENT_PASSWORD"){
                setFormErrors({
                  ...formErrors,
                  currPassword: "Faux Mot De Passe Actuel"
                })
            }else{
              toast.error("Echec, veulliez essayez ultérieurement",{
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            }
            }
        }}
    };
    useEffect(() =>{
        console.log(formErrors);
    
      },[formErrors])
    
      const validate = () => {
        let valid = true
        let errors = {}
      if(!values.password){
        errors.password="Champ vide, Veuillez saisir le Mot de Passe SVP !";
        valid = false
      }else if(values.password.length <5){
        errors.password="Court Mot de Passe, Veuillez saisir un Mot de Passe plus sécurisé !"
        valid = false
      }
      if(!values.repassword){
        errors.repassword="Champ vide, Veuillez Re-saisir le Mot de Passe SVP !";
        valid = false
      }else if(values.repassword !== values.password){
        errors.repassword="Mot de Passe différent de précédent, Vérifier SVP !"
        valid = false
      }
      if(!values.currentPassword){
        errors.currPassword="Champ vide, Veuillez saisir le Mot de Passe SVP !";
        valid = false
      }else if(values.currentPassword.length <5){
        errors.currPassword="Court Mot de Passe, Veuillez saisir un Mot de Passe plus sécurisé !"
        valid = false
      }
       setFormErrors(errors)
       return valid
      };
    return (
        <div className='background-modify'>          
              <form >
                <h1 className='profile-title' >Mon Profile</h1>
                <div className='profile-card'>
                  <Avatar style={{margin : '0 auto', width: '100px', height: '100px'}}
                  src={`https://avatars.dicebear.com/api/human/b100.svg`}/>
                  <div className='profile-info'>
                    <p>Nom d'utilisateur:  <span  style={{fontWeight: 'normal', fontSize: '15px'}}>
                        {user && user.username}</span>
                    </p>
                    <p>Email: <span style={{fontWeight: 'normal', fontSize: '15px'}}>
                        {user && user.email}</span>
                    </p> 
                    <p>Télèphone: <span  style={{fontWeight: 'normal', fontSize: '15px'}}>
                        {user && user.number}</span>
                    </p> 
                  </div>
                </div>
                    <h3 className='change-pass-title'>Veuillez changer le Mot de Passe ?</h3>
                    <div class="inputDiv">
                     <label class="inputLabel" for="password">Mot de Passe Actuel</label>
                     <input className='change-password-input'value={values.currentPassword} onChange={handleInputChange} type="password"  name="currentPassword" required/>
                     <small style={{color:'red'}}>{formErrors.currPassword}</small>
                    </div>
                    <div class="inputDiv">
                     <label class="inputLabel" for="password">Nouveau Mot de Passe</label>
                     <input className='change-password-input'value={values.password} onChange={handleInputChange} type="password"  name="password" required/>
                     <small style={{color:'red'}}>{formErrors.password}</small>
                    </div>
      
                    <div class="inputDiv">
                     <label class="inputLabel" for="confirmPassword">Confirmer Mot de Passe</label>
                     <input className='change-password-input' type="password" value={values.repassword} onChange={handleInputChange}  name="repassword"/>
                     <small style={{color:'red'}}>{formErrors.repassword}</small>
                    </div>
    
                    <div class="buttonWrapper">
                     <button type="submit" className="submitButton" onClick={updatePassword} >
                       Continuer
                     </button>
                    </div>     
                 </form>
         </div>
    );
}

export default ModifyProfile;