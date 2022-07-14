import React,{useState, useEffect} from 'react';
import './ReservePlace.css'
import { Link, useParams } from 'react-router-dom';
import { useStateValue } from '../StateProvider';
import axios from '../axios';
import { toast } from 'react-toastify';
import Moment from 'moment'

function ReservePlace(props) {
    let newPeriod
    const [{ user }, dispatch] = useStateValue()
    const [per, setPer] = useState(Number)
    const initialInputValues = {
       beginDateReservation: '',
       period: '',
       beginReservation: ''
    } 
    const [values, setValues] = useState(initialInputValues)
    const {name} = useParams()
    useEffect(()=>{
      getPlaceReservation() 
      getSingleSubsc()
    },[name, per])
    const handleInputChange = (e) => {
      const name = e.target.name
      const value = e.target.value
      setValues({
        ...values,
        [name]: value,
      })
    }   
    // b= values.beginReservation.getHours()
    // console.log('hour',b)
    //time
    let existedReservation
    let s
    let end
    let endHours
    let endMinutes
    let formattedEndHours
    const [formErrors, setFormErrors] = useState({})
    // date
    let endDate
    if(endHours>=24){
      let year = Number(values.beginDateReservation.split("-")[0]);
      console.log(year)
      let month = Number(values.beginDateReservation.split("-")[1]) - 1 ;
      console.log(month)
      let dayy = Number(values.beginDateReservation.split("-")[2]) ;
      console.log(dayy)
      let day = new Date(year, month, dayy) 
      endDate = new Date(day);
      endDate.setDate(day.getDate() + 1) 
      console.log('out', Moment(endDate).format('DD-MM-YYYY'))
    }
    else{
      endDate=values.beginDateReservation
    }
    const sendUserReservation = async (e) => {
      e.preventDefault()
      endHours = Number(values.beginReservation.split(":")[0]) + Number(values.period);
      formattedEndHours = endHours >= 24 ? endHours - 24 : endHours;
      endMinutes = values.beginReservation.split(":")[1];
      end = formattedEndHours.toString().concat(":").concat(endMinutes);
      s = per.toString().length;
      if(validate()){
      await axios.post('/users/reservation', {
        ...values,
        endDateReservation: Moment(endDate).format('YYYY-MM-DD'),
        endReservation: end,
        namePlace: name,
        username : user && user.username,
      }).then((res) =>{    
        console.log("response", res)
        if(res.data.message.beginReservationM === 'BR_TAKEN'){
          existedReservation=1
          validate();       
          }
        if(res.data.message.endReservationM === 'ER_TAKEN'){
          existedReservation=1
          validate()
          }
        if (res.data.message === 'SUCCESSFULY_RESERVED') {
          setValues(initialInputValues)
          updateSubscription()
          toast.success("La reservation est effectué avec succes !")
          }
        })   
      }
      }
      newPeriod = Number(per) - Number(values.period)
      const updateSubscription = async () =>{
        const response = await axios.put(`/users/subscription/modify/${user && user._id}`, {
          ...values,
          period: newPeriod ,
        })
        console.log("response", response)
        if (response.status === 200){
            setPer(newPeriod)
        }
        };
      useEffect(() =>{
        getPlaceReservation() 
        getSingleSubsc()
        console.log(formErrors);
      },[formErrors, per])
      const validate = () => {
        let valid = true
        let errors = {}
        const regexPeriod= /^([1-9]|1[012])$/
        if(!values.beginDateReservation){
          errors.beginDateReservation=". Champ vide ! Veuillez entrer l'heure de début de Réservation !";
          valid = false
        }
        else if(Number(values.beginDateReservation.split("-")[0]) < new Date().getFullYear() || Number(values.beginDateReservation.split("-")[1])  < new Date().getMonth() + 1 || Number(values.beginDateReservation.split("-")[2]) < new Date().getDate()){
          errors.beginDateReservation=`. Réservation invalide ! Veuillez entrer une Date de départ valide !`;
          valid = false
        }
        if(!values.beginReservation){
          errors.beginReservation=". Champ vide ! Veuillez entrer l'heure de début de Réservation !";
          valid = false
        }
        else if(Number(values.beginDateReservation.split("-")[0]) === new Date().getFullYear() && Number(values.beginDateReservation.split("-")[1]) === new Date().getMonth() + 1 && Number(values.beginDateReservation.split("-")[2]) === new Date().getDate()){
          if(Number(values.beginReservation.split(":")[0]) < new Date().getHours() || Number(values.beginReservation.split(":")[1]) < new Date().getMinutes()){
          if(Number(values.beginReservation.split(":")[0]) <= new Date().getHours()){
          errors.beginReservation=`. Réservation invalide ! Entrer une Heure de départ correcte !`
          valid = false}}
        }
        if(!values.period){
          errors.period=". Champ vide ! Veuillez Entrer la periode de Réservation !";
          valid = false
        }else if(!regexPeriod.test(values.period)){
          errors.period=". Nombre d'heure minimum alloué est 1h avec minimum de 12h !"
          valid = false
        }
        
        // else if(s===2 && values.period > per){         
        //   errors.period= `. Le nombre d'heure restant dans votre abonnements est ${per}h !`
        //   valid = false
        // }
        else if(s >=1 && Number(values.period) > Number(per)){         
          errors.period= `. Le nombre d'heure restant dans votre abonnements est ${per}h !`
          valid = false
        }
        else if(existedReservation===1){
          errors.period= ". Réservation dans le temps d'une autre, Vous ne pouvez pas réserver dans ce temps !"
          valid = false
        }        
        // else if(endHours >= 24){
        //   errors.period= `. Le délai maximale de réservation pour aujourd'hui est 23:59 !`
        //   valid = false
        // }
        setFormErrors(errors)
        return valid
       };
       const [data, setData] = useState([]);
       const getPlaceReservation = async () =>{
        const response = await axios.get(`/users/reservation/${name}`);
        if (response.status === 200){
            console.log("SHOWING ALL RESERVATIONS ...")
            setData(response.data);
        }
    };
    const getSingleSubsc = async () =>{
      const response = await axios.get(`/users/subscription/${user && user._id}`);
      console.log("response", response)
      if (response.status === 200){
          setPer(response.data.period)
          console.log("SHOWING SUBSCRIPTION PERIOD ...")
      }
      };
    return (
        <div className='backgound-reservation'>
          <div className='section'>
           <div className='make-reservation'>
             <p className='titles'> Réserver la Place numéro {name} :</p>
             <p className='small-title' style={{fontSize: '15px', color:'#276e74'}}>Le nombre d'heure d'abonnement restant est : <span style={{color: 'white'}}> {per}</span></p>
             <div className="reserve-form-style">
              <form method=''>
                  <label>Entrer La date de départ de réservation: <span className="required">*</span></label>
                  <input name="beginDateReservation" value={values.beginDateReservation} onChange={handleInputChange}  type="date" required />
                  <small style={{color:'red', display: 'block'}}>{formErrors.beginDateReservation}</small>

                  <label>Entrer L'heure de départ de réservation: <span className="required">*</span></label>
                  <input name="beginReservation" value={values.beginReservation} onChange={handleInputChange}  type="time" min={new Date().getHours() + ":" + new Date().getMinutes()} max="00:00" required  />
                  <small style={{color:'red', display: 'block'}}>{formErrors.beginReservation}</small>

                  <label>Entrer La Durée de Réservation:  <span className="required">*</span></label>
                  <small style={{color: '#dde2ed', fontSize:'9px'}}> La Durée minimale accepté est 1h avec un maximum de 12h</small>
                  <input name="period" value={values.period} onChange={handleInputChange}  type="number" min={1} max={12}  />
                  <small style={{color:'red', display: 'block'}}>{formErrors.period}</small>

                  <button className='btn-reserve' onClick={sendUserReservation}  type="submit" > 
                    Réserver
                  </button>
                </form>
               </div>
              </div>
           <div className='show-reservation'>
             <p className='titles'> Les réservations effetuées sur la place numéro {name}:  </p>
             {/* <p className='small-title'>Réservations allouées de 00:00 jusqu'à 23:59 </p> */}
             <p className='small-title' >Si vous effectuer une réservation, elle sera encadrée en <span style={{color: '#97D779', fontWeight: 'bold'}}>vert</span> pour vous !</p>
             <p className='small-title'>Une réservation doit debuter aprés une minute de fin d'une autre réservation</p>
             <table className='styled-table'>
                    <thead>
                        <tr>
                            <th>Date début Réservation</th>
                            <th>Date fin Réservation</th>
                            <th>Début de Réservation</th>
                            <th>Fin de Réservation</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data && data.map((item, index) =>{
                        return(
                          <tr style={{border:user && user.username === item.username ? '3px solid #97D779' : '', boxShadow:user && user.username === item.username ? '0 0 15px #97D779' : ''}}>
                                <td >{item.beginDateReservation}</td>
                                <td >{item.endDateReservation}</td>  
                                <td >{item.beginReservation}</td>
                                <td >{item.endReservation}</td>  
                            </tr>
                        );
                    })}     
                    </tbody>
             </table>
           </div>        
          </div>             
        </div>
    );
}

export default ReservePlace;