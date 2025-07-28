// Signup.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useSearchParams } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState('driver'); // default role
  const [referrer, setReferrer] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const r = searchParams.get('ref');
    const ro = searchParams.get('role');
    if (r) setReferrer(r);
    if (ro) setRole(ro);
  }, [searchParams]);

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          referred_by: referrer,
        },
      },
    });
    if (error) return alert(error.message);
    setSuccess(true);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>Create Account</h2>
      {referrer && <p>You're joining with referral from: <strong>{referrer}</strong></p>}
      <input
        type="email"
        placeholder="Email"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup} style={{ width: '100%', padding: '0.5rem' }}>
        Sign Up
      </button>
      {success && <p style={{ color: 'green', marginTop: '1rem' }}>Signup successful! Check your email to confirm.</p>}
    </div>
  );
}
