import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function AdminDashboard({ handleLogout, user }) {
  const [users, setUsers] = useState([]);
  const [loads, setLoads] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();

    const userSubscription = supabase
      .channel('users-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(userSubscription);
    };
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
useEffect(() => {
  const userChannel = supabase
    .channel('public:users')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'users' },
      (payload) => {
        console.log('User table change:', payload);
        fetchData(); // refreshes UI
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(userChannel);
  };
}, []);

  const fetchData = async () => {
    const { data: userData } = await supabase.rpc('get_all_users');
    if (userData) setUsers(userData);

    const { data: loadData } = await supabase.from('loads').select('*');
    if (loadData) setLoads(loadData);

    const { data: docs } = await supabase.storage.from('documents').list('', { limit: 1000 });
    if (docs) setDocuments(docs || []);

    const { data: annData } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (annData) setAnnouncements(annData);
  };

  const handleDeleteLoad = async (id) => {
    const { error } = await supabase.from('loads').delete().eq('id', id);
    if (!error) setLoads(loads.filter((l) => l.id !== id));
  };

  const handlePostAnnouncement = async () => {
    if (!announcement.trim()) return;
    const { error } = await supabase.from('announcements').insert({ message: announcement });
    if (!error) {
      setAnnouncement('');
      fetchData();
    }
  };

  const togglePaymentStatus = async (load) => {
    const newStatus = load.payment_status === 'paid' ? 'unpaid' : 'paid';
    const { error } = await supabase.from('loads').update({ payment_status: newStatus }).eq('id', load.id);
    if (!error) {
      setLoads(prev =>
        prev.map(l => l.id === load.id ? { ...l, payment_status: newStatus } : l)
      );
    }
  };

  const generatePDF = (load) => {
    const doc = new jsPDF();
    doc.text("Invoice", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Field', 'Value']],
      body: [
        ['Load ID', load.id],
        ['Pickup', load.pickup_location],
        ['Dropoff', load.dropoff_location],
        ['Rate', `$${load.rate}`],
        ['Weight', `${load.weight} lbs`],
        ['Trailer Type', load.trailer_type],
        ['Status', load.status],
        ['Payment Status', load.payment_status],
      ]
    });
    doc.save(`Invoice_Load_${load.id}.pdf`);
  };

  const filterLoadsByDate = () => {
    let result = [...loads];
    if (startDate && endDate) {
      result = result.filter((l) => {
        const created = new Date(l.created_at);
        return created >= new Date(startDate) && created <= new Date(endDate);
      });
    }
    if (paymentFilter !== 'all') {
      result = result.filter((l) => l.payment_status === paymentFilter);
    }
    return result;
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLoads = filterLoadsByDate();
  const totalRevenue = filteredLoads.reduce((sum, l) => sum + parseFloat(l.rate || 0), 0);
  const deliveredRevenue = filteredLoads.filter(l => l.status === 'delivered').reduce((sum, l) => sum + parseFloat(l.rate || 0), 0);
  const pendingRevenue = totalRevenue - deliveredRevenue;

  const overdueLoads = loads.filter((l) => l.payment_status === 'unpaid' && new Date(l.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const categoryRevenue = {};
  filteredLoads.forEach((l) => {
    const type = l.trailer_type || 'unknown';
    const rate = parseFloat(l.rate || 0);
    categoryRevenue[type] = (categoryRevenue[type] || 0) + rate;
  });

  const pieData = Object.entries(categoryRevenue).map(([type, value]) => ({ name: type, value }));

  const chartData = filteredLoads.map((l) => ({
    date: new Date(l.created_at).toLocaleDateString(),
    rate: parseFloat(l.rate || 0),
  }));

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ height: '40px' }} />
        <div>
          <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ marginLeft: '1rem' }}>🔙 Back to Dashboard</button>
          <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>🚪 Logout</button>
        </div>
      </header>

      <h1>🛠️ Admin Dashboard</h1>

      <section>
        <h3>📅 Filter Revenue by Date</h3>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <h3>💸 Filter Loads by Payment Status</h3>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </select>
      </section>

      <section>
        <h2>🔎 Search Users</h2>
        <input
          type="text"
          placeholder="Search by email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
      </section>

      <section>
        <h2>👥 All Users</h2>
        <ul>
          {filteredUsers.map(user => (
            <li key={user.id}>{user.email} – Role: {user.role || 'unknown'}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;
