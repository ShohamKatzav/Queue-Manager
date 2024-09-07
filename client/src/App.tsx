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
import { UserProvider } from './context/userProvider';
import ClientHome from './pages/ClientHome';
import BusinessHome from './pages/BusinessHome';
import GuardedRoute from './guards/GuardedRoute';
import UserType from './pages/UserType';
import BusinessesList from './pages/BusinessesList';
import MakeAppointment from './pages/MakeAppointment';
import BusinessesLocation from './pages/BusinessesLocation';
import AppointmentsList from './pages/AppointmentsList';
import BusinessesName from './pages/BusinessesName';
import useUser from './hooks/useUser';
import Reschedule from './pages/Reschedule';
import NotFound from './pages/NotFound';


const router = createBrowserRouter([
  { path: "*", Component: Root },
]);

function App() {
  return (
    <>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </CookiesProvider>
    </>
  )
}

function Root() {
  const { user } = useUser();
  const HomeComponent = user?.userType === 'business' ? BusinessHome : ClientHome;
  return (
    <div className="app">
      <div className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/user-type" element={<UserType />} />
          <Route element={<GuardedRoute />}>
            <Route path='/home' element={<HomeComponent />} />
            <Route path='/businesses-list' element={<BusinessesList />} />
            <Route path='/schedule' element={<MakeAppointment />} />
            <Route path='/businesses-location' element={<BusinessesLocation />} />
            <Route path='/businesses-name' element={<BusinessesName />} />
            <Route path='/appointments' element={<AppointmentsList />} />
            <Route path='/reschedule' element={<Reschedule />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

    </div>
  );
}


export default App
