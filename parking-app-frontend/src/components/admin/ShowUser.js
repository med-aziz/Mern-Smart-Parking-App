import React, {useState,useEffect} from 'react';
import {useParams, Link} from 'react-router-dom'
import axios from '../axios'
import './ShowUser.css'

const ShowUser = () => {
    const[user, setUser] = useState(null)
    const {username} = useParams()
    useEffect(()=>{
        if(username){
            getSingleUser(username);
        }   
    }
    ,[username])
    const getSingleUser = async (username) =>{
        const response = await axios.get(`/users/find/${username}`);
        console.log("response", response)
        if (response.status === 200){
            setUser(response.data);
            console.log("user", user)
        }
    };

    return (
        <div className='card-background'>
          <div className='card'>
              <div className="card-header">
                  <p>Les Cordonnées de {`${username}`} :</p>
              </div>
              <div className="container">
                  <ul >
                  <strong >ID: </strong>
                  <li>{user && user._id}</li>
                  <br />
                  <strong >Date de creation: </strong>
                  <li>{user && user.dateCreation}</li>
                  <br />
                  <strong >Numéro de Tél: </strong>
                  <li>{user && user.number}</li>
                  <br />
                  <strong >Email: </strong>
                  <li>{user && user.email}</li>
                  <br />
                  <strong >CIN: </strong>
                  <li>{user && user.numidentity}</li>
                  <br />
                  <Link to="/usersconfig">
                      <button className='btn'> Revenir</button>
                  </Link>
                  </ul>
              </div>
          </div>  
        </div>
        
    );
}

export default ShowUser;