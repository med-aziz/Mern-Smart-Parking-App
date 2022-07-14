import React from 'react'
import './BlockedPage.css'

const BlockedPage = () => {
    return(
    <div className='blocked-background'>
     <img className='blocked-image' src='https://cdn2.iconfinder.com/data/icons/prohibited-forbidden-signs/100/Prohibited-31-512.png' alt='Blocked-image'></img>
     <h1 className='blocked-text'>Vous Etes Bloqué !</h1>
    </div>
    )
}
export default BlockedPage