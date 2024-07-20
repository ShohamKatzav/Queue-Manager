import './App.css'
import {
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { CookiesProvider } from 'react-cookie';
import ClientHome from './pages/ClientHome';
import GuardedRoute from './guards/GuardedRoute';
import UserType from './pages/UserType';
import BusinessesList from './pages/BusinessesList';
import BusinessSchedule from './pages/BusinessSchedule';
import AppointmentsList from './pages/AppointmentsList';


const router = createBrowserRouter([
  { path: "*", Component: Root },
]);

function App() {
  return (
    <>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <RouterProvider router={router} />
      </CookiesProvider>
    </>
  )
}

function Root() {
  return (
    <div className="app">
      <div className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/user-type" element={<UserType />} />
          <Route path='/' element={<GuardedRoute/>}>
            <Route path='/home' element={<ClientHome/>}/>
            <Route path='/businesses-list' element={<BusinessesList/>}/>
            <Route path='/business-schedule' element={<BusinessSchedule/>}/>
            <Route path='/appointments' element={<AppointmentsList/>}/>
          </Route>
        </Routes>
      </div>

    </div>
  );
}


export default App
