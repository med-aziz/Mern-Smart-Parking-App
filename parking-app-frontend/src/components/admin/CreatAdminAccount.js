import React, {useState,useEffect} from 'react';
import axios from '../axios';
import './CreatAdminAccount.css'
import { Link } from 'react-router-dom'
import { useNavigate, useLocation } from "react-router-dom";
// import {
//     BrowserRouter as 
//     useParams,
//   } from "react-router-dom";

const CreatAdminAccount = (props) => {
    let navigate= useNavigate()

    //for the update
    let location = useLocation();
    const adminname = location.pathname;
    useEffect(()=>{
     if(adminname){
         getSingleAdmin(adminname)
     }
    },[adminname])
    const getSingleAdmin = async (adminname) =>{
        const response = await axios.get(`/admin/${adminname}`);
        console.log("response", response)
        if (response.status === 200){
            setValues(response.data);
        }
    };

    const initialInputValues = {
        adminname: '',
        email: '',
        password: '',
        repassword: ''
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
      const [formErrors, setFormErrors] = useState({})
      let existedAdminname 
      let existedEmail
      const sendRegisterAdmin = async (e) => {
      e.preventDefault()
      console.log(Object.keys(formErrors).length)
      if(validate()){
      await axios.post('/admin/new', {
        ...values,
        dateCreation : new Date().toUTCString(),
        //default value... added to know if the admin is blocked or not and we 
        //know that the admin could not access to the app for the first time 
        //he has to deblocked by the Superadmin first
        blocked: 1,
      }).then((res) =>{    
        console.log(res)
          if(res.data.message.adminnameD === 'ADMINNAME_TAKEN'){
            existedAdminname=1
            validate();       
            }
          if(res.data.message.emailD === 'EMAIL_TAKEN'){
            existedEmail=1
            validate()
            }
          if (res.data.message === 'ADMIN_CREATED') {
              alert("Le sous Administrateur a été ajouter avec succées ! ")
              navigate('/adminconfig')
              }
        })   
      }
      }
     // only run when form errors change 
      useEffect(() =>{
        console.log(formErrors);
    
      },[formErrors])
    
      const validate = () => {
       let valid = true
       let errors = {}
       const regexEmail = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
       const regexAdminname= /[a-zA-Z][a-zA-Z]{2,}/
       if(!values.email){
         errors.mail=". Champ vide ! Veuillez saisie le Email de Sous Administrateur !";
         valid = false
       }else if(!regexEmail.test(values.email)){
         errors.mail=". Email incorrect ! Veuillez vérifier le Email !"
         valid = false
       }else if(existedEmail===1){
         errors.mail=". Email déja utilisé ! Changer le Email !"
         valid = false
      }
       if(!values.adminname){
        errors.adminname=". Champ vide ! Veuillez saisie le nom de Sous Administrateur !";
        valid = false
      }else if(!regexAdminname.test(values.adminname)){
        errors.adminname=". Nom incorrect ! Veuillez saisie un Nom correcte !"
        valid = false
      }else if(existedAdminname===1){
        errors.adminname=". Nom déja utilisé ! Veuillez saisie un Autre Nom !"
        valid = false
      }
      if(!values.password){
        errors.password=". Champ vide ! Veuillez saisie un Mot de Passe !";
        valid = false
      }else if(values.password.length <5){
        errors.password=". Court mdp ! Veuillez saisie un Mot de Passe sécurisé !"
        valid = false
      }
      if(!values.repassword){
        errors.repassword=". Champ vide ! Veuillez Re-saisie le Mot de Passe ! ";
        valid = false
      }else if(values.repassword !== values.password){
        errors.repassword=". Mot de Passe different ! Vérifier ! "
        valid = false
      } 
       setFormErrors(errors)
       return valid
      };
    return (
        <div className='card-background'>
        <div className='card'>
            <div className="card-header">
                <p>
                  {/* { adminname ? "Modifier Sous Administrateur": "Ajouter un Nouveau Sous Administrateur" }  */}
                  Ajouter un Nouveau Sous Administrateur</p>
            </div>
            <div className="container">
            <form method='Post'>
             <ul className="form-style-1">
              <li>
                  <label>Entrer le Nom: <span class="required">*</span></label>
                  <input name="adminname" value={values.adminname} onChange={handleInputChange} type="text" className="field-long" />
                  <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.adminname}</small>
              </li>
              <li>
                  <label>Entrer le Mail: <span class="required">*</span></label>
                  <input name="email" value={values.email} onChange={handleInputChange} type="email" className="field-long" />
                  <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.mail}</small>
             </li>
              <li>
                  <label>Entrer le mot de passe: <span class="required">*</span></label>
                  <input name="password" value={values.password} onChange={handleInputChange} type="Password" className="field-long" />
                  <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.password}</small>
             </li>
              <li>
                  <label>Re-Entrer le mot de passe: <span class="required">*</span></label>
                  <input name="repassword" value={values.repassword} onChange={handleInputChange} type="Password" className="field-long" />
                  <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.repassword}</small>
              </li>
              <li>
                  <button className='submit-button' onClick={sendRegisterAdmin} type="submit" > Créer
                  {/* { adminname ? "update": "Créer" }  */}
                  </button>
              </li>
              <li>
                  <Link to="/adminconfig">
                      <button className='btn'> Revenir</button>
                  </Link>
              </li>
             </ul>
            </form>
            </div>
  
        </div>  
      </div>
    );
}

export default CreatAdminAccount;