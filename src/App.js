import React, { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import CreateLoad from './CreateLoad';
import DocumentUpload from './documentupload';
import UpdateLoadStatus from './updateLoadStatus';
import FMCSAVerifier from './FMCSAVerifier';
import LandingPage from './pages/LandingPage';

import AdminDashboard from './AdminDashboard';
import Signup from './Signup';
import EditProfile from './EditProfile';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ContactUs from './pages/ContactUs';
import AdminMessages from './pages/AdminMessages';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadowUrl, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const ProtectedRoute = ({ user, role, allowedRoles, children }) => {
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
};

function AppWrapper() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('unknown');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [driverIncome, setDriverIncome] = useState(0);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [userProfile, setUserProfile] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  const navigate = useNavigate();
  const defaultCenter = [39.8283, -98.5795];

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const userRole = data.user.user_metadata?.role || 'unknown';
        setUser(data.user);
        setRole(userRole);
        fetchAll(data.user);
        fetchUserProfile(data.user.id);
      }
      setSessionChecked(true);
    };
    checkSession();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const fetchAll = (user) => {
    fetchLoads(user);
    fetchDrivers();
    fetchDocuments(user);
  };

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error) setUserProfile(data);
  };

  const fetchLoads = async (user) => {
    const { data } = await supabase.from('loads').select('*').eq('assigned_to', user.email);
    if (data) {
      setLoads(data || []);
      if (role === 'driver') {
        const income = data.filter(l => l.status === 'delivered')
          .reduce((sum, l) => sum + parseFloat(l.rate || 0), 0);
        setDriverIncome(income);
      }
    }
  };

  const fetchDrivers = async () => {
    const { data } = await supabase.from('drivers').select('*');
    if (data) setDrivers(data || []);
  };

  const fetchDocuments = async (user) => {
    const { data } = await supabase.storage.from('documents').list(user.id + '/', { limit: 100 });
    if (data) setDocuments(data || []);
  };

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert('Login failed!');
    setUser(data.user);
    const userRole = data.user?.user_metadata?.role || 'unknown';
    setRole(userRole);
    fetchAll(data.user);
    fetchUserProfile(data.user.id);
    navigate(userRole === 'admin' ? '/admin' : '/dashboard');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole('unknown');
    setLoads([]);
    setDrivers([]);
    setDocuments([]);
    setDriverIncome(0);
    setUserProfile(null);
    navigate('/');
  };

  const getPublicURL = (fileName) =>
    `https://lairuysrnpsuzylttgdm.supabase.co/storage/v1/object/public/documents/${user.id}/${fileName}`;

  const LoginComponent = (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>Login to NextHaul</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />
      <button onClick={handleLogin} style={{ width: '100%', padding: '0.5rem' }}>
        Login
      </button>
    </div>
  );

  const UserDashboard = (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`} style={{ padding: '1rem' }}>
      <button onClick={() => setDarkMode(!darkMode)} style={{ float: 'right' }}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <h1>Welcome to NextHaul, {user?.email}</h1>
      <p><strong>Role:</strong> {role}</p>
      <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>Logout</button>

      {userProfile && (
        <div style={{ marginBottom: '2rem' }}>
          <h2>Your Profile</h2>
          <p><strong>LLC Name:</strong> {userProfile.llc_name}</p>
          <p><strong>MC/DOT:</strong> {userProfile.mc_dot}</p>
          <p><strong>Phone:</strong> {userProfile.phone}</p>
        </div>
      )}

      {role === 'driver' && (
        <>
          <h2>Your Earnings</h2>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${driverIncome.toLocaleString()}</p>
        </>
      )}

      {role === 'broker' && (
        <>
          <h2>Drivers List</h2>
          <ul>{drivers.map(d => <li key={d.id}>{d.name} - {d.email}</li>)}</ul>

          <h2>Create New Load</h2>
          <CreateLoad user={user} />

          <h2>Upload Compliance Documents</h2>
          <DocumentUpload user={user} />

          <h2>Your Uploaded Documents</h2>
          {documents.length === 0 ? (
            <p>No documents uploaded yet.</p>
          ) : (
            <ul>
              {documents.map(doc => (
                <li key={doc.name}>
                  <a href={getPublicURL(doc.name)} target="_blank" rel="noopener noreferrer">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <h2>Assigned Loads</h2>
      <ul>
        {loads.map(l => (
          <li key={l.id} style={{ marginBottom: '1rem' }}>
            <strong>{l.pickup_location} → {l.dropoff_location}</strong><br />
            Rate: ${l.rate} | Weight: {l.weight} lbs<br />
            Status: <span style={{ color: l.status === 'delivered' ? 'green' : 'orange' }}>{l.status}</span>
            {role === 'broker' && (
              <UpdateLoadStatus
                loadId={l.id}
                currentStatus={l.status}
                onStatusUpdated={() => fetchLoads(user)}
              />
            )}
          </li>
        ))}
      </ul>

      <MapContainer center={defaultCenter} zoom={4} style={{ height: '400px', width: '100%', marginTop: '2rem' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {loads.map(load => load.pickup_lat && load.pickup_lng && (
          <Marker key={load.id} position={[load.pickup_lat, load.pickup_lng]}>
            <Popup>
              Pickup: {load.pickup_location} <br />
              Dropoff: {load.dropoff_location}<br />
              Status: {load.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <FMCSAVerifier />
    </div>
  );

  if (!sessionChecked) return null;

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms/>} />
      <Route path="/login" element={LoginComponent} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute user={user} role={role} allowedRoles={['admin']}>
            <AdminDashboard handleLogout={handleLogout} user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} role={role} allowedRoles={['driver', 'broker']}>
            {UserDashboard}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
