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
import Home from './pages/Home';
import GuardedRoute from './guards/GuardedRoute';


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
          <Route path='/home' element={<GuardedRoute/>}>
            <Route path='/home' element={<Home/>}/>
          </Route>
        </Routes>
      </div>

    </div>
  );
}


export default App
