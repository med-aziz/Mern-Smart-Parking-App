import {homeObjOne} from './AdminHomeData'
import AdminInfoSection from '../components/admin/AdminInfoSection'
import AdminNavbar from '../components/admin/AdminNavbar'

function IndexUser() {

    return (
        <div>
        <AdminNavbar/>
        <AdminInfoSection {...homeObjOne} />
        </div>
     );
}

export default IndexUser;