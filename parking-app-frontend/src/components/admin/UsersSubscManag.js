import React from 'react';
import AdminNavbar from './AdminNavbar'
import "./UsersSubscManag.css"
import image from '../../images/ViewSubs.svg'
import image1 from '../../images/AddSubsc.svg'
import { Link } from 'react-router-dom';

function UsersSubscManag(props) {
    return (
        <div>
            <AdminNavbar/>
            <div className='users-sub-background'>
             <div className='section'>
              <div className='articles'>
                <h1> Gérer les utilisateurs avec abonnement</h1>
                <p>Bloquer/Débloquer et Modifier des abonnements</p>
                <Link to= "/userssubscription/userswithsubscription">
                 <button className='buttn'> Gérer</button>
                </Link>
                <img src={image}></img>  
              </div>
              <div className='articles'>
                <h1> Gérer les utilisateurs sans abonnement</h1>
                <p>Ajouter abonnements</p>
                <Link to= "/userssubscription/userswithoutsubscription">
                 <button className='buttn'> Gérer</button>
                </Link>
                <img src={image1}></img>
              </div>
             </div>
            </div>
        </div>
    );
}

export default UsersSubscManag;