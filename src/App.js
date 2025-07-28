import React, { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import CreateLoad from './CreateLoad';
import DocumentUpload from './documentupload';
import UpdateLoadStatus from './updateLoadStatus';
import FMCSAVerifier from './FMCSAVerifier';
import LandingPage from './LandingPage';
import AdminDashboard from './AdminDashboard';
import Signup from './Signup';
import {
  MapContainer, TileLayer, Marker, Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

let DefaultIcon = L.icon({ iconUrl, shadowUrl: iconShadowUrl, iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupMode, setSignupMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('unknown');
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [driverIncome, setDriverIncome] = useState(0);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const defaultCenter = [39.8283, -98.5795];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        const userRole = user?.user_metadata?.role || user?.role || 'unknown';
        setRole(userRole);
        fetchAll(user);
      }
    });
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

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert('Login failed!');
    setUser(data.user);
    const userRole = data.user?.user_metadata?.role || data.user?.role || 'unknown';
    setRole(userRole);
    fetchAll(data.user);
  };

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'driver' } },
    });
    if (error) return alert('Signup failed!');
    alert('Signup successful!');
    setSignupMode(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole('unknown');
    setLoads([]);
    setDrivers([]);
    setDocuments([]);
    setDriverIncome(0);
    setShowLogin(false);
  };

  const fetchLoads = async (user) => {
    const { data, error } = await supabase.from('loads').select('*').eq('assigned_to', user.email);
    if (!error) {
      setLoads(data || []);
      if (role === 'driver') {
        const income = (data || []).filter(l => l.status === 'delivered').reduce((sum, l) => sum + parseFloat(l.rate || 0), 0);
        setDriverIncome(income);
      }
    }
  };

  const fetchDrivers = async () => {
    const { data, error } = await supabase.from('drivers').select('*');
    if (!error) setDrivers(data || []);
  };

  const fetchDocuments = async (user) => {
    const { data, error } = await supabase.storage.from('documents').list(user.id + '/', { limit: 100 });
    if (!error) setDocuments(data || []);
  };

  const getPublicURL = (fileName) =>
    `https://lairuysrnpsuzylttgdm.supabase.co/storage/v1/object/public/documents/${user.id}/${fileName}`;

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            !user && !showLogin ? (
              <LandingPage onStart={() => setShowLogin(true)} />
            ) : user && role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <div className={`container ${darkMode ? 'dark-mode' : ''}`} style={{ padding: '1rem', maxWidth: '100%' }}>
                <button onClick={() => setDarkMode(!darkMode)} style={{ float: 'right' }}>
                  Toggle {darkMode ? 'Light' : 'Dark'} Mode
                </button>

                {!user ? (
                  <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
                    <h2 style={{ textAlign: 'center' }}>{signupMode ? 'Sign Up' : 'Login'} to Nexthaul</h2>
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
                    <button
                      onClick={signupMode ? handleSignup : handleLogin}
                      style={{ width: '100%', padding: '0.5rem' }}
                    >
                      {signupMode ? 'Sign Up' : 'Login'}
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                      {signupMode ? 'Already have an account?' : 'Don’t have an account?'}{' '}
                      <span onClick={() => setSignupMode(!signupMode)} style={{ color: 'blue', cursor: 'pointer' }}>
                        {signupMode ? 'Login' : 'Sign Up'}
                      </span>
                    </p>
                  </div>
                ) : (
                  <>
                    <h1>Welcome to Nexthaul, {user.email}</h1>
                    <p><strong>Role:</strong> {role}</p>
                    <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>Logout</button>

                    {role === 'driver' && (
                      <>
                        <h2>Your Earnings</h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${driverIncome.toLocaleString()}</p>
                      </>
                    )}

                    {role === 'broker' && (
                      <>
                        <h2>Drivers List</h2>
                        <ul>
                          {drivers.map(d => <li key={d.id}>{d.name} - {d.email}</li>)}
                        </ul>

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

                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1.5rem' }}>
                      *Nexthaul is not affiliated with or endorsed by the Federal Motor Carrier Safety Administration (FMCSA).
                    </p>
                  </>
                )}
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
