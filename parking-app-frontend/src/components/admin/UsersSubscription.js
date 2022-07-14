import React, {useState, useEffect} from 'react';
import { Link, useParams } from 'react-router-dom'
import axios from '../axios'
import { useNavigate } from "react-router-dom";
import './UsersSubscription.css'
import { toast } from 'react-toastify';

function UsersSubscription(props) {
    let navigate= useNavigate()
    const initialInputValues = {
      period: '',
    } 
    const [values, setValues] = useState(initialInputValues)
    const {id} = useParams()
    const {username} = useParams()
    useEffect(()=>{
    },[id])
    const handleInputChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setValues({
          ...values,
          [name]: value,
        })
      }   
    const [formErrors, setFormErrors] = useState({})
    const changeSubscValue = async () =>{
        const response =  await axios.post(`/users/subscription/add/${id}`)
        if (response.status === 200){
            console.log("SUBSCRIPTION ADDED SUCCESFULY TO THE USER...");
        }
    };
    const sendUserSubscription = async (e) => {
      e.preventDefault()
      if(validate()){
      await axios.post('/users/subscription', {
        ...values,
        dateCreation : new Date().toUTCString(),
        userId : id,
      }).then((res) =>{    
        console.log("response", res)
          if (res.data.message === 'SUCCESSFULY_ADDED') {
              changeSubscValue()
              toast.success("Le nombre d'heures d'abonnement a été affecté avec success !")
              navigate('/userssubscription/userswithsubscription')
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
       const regexPeriod= /^([1-9]|1[012])$/
       if(!values.period){
         errors.period=". Champ vide ! Veuillez la periode d'abonnement !";
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
                  Ajouter abonnement à {username} :
                </p>
            </div>
            <div className="container">
            <form method='Post'>
             <ul className="form-style-1">
              <li>
                  <label>Entrer la Période: (en heures) <span className="required">*</span></label>
                  <small> Le nombre d'heure maximum est 12h</small>
                  <input name="period" value={values.period} onChange={handleInputChange} type="number" min="1" max="12" className="field-long" />
                  <small style={{fontWeight:'bold' ,color:'red'}}>{formErrors.period}</small>
              </li>
              <li>
                  <button className='create-button' onClick={sendUserSubscription} type="submit" > 
                    Créer
                  </button>
              </li>
              <li>
                  <Link to="/userssubscription/userswithoutsubscription">
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

export default UsersSubscription;