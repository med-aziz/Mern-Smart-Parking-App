import React from 'react';
import {
    SidebarContainer
    ,Icon
    ,CloseIcon
    ,SidebarWraper
    ,SidebarMenu
    ,SidebarLink
    ,SideBtnWrap
    ,SidebarRoute}
     from './SidebarElements'

const Sidebar = ({isOpen, toggle}) => {
    return (
        <>
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon/>
            </Icon> 
            <SidebarWraper>
                <SidebarMenu>
                    <SidebarLink to='/about' onClick={toggle}>
                        A Propos
                    </SidebarLink>
                    <SidebarLink to='/register'>
                        S'inscrire
                    </SidebarLink>
                </SidebarMenu>
                <SideBtnWrap>
                    <SidebarRoute to='/userslogin'>S'identifier</SidebarRoute>
                </SideBtnWrap>
            </SidebarWraper>
        </SidebarContainer>
        </>
    );
}

export default Sidebar;