// EditProfile.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function EditProfile({ userId, onProfileUpdated }) {
  const [profile, setProfile] = useState({
    llc_name: '',
    mc_dot: '',
    phone: '',
    profile_picture: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (userId) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
        .then(({ data, error }) => {
          if (data) setProfile(data);
        });
    }
  }, [userId]);

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpload = async () => {
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(`${userId}/profile-pic/${fileName}`, file, { upsert: true });

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      return;
    }

    const publicUrl = `https://lairuysrnpsuzylttgdm.supabase.co/storage/v1/object/public/documents/${userId}/profile-pic/${fileName}`;

    setProfile(prev => ({ ...prev, profile_picture: publicUrl }));
    return publicUrl;
  };

  const handleSubmit = async () => {
    const uploadedURL = file ? await handleUpload() : profile.profile_picture;

    const { error } = await supabase.from('profiles').update({
      llc_name: profile.llc_name,
      mc_dot: profile.mc_dot,
      phone: profile.phone,
      profile_picture: uploadedURL
    }).eq('id', userId);

    if (error) {
      alert('Update failed: ' + error.message);
    } else {
      alert('Profile updated!');
      onProfileUpdated && onProfileUpdated();
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <h2>Edit Profile</h2>

      {profile.profile_picture && (
        <img
          src={profile.profile_picture}
          alt="Profile"
          className="profile-pic"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '1rem',
          }}
        />
      )}

      <input
        name="llc_name"
        placeholder="LLC Name"
        value={profile.llc_name}
        onChange={handleChange}
      />
      <input
        name="mc_dot"
        placeholder="MC or DOT Number"
        value={profile.mc_dot}
        onChange={handleChange}
      />
      <input
        name="phone"
        placeholder="Phone"
        value={profile.phone}
        onChange={handleChange}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>
        💾 Save Changes
      </button>
    </div>
  );
}
