import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Skinlib from './pages/Skinlib';
import Dashboard from './pages/Dashboard';
import DashboardDebug from './pages/DashboardDebug';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="skinlib" element={<Skinlib />} />
          <Route path="dash" element={<Dashboard />} />
          <Route path="dashdebug" element={<DashboardDebug />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="verifyemail" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
