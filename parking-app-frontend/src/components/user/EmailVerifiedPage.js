import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../axios'
import './EmailVerified.css'
import image from '../../images/Logowithoutbackground.png'
const EmailVerifiedPage = () => {
    const [verif, setVerif] = useState('')
    const {code} = useParams()
    const getVerif = async () => {
        axios.post('/email/verify',{
            code : code
        }).then((res)=>{
            console.log(res)
            setVerif(res.data.message)
        })
    }
    useEffect(()=>{
        getVerif()
    })
    return (
        <div className='loginintegratedtobars'>
         <div className='verified-background'>
             <div className='verified-container'>
                 <img src={image} alt="Our Logo"/>
                { verif === 'EMAIL_VERIFIED' ? <h1>Email verifié, Vous pouvez utiliser votre compte :)</h1> : (verif === "EMAIL_NOT_VERIFIED" ? <h1>Erreur lors de vérification Email !</h1> : '')}
             </div>
         </div>
        </div>
        )
}
export default EmailVerifiedPage