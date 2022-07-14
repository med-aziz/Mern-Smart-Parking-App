import './App.css';
import React, { useEffect } from 'react'
import Login from './components/user/Login';
import AdminLogin from './components/admin/AdminLogin'
import Home from './components/user/Home';
import Register from './components/user/Register';
import{BrowserRouter as Router,Route, Routes} from'react-router-dom';
import Error from './components/Error';
// import Pusher from 'pusher-js'
import PrivateRoute from './PrivateRoute';
import Bars from './components/user/Bars';
import useAuth from './hooks/useAuth'
import HomeAdmin from './components/admin/HomeAdmin'
import UsersSubscManag from './components/admin/UsersSubscManag'
import UsersManagement from './components/admin/UsersManagement'
import AdminManagement from './components/admin/AdminManagement'
import IndexUser from './Data/IndexUser'
import IndexSousAdmin from './Data/IndexSousAdmin';
import IndexSubs from './Data/IndexSubs';
import ShowUser from './components/admin/ShowUser'
import UsersWithSubsc from './components/admin/UsersWithSubsc';
import UsersWithoutSubsc from './components/admin/UsersWithoutSubsc'
import UsersSubscriptionModification from './components/admin/UsersSubscriptionModification'
import UsersSubscription from './components/admin/UsersSubscription'
import ProfileInfo from './components/user/ModifyProfile'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ReservePlace from  './components/user/ReservePlace'
import ShowAdmin from './components/admin/ShowAdmin'
import CreatAdminAccount from './components/admin/CreatAdminAccount';
import BlockedPage from './components/user/BlockedPage'
import EmailVerifiedPage from './components/user/EmailVerifiedPage'
import { useStateValue } from './components/StateProvider';
import PrivateRouteAdmins from './PrivateRoute/PrivateRouteAdmins';
import PrivateRouteMainAdmin from './PrivateRoute/PrivateRouteMainAdmin';
import VerifEmailReq from './components/user/VerifEmailReq';
import PrivateRouteEmailVerif from './PrivateRoute/PrivateRouteEmailVerif';
function App() {
  const user = useAuth()
  // const [{user}, dispatch] = useStateValue()
//   const [register, setRegister] = useState([])
//   useEffect(() => {
//     const pusher = new Pusher('c555cd8cd90de494fdbf', {
//     cluster: 'eu'
//     });
//     const channel = pusher.subscribe('register');
//     channel.bind('inserted', (data) => {
//       setRegister([...register, data])
//  });
//  return () => {
//  channel.unbind_all()
//  channel.unsubscribe()
//  }
//  }, [register])
//  console.log(register)
  console.log('user : ', user)
  useEffect(()=>{

  },[user])

  return (
    <Router>
      <Bars/>
      <ToastContainer/>
     <Routes>
      <Route exact path='/homeadmin/admin' element={
      <PrivateRouteMainAdmin>
        <IndexSousAdmin />
      </PrivateRouteMainAdmin>
      }/>  
      <Route path='/homeadmin/users' element={
      <PrivateRouteAdmins>
        <IndexUser />
      </PrivateRouteAdmins>
      }/>  
      <Route path='/homeadmin/subs' element={
      <PrivateRouteAdmins>
        <IndexSubs />
      </PrivateRouteAdmins>
      }/> 
      <Route path='/homeadmin/admin/createadminaccount' element={
        <PrivateRouteMainAdmin>
          <CreatAdminAccount />
        </PrivateRouteMainAdmin>
      }/> 
      <Route path="/verify_email_request" element={
      <PrivateRouteEmailVerif>
        <VerifEmailReq/>
      </PrivateRouteEmailVerif>
      }/>
      <Route path={`/usersconfig/showuser/:username`} element={
      <PrivateRouteAdmins>
            < ShowUser/>
      </PrivateRouteAdmins>
      }/>
      <Route path={`/adminconfig/showadmin/:adminname`} element={
      <PrivateRouteMainAdmin>
        < ShowAdmin/>
      </PrivateRouteMainAdmin>}/>
      <Route path={`/adminconfig/editadmin/:adminname`} element={
      <PrivateRouteMainAdmin>
              < CreatAdminAccount/>
      </PrivateRouteMainAdmin>
      }/>
      <Route path='/adminlogin' element={<AdminLogin />}/>  
      <Route path='/homeadmin' element={
        <PrivateRouteAdmins>
          <HomeAdmin />
        </PrivateRouteAdmins>
      }/>  
      <Route path='/userssubscription' element={
      <PrivateRouteAdmins>
        <UsersSubscManag />
      </PrivateRouteAdmins>}/> 
      <Route path='/usersconfig' element={
        <PrivateRouteAdmins>
          <UsersManagement />
        </PrivateRouteAdmins>}/> 
      <Route path='/adminconfig' element={
        <PrivateRouteMainAdmin>
          <AdminManagement />
        </PrivateRouteMainAdmin>}/> 
      <Route exact path='/userslogin' element={<Login />}/>
      <Route path='/register' element={<Register />}/>
      <Route path="/blockedAccess" element={<BlockedPage/>}/>
      <Route path={`/verify/email/:code`} element={<EmailVerifiedPage/>}/>
      {/* makin it a private route.. the user have to login first... and have the jwt  */}
      <Route path='/home' element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      }/>
      <Route path='/userssubscription/userswithoutsubscription' element={
        <PrivateRouteAdmins>
          <UsersWithoutSubsc />
        </PrivateRouteAdmins>
      }/> 
      <Route path={`/userssubscription/userswithoutsubscription/add/:username/:id`} element={
        <PrivateRouteAdmins>
          <UsersSubscription/>
        </PrivateRouteAdmins>
      }/>
      <Route path='/userssubscription/userswithsubscription' element={
      <PrivateRouteAdmins>
        <UsersWithSubsc />
      </PrivateRouteAdmins>
      }/>
      <Route path={`/userssubscription/userswithsubscription/modify/:username/:id`} element={
      <PrivateRouteAdmins>
        <UsersSubscriptionModification />
      </PrivateRouteAdmins>
      }/> 
      <Route path='/profileinfo' element={
      <PrivateRoute>
        <ProfileInfo />
      </PrivateRoute>
      }/>
      <Route path={`/reserveplace/:username/:name`} element= {
      <PrivateRoute>
        <ReservePlace/>
      </PrivateRoute>
      }/>
      <Route path='*' element={<Error/>}/>
     </Routes>
     {/* <div className="app">
      { !user ? <Login /> : (
      <div className="app__body">
       <Home />
      </div>
     )}
     <NavBar/>
      </div> */}
    </Router>
  );
}
export default App;