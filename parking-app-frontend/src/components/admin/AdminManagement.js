import React, {useEffect, useState} from 'react';
import AdminNavbar from './AdminNavbar'
import './AdminManagement.css'
import PersonRemoveIcon from '@material-ui/icons/DeleteOutline';
import AppBlockingIcon from '@material-ui/icons/BlockOutlined';
import PersonIcon from "@material-ui/icons/Person"
import EditIcon from '@material-ui/icons/Edit';
import { Link } from 'react-router-dom'
import axios from '../axios';

function AdminManagement(props) {
    const [data, setData] = useState([]);
    useEffect(()=>{
        getAdmins();   
    }
    ,[])
    const getAdmins = async () =>{
        const response = await axios.get("/admin/all");
        if (response.status === 200){
            setData(response.data);
        }
    };
    const onDeleteAdmin = async (adminname) => {
        if(window.confirm(`Etes-vous sûr de vouloir supprimer ${adminname} ?`)){
            const response = await axios.delete(`/admin/${adminname}`);
            if(response.status === 200){
                getAdmins();
            }
        }
    }
    return (
        <div>
           <AdminNavbar/>
           <div className='admin-backgound'>
           <Link style={{textDecoration:"none"}} to="/homeadmin/admin/createadminaccount"> 
            <button className='bttn' > Ajouter un sous administrateur </button>
           </Link>
           <table className='styled-table'>
                <thead>
                    <tr>
                        {/* <th >No.</th> */}
                        <th >Nom</th>
                        <th>Email</th>
                        <th >Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, index) =>{
                        return(
                            <tr key= {index}>
                                {/* <th scope="row">{index+1}</th> */}
                                <td >{item.adminname}</td>
                                <td >{item.email}</td>
                                <td > 
                                    <Link className='PersonIcon' to={`/adminconfig/ShowAdmin/${item.adminname}`}>
                                     <PersonIcon/> 
                                    </Link>
                                    <Link className='EditIcon' to={`/adminconfig/editadmin/${item.adminname}`}>
                                     <EditIcon/>
                                    </Link>
                                    <Link className='PersonRemoveIcon' onClick={() =>onDeleteAdmin(item.adminname)} to="" >
                                     <PersonRemoveIcon/>
                                    </Link>
                                    <Link className='AppBlockingIcon' to="">
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

export default AdminManagement;