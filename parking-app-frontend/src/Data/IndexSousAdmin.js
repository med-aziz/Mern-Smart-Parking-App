import {homeObjThree} from './AdminHomeData'
import AdminInfoSection from '../components/admin/AdminInfoSection'
import AdminNavbar from '../components/admin/AdminNavbar'

function IndexSousAdmin() {

    return (
        <div>
        <AdminNavbar/>    
        <AdminInfoSection {...homeObjThree} />
        </div>
     );
}

export default IndexSousAdmin;