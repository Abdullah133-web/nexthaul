// UpdateLoadStatus.js
import React from 'react';
import { supabase } from './supabaseClient';

function UpdateLoadStatus({ load, onUpdate }) {
  const updateStatus = async (newStatus) => {
    const { error } = await supabase
      .from('loads')
      .update({ status: newStatus })
      .eq('id', load.id);

    if (!error) {
      alert(`Status updated to "${newStatus}"`);
      onUpdate(); // refetch loads
    } else {
      alert('Failed to update status');
      console.error(error);
    }
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <strong>Status:</strong> {load.status}{' '}
      {load.status !== 'delivered' && (
        <>
          {load.status !== 'in_transit' && (
            <button onClick={() => updateStatus('in_transit')}>Start Transit</button>
          )}
          <button onClick={() => updateStatus('delivered')}>Mark Delivered</button>
        </>
      )}
    </div>
  );
}

export default UpdateLoadStatus;
