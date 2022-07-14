import { useContext, useDebugValue, useEffect } from "react";
import { useStateValue } from "../components/StateProvider";
import { actionTypes } from '../actions';
import usePrivateInstance from './usePrivateInstance';
// import axios from 'axios';
const useAuth = () => {
    const privateInstance = usePrivateInstance()
    const [{user}, dispatch] = useStateValue()
    async function authCheck(){
        await privateInstance.get('/users/protected').then(res => {
          if(res.data.message === "AUTHENTICATED"){
            dispatch({
              type: actionTypes.SET_USER,
              user: res.data.user,
            })
          }else{
            dispatch({
              type: actionTypes.CONNEXION_FAIL,
              user: res.data.user,
            })
          }
        })
        // const res = await privateInstance.get('/users/protected')
        //   if(res.data.message === "AUTHENTICATED"){
        //     dispatch({
        //       type: actionTypes.SET_USER,
        //       user: res.data.user,
        //     })
        //   }else{
        //     dispatch({
        //       type: actionTypes.CONNEXION_FAIL,
        //       user: res.data.user,
        //     })
        //   }
      }
      useEffect(()=>{
          authCheck()
      },[])
      return user
}
export default useAuth