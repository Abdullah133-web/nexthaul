import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function DocumentUpload({ user }) {
  const [docType, setDocType] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !docType) return alert('Select file and document type');

    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${docType}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('compliance-docs')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return alert('Upload failed');
    }

    const { error: dbError } = await supabase.from('documents').insert({
      user_id: user.id,
      doc_type: docType,
      file_path: filePath,
    });

    if (dbError) {
      console.error(dbError);
      return alert('Metadata save failed');
    }

    alert('Document uploaded!');
    setDocType('');
    setFile(null);
  };

  return (
    <form onSubmit={handleUpload} style={{ marginTop: '2rem', border: '1px solid #ccc', padding: '1rem' }}>
      <h3>Upload Compliance Document</h3>
      <label>Document Type:</label>
      <select
        value={docType}
        onChange={(e) => setDocType(e.target.value)}
        required
        style={{ display: 'block', marginBottom: '1rem' }}
      >
        <option value="">--Select Type--</option>
        <option value="mc">MC Authority</option>
        <option value="insurance">Insurance</option>
        <option value="cdl">CDL License</option>
      </select>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        required
        style={{ marginBottom: '1rem' }}
      />

      <button type="submit">Upload</button>
    </form>
  );
}

export default DocumentUpload;
