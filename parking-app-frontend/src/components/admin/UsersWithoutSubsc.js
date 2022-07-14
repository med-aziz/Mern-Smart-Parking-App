import React, {useEffect, useState} from 'react';
import axios from '../axios';
import AdminNavbar from './AdminNavbar'
import './UsersWithoutAndWithSubsc.css'
import { Link } from 'react-router-dom';

function UsersWithoutSubsc(props) {
    const [data, setData] = useState([]);
    useEffect(()=>{
        getUsersWithoutSubs();   
    }
    ,[])
    const getUsersWithoutSubs = async () =>{
        const response = await axios.get("/users/users_without_subscription");
        if (response.status === 200){
            console.log("SHOWING USERS WITHOUT SUBSCRIPTION ...")
            console.log('data', response.data)
            setData(response.data);
        }
    };
    return (
        <div>
           <AdminNavbar/>
           <div className='users-withwithout-subsc-background'>   
           <table className='styled-table'>
                <thead>
                    <tr>
                        <th >No.</th>
                        <th>Email</th>
                        <th >Action</th>
                    </tr>
                </thead>
                <tbody>
                {data && data.map((item, index) =>{
                        return(
                            <tr key= {index}>
                                <th scope="row">{index+1}</th>
                                <td >{item.email}</td>
                                <td>
                                     <Link to= {`/userssubscription/userswithoutsubscription/add/${item.username}/${item._id}`}>
                                       <button className='btn-add'> Ajouter un abonnement </button>
                                     </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
             </table>
           </div>
        </div>
    );
}

export default UsersWithoutSubsc;