import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loads, setLoads] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
      <button onClick={() => setDarkMode(!darkMode)} className="toggle-btn">Toggle {darkMode ? 'Light' : 'Dark'} Mode</button>
      <h1>🛠️ Admin Dashboard</h1>

      {/* Filters */}
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

      {/* Overdue Loads */}
      {overdueLoads.length > 0 && (
        <section className="overdue">
          <h3>⚠️ Overdue Loads (Unpaid > 7 days)</h3>
          <ul>
            {overdueLoads.map((l) => (
              <li key={l.id}>{l.pickup_location} → {l.dropoff_location} | {new Date(l.created_at).toLocaleDateString()}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Stats */}
      <section>
        <h2>📊 Platform Stats</h2>
        <p><strong>Total Users:</strong> {users.length}</p>
        <p><strong>Total Loads:</strong> {loads.length}</p>
        <p><strong>Delivered Loads:</strong> {loads.filter(l => l.status === 'delivered').length}</p>
        <p><strong>Total Revenue:</strong> ${totalRevenue.toLocaleString()}</p>
        <p><strong>Delivered Revenue:</strong> ${deliveredRevenue.toLocaleString()}</p>
        <p><strong>Pending Revenue:</strong> ${pendingRevenue.toLocaleString()}</p>
      </section>

      {/* Announcement */}
      <section>
        <h2>📣 Broadcast Announcement</h2>
        <input type="text" value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="Enter message..." />
        <button onClick={handlePostAnnouncement}>Send</button>
        <ul>
          {announcements.map((a) => (
            <li key={a.id}>{new Date(a.created_at).toLocaleString()}: {a.message}</li>
          ))}
        </ul>
      </section>

      {/* Revenue Charts */}
      <section>
        <h2>💰 Revenue by Trailer Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h2>📈 Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="rate" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Users */}
      <section>
        <h2>👥 All Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.email} – Role: {user.role || 'unknown'}</li>
          ))}
        </ul>
      </section>

      {/* Loads */}
      <section>
        <h2>📦 All Loads</h2>
        {filteredLoads.length === 0 ? <p>No loads available.</p> : (
          <ul>
            {filteredLoads.map(load => (
              <li key={load.id}>
                {load.pickup_location} → {load.dropoff_location} (${load.rate}) –
                <strong> {load.payment_status === 'paid' ? '✅ Paid' : '❌ Unpaid'}</strong>
                <button onClick={() => togglePaymentStatus(load)}>Toggle</button>
                <button onClick={() => handleDeleteLoad(load.id)}>❌ Delete</button>
                <button onClick={() => generatePDF(load)}>📄 PDF</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Documents */}
      <section>
        <h2>📁 All Documents</h2>
        {documents.length === 0 ? <p>No documents found.</p> : (
          <ul>
            {documents.map((doc) => (
              <li key={doc.name}>
                <a href={`https://lairuysrnpsuzylttgdm.supabase.co/storage/v1/object/public/documents/${doc.name}`} target="_blank" rel="noreferrer">{doc.name}</a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer>
        <p>Built by Nexthaul Team © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default AdminDashboard;
