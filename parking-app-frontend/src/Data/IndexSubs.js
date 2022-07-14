import {homeObjTwo} from './AdminHomeData'
import AdminInfoSection from '../components/admin/AdminInfoSection'
import AdminNavbar from '../components/admin/AdminNavbar'

function IndexSubs() {

    return (
        <div>
        <AdminNavbar/>    
        <AdminInfoSection {...homeObjTwo} />
        </div>
     );
}

export default IndexSubs;