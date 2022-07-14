import React, {useEffect, useState} from 'react';
import axios from '../axios';
import './UsersManagement.css'
import PersonIcon from "@material-ui/icons/Person"
import PersonRemoveIcon from '@material-ui/icons/DeleteOutline';
import AppBlockingIcon from '@material-ui/icons/BlockOutlined';
import { Link } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'

function UsersManagement(props) {
    const [data, setData] = useState([]);
    useEffect(()=>{
        getUsers(); 
        console.log(data)  
    }
    ,[])
    const getUsers = async () =>{
        const response = await axios.get("/users/all");
        if (response.status === 200){
            setData(response.data);
        }
    };
    const onDeleteUser = async (username) => {
        if(window.confirm(`Etes-vous sûr de vouloir supprimer ${username} ?`)){
            const response = await axios.get(`/user/${username}`);
            if(response.status === 200){
                getUsers();
            }
        }
    }
    const onBlockUser = async (username) => {
        if(window.confirm(`Etes-vous sûr de vouloir bloquer/débloquer ${username} ?`)){
              const response = await axios.get(`/user/block/${username}`, {
              })
                console.log(response)
                if(response.data.message.blockedNewStatus === true){
                    alert(`${username} est bloqué !`) }
        
        if (response.data.message.blockedNewStatus === false){
            alert(`${username} est débloqué !`) }
}
    }
    console.log("data=>", data)
    return ( 
        <div  >
            <AdminNavbar/>
            <div className='table-background'>
             <table className='styled-table'>
                <thead>
                    <tr>
                        {/* <th >No.</th> */}
                        <th >Nom</th>
                        <th >Email</th>
                        <th >Numéro</th>
                        <th >Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, index) =>{
                        return(
                            <tr key= {index}>
                                {/* <th scope="row">{index+1}</th> */}
                                <td >{item.username}</td>
                                <td >{item.email}</td>
                                <td >{item.number}</td>
                                <td > 
                                    <Link className='PersonIcon' to={`/usersconfig/ShowUser/${item.username}`}>
                                     <PersonIcon/> 
                                    </Link>
                                    <Link className='PersonRemoveIcon' to="" onClick={() => onDeleteUser(item.username)}>
                                     <PersonRemoveIcon/>
                                    </Link>
                                    <Link className='AppBlockingIcon' to="" onClick={() => onBlockUser(item.username)}>
                                     <AppBlockingIcon/>
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

export default UsersManagement;