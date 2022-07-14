import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItem,
  NavLinks,
} from './AdminNavbarElement';
import { useStateValue } from '../StateProvider';
function Navbar() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const [{user}, dispatch] = useStateValue()
  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <NavbarContainer>
            <NavLogo to='/homeadmin' onClick={closeMobileMenu}>
              <img style={{ objectFit: 'contain', height: '110px'}} src={require('../../images/Logowithoutbackground.png')} alt='logo' />
            </NavLogo>
            <MobileIcon onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </MobileIcon>
            <NavMenu onClick={handleClick} click={click}>
              <NavItem>
                <NavLinks to='/homeadmin/users' onClick={closeMobileMenu}>
                  Gérer les Utilisateurs
                </NavLinks>
              </NavItem>
              <NavItem>
                <NavLinks to='/homeadmin/subs' onClick={closeMobileMenu}>
                  Gérer les Abonnements
                </NavLinks>
              </NavItem>
              {
              user.adminType === 'MAIN_ADMIN' ?
              <NavItem>
                <NavLinks to='/homeadmin/admin' onClick={closeMobileMenu}>
                  Gérer les Sous Administrateurs
                </NavLinks> 
              </NavItem> : ''
              } 
            </NavMenu>
          </NavbarContainer>
        </Nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;