import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
import { useStateValue } from '../components/StateProvider';
const PrivateRouteEmailVerif=({children}) => {
    // const user = useAuth()
    const [{user}, dispatch] = useStateValue()
    useEffect(()=>{

    },[user])
    return (
    // jwt ? children: <Navigate to="/userslogin"/>
        user === null ? '' : (user === false ? <Navigate to="/userslogin"/> : (user.blocked === true ? <Navigate to="/blockedAccess"/> : (user.verifiedState === true ? <Navigate to="/home"/> : children)))
        // user !== null ? children : <Navigate to="/userslogin"/>
    );
}
export default PrivateRouteEmailVerif;