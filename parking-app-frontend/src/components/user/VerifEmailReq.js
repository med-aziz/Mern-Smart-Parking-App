import { useStateValue } from '../StateProvider'
import './EmailVerified.css'
import './Login.css'

import image from '../../images/Logowithoutbackground.png'
import usePrivateInstance from '../../hooks/usePrivateInstance'
import {toast} from 'react-toastify'
const VerifEmailReq = () => {
    const [state, dispatch] = useStateValue()
    const privateInstance = usePrivateInstance()
    const sendEmail = async () => {
        privateInstance.post('/send/verif/email').then(res=>{
            if(res.status===201){
                if(res.data.success === true){
                    toast.success(`An email was sent to you!`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                }else{
                    toast.error(`Error Sending Email`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                }
            }else{
                if(res.data.success === true){
                    toast.error(`Error Sending Email`, {
                        position: "top-center",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      })
                }
            }
        })
    }
    return (
        <div className='loginintegratedtobars'>
         <div className='verified-background'>
             <div className='verified-container'>
                 <img src={image} alt="Our Logo"/>
                 <h1>Need To Verify Your Email Before Getting Access To The Application</h1>
                 <button onClick={sendEmail}>Click To Send Email</button>
             </div>
         </div>
        </div>
        )
}
export default VerifEmailReq