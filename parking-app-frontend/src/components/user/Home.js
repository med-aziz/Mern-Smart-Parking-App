import Login from './Login.js'
import { useStateValue } from '../StateProvider';
import './Home.css'
import firebaseDatabase from '../../firebase'
import Navbar from './NavBar.js';
import Bars from './Bars';
import {set, ref} from 'firebase/database'
import firebaseDb from '../../firebase'
import { toast } from 'react-toastify';
import usePrivateInstance from '../../hooks/usePrivateInstance'
import { useEffect, useState } from 'react';
import axios from '../axios';
import { Link } from 'react-router-dom'
import Pusher from 'pusher-js'
function Home() {
    const [data, setData] = useState([])
    const privateInstance = usePrivateInstance()
    const getSpots = async () => {
      const response  = await axios.post('/spots/all')
      if(response.status===200){
        var chunks = [], i = 0, n = response.data.length;
        while (i < n) {
          chunks.push(response.data.slice(i, i += 3));
        }
        console.log('chunks : ', chunks)
        setData(chunks)
      }
    } 
    async function openEnBar(){
      await privateInstance.post('/open/barrier/ent').then((res) => {
        console.log('data from server : ' , res.data)
        if(res.status === 201 && res?.data?.success === true){
          console.log('in function : ', firebaseDb)
          set(ref(firebaseDb,'var'), true)
          toast(`La Barriére est ouverte !`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }) 
        }else{
          toast(`La Barriére va étre fermé automatiquement !`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
    }
    async function openExBar(){
      await privateInstance.post('/open/barrier/exi').then((res) => {
        console.log('data from server : ' , res.data)
        if(res.status === 201 && res?.data?.success === true){
          console.log('in function : ', firebaseDb)
          set(ref(firebaseDb,'var1'), true)
          toast(`La Barriére est ouverte !`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }) 
        }else{
          toast(`La Barriére va étre fermé automatiquement !`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
    }
    useEffect(()=>{ 
      getSpots();
      const pusher = new Pusher("a9f50e8f094fa9a14a50", {
        cluster: 'eu'
      });
      const channel = pusher.subscribe('parkspots')
      channel.bind('updated', newData =>{
        console.log("updated")
        getSpots()
      })
      return () => {
        channel.unbind_all()
        channel.unsubscribe()
      }
    },[])
    console.log('data : ', data)
    console.log('data Length : ', data.length)

    const [{ user }, dispatch] = useStateValue()
    // { !user ? <Login /> : (
        //     <div className="app__body">
        //      <Home />
        //     </div>
        //    )}
        const [blocked, setBlocked] = useState(Boolean)
        const getSingleSubsc = async () =>{
          const response = await axios.get(`/users/subscription/${user && user._id}`);
          console.log("response", response)
          if (response.status === 200){
              setBlocked(response.data.blocked)
          }
          };
          useEffect(()=>{
            if(user && user._id){
                getSingleSubsc(user && user._id)
            }
            },[user && user._id])
            console.log(blocked)
        return (
            <div className='background-home'>
            {/* {user && user.subscription === '0' ?    
            toast.success(`Pour que vous bénifier des fonctionnalité de l'application, Merci d'acheter un Abonnement`
                 ): ''} */}
            {blocked === true
            ?''
            : (user && user.subscription === 1
            ?<button className='home-btn' onClick={openEnBar}>Ouvrir la barriére d'entrée</button> 
            : '') }         
              {/* <p><span style={{border: '8px solid #FFB7C5', backgroundColor: '#FFB7C5'}}></span> Place occupée </p>
              <div style={{border: '1px solid #97D779', width: '20px', height: '20px', backgroundColor: '#97D779'}}></div> Place libre */}
            <table style={{paddingTop:user && user.subscription === '0' ? '55px' : ''}} className='main-table'>
              {/* <h4 style={{textAlign: 'center', paddingTop: '20px', fontSize: '10px'}}>Les places colorées en <span style={{color: '#FFB7C5'}}>rouge</span> sont occupée maintenant alors que celle en <span style={{color: '#97D779'}}>vert</span> sont libres </h4> */}
            <tr>
            {data &&
            data.map((item) => {
              return(
                <td>
                <table className='home-table'>
                    {item.map((ite)=>{
                        return(
                            <tr>
                            {/* if place is not occupied then the color is green else it's red */}
                            {/* <Link className='my' to="profileinfo"> */}                      
                            {user && user.subscription === 1 ? 
                              <td className='for-userswithsubscription' style={{backgroundColor:ite.state === false ? '#e14a4a' : '#97D779'}}>
                              <p style={{textAlign: 'center', color: '#276e74', fontWeight: 'bold'}}>{ite.name}
                              {/* <br/> {ite.state === false ? 'Place ocupée' : 'place libre'} */}
                              </p> 
                              {blocked === true ? <div style={{padding: '28px'}}></div>
                              : <Link to= {`/reserveplace/${user && user.username}/${ite.name}`}>
                              <button className='reserve-btn'>Réserver</button>
                              </Link> }                                                       
                            </td>
                            :  <td className='for-userswithoutsubscription'
                            style={{backgroundColor:ite.state === false ? '#D36E70' : '#97D779'}}>
                            <p style={{textAlign: 'center', color: '#276e74', fontWeight: 'bold'}}>{ite.name}
                            {/* <br/> {ite.state === false ? 'Place ocupée' : 'place libre'} */}
                            </p> 
                            {/* <p style={{textAlign: 'center', color: '#276e74', fontWeight: 'bold'}}>{ite.state === false ?<small style={{fontSize: '8px'}}>Place Occupé</small>:<small style={{fontSize: '8px'}}>Place Libre</small>}</p> */}
                             </td>}                        
                          {/* </Link> */}
                        </tr>
                      )
                    })}
                </table>
              </td>)
            })}
            </tr>
            </table>
            {blocked === true 
            ? '' 
            : (user && user.subscription === 1
            ? <button className='home-btn' onClick={openExBar}>Ouvrir la barriére de sortie </button>  
            : '')}
        </div>
     );
    }

export default Home;