import {homeObjOne, homeObjThree, homeObjTwo} from '../../Data/AdminHomeData'
import AdminInfoSection from './AdminInfoSection'
import AdminNavbar from './AdminNavbar'
import ScrollToTop from './ScrollToTop';
import { useStateValue } from '../StateProvider';
import { useEffect } from 'react';
function HomeAdmin() {
    const [{user}, dispatch] = useStateValue()
    useEffect(()=>{

    },[user])
    return (
        <div>
       <ScrollToTop />
        <AdminNavbar/>
        <AdminInfoSection {...homeObjOne} />
        <AdminInfoSection {...homeObjTwo} />
        {user.adminType === 'MAIN_ADMIN' ? <AdminInfoSection {...homeObjThree} /> : ''}
        </div>
     );
}

export default HomeAdmin;