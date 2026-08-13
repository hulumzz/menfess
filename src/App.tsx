import { Routes, Route } from 'react-router';
import Home from './pages/Home';
import Success from './pages/Success';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import MenfessDetail from './pages/admin/MenfessDetail';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] font-body text-[#171717] antialiased">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/menfess/:id" element={<MenfessDetail />} />
      </Routes>
    </div>
  );
}
