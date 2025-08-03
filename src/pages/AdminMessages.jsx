import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './AdminMessages.css';

const AdminMessages = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Load messages + subscribe to realtime
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMessages();

      const subscription = supabase
        .channel('realtime-messages')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'contact_submissions' },
          (payload) => {
            const newMessage = payload.new;
            setMessages((prev) => [newMessage, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  // Filter search
  useEffect(() => {
    const lower = search.toLowerCase();
    const filteredMsgs = messages.filter(
      (m) =>
        m.role.toLowerCase().includes(lower) ||
        m.email.toLowerCase().includes(lower) ||
        m.llc.toLowerCase().includes(lower)
    );
    setFiltered(filteredMsgs);
  }, [search, messages]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setMessages(data);
    setLoading(false);
  };

  const markAsRead = async (id) => {
    await supabase
      .from('contact_submissions')
      .update({ is_read: true })
      .eq('id', id);
    fetchMessages();
  };

  if (user?.role !== 'admin') {
    return (
      <div className="admin-messages-container">
        <h2>Access Denied</h2>
      </div>
    );
  }

  return (
    <div className="admin-messages-container">
      <h1>📨 Inbox</h1>

      <input
        className="search-input"
        type="text"
        placeholder="Search by role, email, or LLC"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="loading">Loading messages...</p>
      ) : filtered.length === 0 ? (
        <p className="no-messages">No messages found.</p>
      ) : (
        <div className="message-list">
          {filtered.map((msg) => (
            <div key={msg.id} className={`message-card ${msg.is_read ? 'read' : 'unread'}`}>
              <p><strong>🧑 Role:</strong> {msg.role}</p>
              <p><strong>🏢 LLC:</strong> {msg.llc}</p>
              <p><strong>📧 Email:</strong> {msg.email}</p>
              <p><strong>📞 Phone:</strong> {msg.phone}</p>
              <p><strong>✉️ Message:</strong> {msg.message}</p>
              <p className="timestamp">📅 {new Date(msg.created_at).toLocaleString()}</p>

              <div className="message-actions">
                {!msg.is_read && (
                  <button className="read-btn" onClick={() => markAsRead(msg.id)}>
                    ✅ Mark as Read
                  </button>
                )}
                <a
                  className="reply-btn"
                  href={`mailto:${msg.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ✉️ Reply
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer with support email */}
      <footer style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#666' }}>
        📧 Contact support: <a href="mailto:support@nexthaul.net">support@nexthaul.net</a>
      </footer>
    </div>
  );
};

export default AdminMessages;
