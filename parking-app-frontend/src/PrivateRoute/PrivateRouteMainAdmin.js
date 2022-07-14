import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
import { useStateValue } from '../components/StateProvider';
const PrivateRouteMainAdmin=({children}) => {
    // const user = useAuth()
    const [{user}, dispatch] = useStateValue()
    useEffect(()=>{

    },[user])
    return (
    // jwt ? children: <Navigate to="/userslogin"/>
        user === null ? '' : (user === false || user?.admin == false ? <Navigate to="/adminlogin"/> : (user.adminType === "MAIN_ADMIN" && user.blocked === false ? children : <Navigate to="/blockedAccess"/> ))
        // user !== null ? children : <Navigate to="/userslogin"/>
    );
}
export default PrivateRouteMainAdmin;

