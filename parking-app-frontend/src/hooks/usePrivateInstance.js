import { privateInstance } from "../components/axios";
import { useEffect } from "react";
import { useStateValue } from "../components/StateProvider";
import { actionTypes } from "../actions";
import useRt from "./useRt";
const usePrivateInstance = () => {
    const refresh = useRt()
    const [{user}, dispatch] = useStateValue()
    useEffect(()=>{
        const responseInterceptor = privateInstance.interceptors.response.use(
            response => response,
            async (error) => {
                const previousRequest = error?.config
                if(error?.response?.status === 403 && !previousRequest?.sent){
                    previousRequest.sent = true
                    await refresh()
                    return privateInstance(previousRequest)
                }
                dispatch({
                    type: actionTypes.CONNEXION_FAIL,
                })
                // navigator('/userslogin', {
                //     replace: true
                // })
                return Promise.reject(error)
            }
        )
        return () => {
            privateInstance.interceptors.response.eject(responseInterceptor)
        }
    },[refresh, dispatch])
    return privateInstance
}

export default usePrivateInstance