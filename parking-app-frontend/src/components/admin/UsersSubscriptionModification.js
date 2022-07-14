import React,{useEffect, useState} from 'react';
import { Link, useParams } from 'react-router-dom'
import axios from '../axios'
import { useNavigate } from "react-router-dom";
import './UsersSubscription.css'
import { toast } from 'react-toastify';

function UsersSubscriptionModification(props) {
    let navigate= useNavigate()
    let newPeriod
    const initialInputValues = {
      period: '',
    } 
    const [values, setValues] = useState(initialInputValues)
    const [per, setPer] = useState(Number)
    const {username} = useParams()
    const {id} = useParams()
    useEffect(()=>{
        if(id){
            getSingleSubsc(id)
        }
        },[id])
    const getSingleSubsc = async () =>{
       const response = await axios.get(`/users/subscription/${id}`);
       console.log("response", response)
       if (response.status === 200){
           setPer(response.data.period)
           console.log("SHOWING SUBSCRIPTION PERIOD ...")
           setValues(response.data);
       }
       };
    const handleInputChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setValues({
          ...values,
          [name]: value,
        })
      }   
    const [formErrors, setFormErrors] = useState({})
    const updateSubscription = async (e) =>{
        e.preventDefault()
        if(validate()){
          newPeriod = Number(values.period)+ Number(per)
          await axios.post(`/users/subscription/modify/${id}`, {
            ...values,
            period: newPeriod ,
          }
          ).then((res) =>{    
            console.log('response', res)
            if (res.data.message === 'MODIVIED_SUBSC') {
              console.log("SUBSCRIPTION PERIOD HAS BEEN UPDATED...")
              toast.success(`L'abonnement de ${username} est mettre à jour avec succees !`)
              navigate('/userssubscription/userswithsubscription')
              }
            })   
          }
    };
    useEffect(() =>{
     console.log(formErrors);
    
    },[formErrors])
    
    const validate = () => {
        let valid = true
        let errors = {}
        const regexPeriod= /^([1-9]|1[012])$/
        if(!values.period){
          errors.period=". Champ vide ! Veuillez saisie la periode à ajouter!"
          valid = false
        }else if(!regexPeriod.test(values.period)){
          errors.period=". Nombre d'heure maximum alloué est 12h ! Merci de vérifier !"
          valid = false
        }
        setFormErrors(errors)
        return valid
       };

    return (
        <div className='addsubs-background'>
        <div className='addsubs'>
            <div className="addsubs-header">
                <p>
                  Ajouter Heures à {username} :
                </p>
            </div>
            <div className="container">
            <form method='Post'>
             <ul className="form-style-1">
              <li>
                  <label>Entrer la Période à ajouter: (en heures) <span className="required">*</span></label>
                  <small> Le nombre d'heure maximum à ajouter est 12h</small>
                  <input name="period" value={values.period} onChange={handleInputChange} type="number" min={1} max={12} className="field-long" />
                  <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.period}</small>
              </li>
              <li>
                  <button className='create-button' onClick={updateSubscription} type="submit" > 
                    Ajouter
                  </button>
              </li>
              <li>
                  <Link to="/userssubscription/userswithsubscription">
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

export default UsersSubscriptionModification;