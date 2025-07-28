// CreateLoad.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function CreateLoad({ user }) {
  const [form, setForm] = useState({
    pickup_location: '',
    dropoff_location: '',
    rate: '',
    weight: '',
    trailer_type: '',
    trailer_length: '',
    distance: '',
    pickup_address: '',
    dropoff_address: '',
    driver_id: '',
  });

  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('id, name');
      if (!error) setDrivers(data);
    };
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('loads').insert([
      {
        ...form,
        created_by: user.email,
        status: 'pending',
      },
    ]);
    if (error) {
      alert('Failed to create load');
      console.error(error);
    } else {
      alert('Load created!');
      setForm({
        pickup_location: '',
        dropoff_location: '',
        rate: '',
        weight: '',
        trailer_type: '',
        trailer_length: '',
        distance: '',
        pickup_address: '',
        dropoff_address: '',
        driver_id: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem', marginTop: '2rem', border: '1px solid #ddd' }}>
      <h2>Create Load</h2>
      {[
        'pickup_location',
        'dropoff_location',
        'rate',
        'weight',
        'trailer_type',
        'trailer_length',
        'distance',
        'pickup_address',
        'dropoff_address',
      ].map((field) => (
        <div key={field}>
          <label>{field.replace(/_/g, ' ')}:</label>
          <input
            name={field}
            value={form[field]}
            onChange={handleChange}
            required
            style={{ display: 'block', marginBottom: '1rem', width: '100%', padding: '8px' }}
          />
        </div>
      ))}
      <div>
        <label>Assign Driver:</label>
        <select
          name="driver_id"
          value={form.driver_id}
          onChange={handleChange}
          required
          style={{ display: 'block', marginBottom: '1rem', padding: '8px', width: '100%' }}
        >
          <option value="">Select a Driver</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" style={{ padding: '10px 20px' }}>Create Load</button>
    </form>
  );
}

export default CreateLoad;
