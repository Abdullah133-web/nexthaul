import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function InviteForm({ brokerId }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('driver');
  const [link, setLink] = useState('');

  const handleInvite = async () => {
    if (!email) return;

    const { data, error } = await supabase.from('invites').insert([
      { email, role, invited_by: brokerId }
    ]);

    if (!error) {
      const url = `${window.location.origin}/signup?invited_by=${brokerId}&role=${role}`;
      setLink(url);
    }
  };

  return (
    <div>
      <h2>📨 Invite a Driver or Carrier</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter their email"
        style={{ padding: '8px' }}
      />
      <select value={role} onChange={e => setRole(e.target.value)} style={{ marginLeft: '10px', padding: '8px' }}>
        <option value="driver">Driver</option>
        <option value="carrier">Carrier</option>
      </select>
      <button onClick={handleInvite} style={{ marginLeft: '10px' }}>Send Invite</button>
      {link && (
        <div style={{ marginTop: '1rem' }}>
          ✅ Share this link: <br />
          <code>{link}</code>
        </div>
      )}
    </div>
  );
}

export default InviteForm;
