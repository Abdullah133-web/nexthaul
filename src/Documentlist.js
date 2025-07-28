// DocumentList.js
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function DocumentList({ user }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase.storage
        .from('documents')
        .list(user.id + '/', { limit: 100, offset: 0 });

      if (!error) setFiles(data);
    };
    fetchFiles();
  }, [user]);

  const getPublicUrl = (fileName) => {
    return supabase.storage
      .from('documents')
      .getPublicUrl(`${user.id}/${fileName}`).data.publicUrl;
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Uploaded Documents</h3>
      <ul>
        {files.map(file => (
          <li key={file.name}>
            <a href={getPublicUrl(file.name)} target="_blank" rel="noreferrer">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentList;
