import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
import { useStateValue } from '../components/StateProvider';
const PrivateRouteAdmins=({children}) => {
    // const user = useAuth()
    const [{user}, dispatch] = useStateValue()
    useEffect(()=>{

    },[user])
    return (
    // jwt ? children: <Navigate to="/userslogin"/>
        user === null ? '' : (user === false || user.admin === false ? <Navigate to="    "/> : (user.blocked === true ? <Navigate to="/blockedAccess"/> : children))
        // user !== null ? children : <Navigate to="/userslogin"/>
    );
}
export default PrivateRouteAdmins;

