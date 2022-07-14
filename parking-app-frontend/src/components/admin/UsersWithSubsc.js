import React, {useEffect, useState} from 'react';
import axios from '../axios';
import AdminNavbar from './AdminNavbar'
import './UsersWithoutAndWithSubsc.css'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

function UsersWithSubsc(props) {
    let navigate= useNavigate()
    const [block, setBlock] = useState({});
    const [data, setData] = useState([]);
    useEffect(()=>{
        getUsersWithSubs();   
    }
    ,[])
    const getSingleSubsc = async (id) =>{
        const response = await axios.get(`/users/subscription/${id}`);
        console.log("response", response)
        if (response.status === 200){
            console.log("SHOWING SUBSCRIPTION PERIOD ...")
            setBlock(response.data);
        }
        };
    const getUsersWithSubs = async () =>{
        const response = await axios.get("/users/users_with_subscription");
        if (response.status === 200){
            console.log("SHOWING USERS WITH SUBSCRIPTION ...")
            setData(response.data);
        }
    };
    
    // const deleteUserSubscription = async (id) =>{
    //     const response = await axios.delete(`/users/subscription/remove/${id}`);
    //     if (response.status === 200){
    //         console.log("USER SUBSCRIPTION HAS BEEN DELETED ...")
    //     }
    // };
    // const onDeleteSubscription = async (id, username) =>{
    //     if(window.confirm(`Etes-vous sûr de vouloir supprimer l'abonnement de ${username} ?`)){
    //     const response = await axios.put(`/users/subscription/remove/${id}`);
    //     if (response.status === 200){
    //         deleteUserSubscription(id)
    //         navigate('/userssubscription/userswithoutsubscription')
    //     }}
    // };

    const onBlockSubscription = async (id, username) => {
        const response = await axios.get(`/usersubscription/block/${id}`, {
        })
        getUsersWithSubs()
        getSingleSubsc(id)
        console.log(response)
        if(response.data.message.blockedNewStatus === true){
            //   setBlock(true)
              toast(`🚫 L'abonnement de ${username} est bloqué maintenant !`, {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
              }) }
  
         if (response.data.message.blockedNewStatus === false){
        //   setBlock(false)
          toast(`✔️ L'abonnement de ${username} est débloqué maintenant !`, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
           }) }
        }
      console.log(block.userId,block.blocked)  
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
                                    <Link to= {`/userssubscription/userswithsubscription/modify/${item.username}/${item._id}`}>
                                     <button className='btn-modify'>Modifier abonnement</button> 
                                    </Link>                        
                                    {/* <button className='btn-delete' onClick={() =>onBlockSubscription(item._id, item.username)} >Bloquer/ Debloquer abonnement</button> */}
                                 {/* {block.blocked === false && block.userId === item._id ?  <button className='btn-delete' 
                                      onClick={() =>onBlockSubscription(item._id, item.username)} >Bloquer abonnement</button> :
                                      <button className='btn-delete' onClick={() =>onBlockSubscription(item._id, item.username)} >
                                      Debloquer abonnement</button>} */}
                                       {block.userId === item._id ? (block.blocked === false ? <button className='btn-delete' 
                                        onClick={() =>onBlockSubscription(item._id, item.username)} >Bloquer abonnement</button> :
                                        <button className='btn-delete' onClick={() =>onBlockSubscription(item._id, item.username)} >
                                         Debloquer abonnement</button>) : <button className='btn-delete' onClick={() =>onBlockSubscription(item._id, item.username)} >B/Déb-loquer abonnement</button> }
                                 {/* <button className='btn-delete' onClick={() =>onBlockSubscription(item._id, item.username)} >B/Déb-loquer abonnement</button> */}
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

export default UsersWithSubsc;