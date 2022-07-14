import React, {useState,useEffect} from 'react';
import {useParams, Link} from 'react-router-dom'
import axios from '../axios'
import './ShowAdmin.css'

const ShowAdmin = () => {
    const[admin, setAdmin] = useState(null)
    const {adminname} = useParams()
    useEffect(()=>{
        if(adminname){
            getSingleAdmin(adminname);
        }   
    }
    ,[adminname])
    const getSingleAdmin = async (adminname) =>{
        const response = await axios.get(`/admin/${adminname}`);
        console.log("response", response)
        if (response.status === 200){
            setAdmin(response.data);
            console.log("admin", admin)
        }
    };

    return (
        <div className='card-background'>
          <div className='card'>
              <div className="card-header">
                  <p>Les Cordonnées de Sous Admin " {`${adminname}`} " :</p>
              </div>
              <div className="container">
                  <ul >
                  <strong >ID: </strong>
                  <li>{admin && admin._id}</li>
                  <br />
                  <strong >Date de creation: </strong>
                  <li>{admin && admin.dateCreation}</li>
                  <br />
                  <strong >Email: </strong>
                  <li>{admin && admin.email}</li>
                  <br />
                  <Link to="/adminconfig">
                      <button className='btn'> Revenir</button>
                  </Link>
                  </ul>
              </div>
          </div>  
        </div>
        
    );
}

export default ShowAdmin;