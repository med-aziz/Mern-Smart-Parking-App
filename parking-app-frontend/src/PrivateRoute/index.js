import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
import { useStateValue } from '../components/StateProvider';
const PrivateRoute=({children}) => {
    // const user = useAuth()
    const [{user}, dispatch] = useStateValue()
    useEffect(()=>{

    },[user])
    return (
    // jwt ? children: <Navigate to="/userslogin"/>
        user === null ? '' : (user === false ? <Navigate to="/userslogin"/> : (user.blocked === true ? <Navigate to="/blockedAccess"/> : (user.verifiedState === false ? <Navigate to="/verify_email_request"/> : (user.admin === false ? children : <Navigate to="/adminlogin"/>))))
        // user !== null ? children : <Navigate to="/userslogin"/>
    );
}
export default PrivateRoute;

