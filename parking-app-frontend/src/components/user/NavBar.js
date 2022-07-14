import React, { useEffect } from 'react'
import '../NavBar.css'
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtnTwo,
    NavBtnLink
  } from './NavBarElements';
import { actionTypes } from '../../actions'
import { useStateValue } from '../StateProvider';
import axios from '../axios'
import { Navigate, useNavigate } from 'react-router-dom';
const Navbar = ({toggle}) => {
    const [{user}, dispatch] = useStateValue()
    const navUtil = useNavigate()
    const logout = async () => {
      const userStatus = user.admin
      console.log("userStatus : ",userStatus)
      await axios.post('/logout').then((res)=>{
        if(res.data.message === "LOGGED_OUT"){
          localStorage.removeItem('rusc')
          dispatch({
            type: actionTypes.CONNEXION_FAIL,
          })
          if(userStatus === true){
            navUtil('/adminlogin',{
              replace: true
            })
          }else{
            navUtil('/userslogin',{
              replace: true
            })
          }
        }
      })
    }
    useEffect(()=>{

    },[user])
    return (
      <>
        <Nav>
          <NavLink to={[null, false].includes(user) ? '/userslogin' : (user.admin === false ? '/home' : (user.admin === true ? '/homeadmin' : '/userslogin'))}>
          <img style={{ objectFit: 'contain', height: '110px'}} src={require('../../images/Logowithoutbackground.png')} alt='logo' />
          </NavLink>
          <Bars onClick={toggle} />
          <NavMenu>
            {[null,false].includes(user) ? '' :
            <NavLink to={user.admin === false ? '/home' : (user.admin === true ? '/homeadmin' : '')} activeStyle>
              Home
            </NavLink>}
            { [null, false].includes(user) ?
            <NavLink to='/register' activeStyle>
              S'inscrire
            </NavLink> : ''
            } 
            {/* Second Nav */}
            {[null,false].includes(user) ? <NavBtnLink to='/userslogin'>S'identifier</NavBtnLink> : <NavBtnTwo onClick={logout}>Logout</NavBtnTwo>}
          </NavMenu>
        </Nav>
      </>
    );
  };
  
  export default Navbar;