import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    llc_name: '',
    mc_dot: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async () => {
    const { email, password, role, llc_name, mc_dot, phone } = formData;

    // Create account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      alert('Signup failed: ' + signUpError.message);
      return;
    }

    const user = signUpData.user;

    // Insert profile into SQL table
    const { error: insertError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        email,
        role,
        llc_name,
        mc_dot,
        phone
      }
    ]);

    if (insertError) {
      alert('Profile insert failed: ' + insertError.message);
      return;
    }

    alert('Signup successful!');
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>Sign Up</h2>
      
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} style={inputStyle} />
      <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} style={inputStyle} />
      
      <select name="role" value={formData.role} onChange={handleChange} style={inputStyle}>
        <option value="">Select Role</option>
        <option value="driver">Driver</option>
        <option value="broker">Broker</option>
        <option value="carrier">Carrier</option>
        <option value="fleet_owner">Fleet Owner</option>
        <option value="owner_operator">Owner Operator</option>
      </select>
      
      <input name="llc_name" placeholder="LLC Name" value={formData.llc_name} onChange={handleChange} style={inputStyle} />
      <input name="mc_dot" placeholder="MC or DOT Number" value={formData.mc_dot} onChange={handleChange} style={inputStyle} />
      <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={inputStyle} />

      <button onClick={handleSignup} style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>
        Sign Up
      </button>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  marginBottom: '0.75rem',
  padding: '0.5rem'
};
