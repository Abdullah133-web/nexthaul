import React, { useState } from 'react';

function FMCSAVerifier() {
  const [dotNumber, setDotNumber] = useState('');
  const [carrier, setCarrier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyCarrier = async () => {
    if (!dotNumber) return;

    setLoading(true);
    setCarrier(null);
    setError('');

    try {
      const response = await fetch(`https://fmcsaverify-backend-v2.onrender.com/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dotNumber }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError('Carrier not found or failed to verify.');
        setCarrier(null);
      } else {
        setCarrier({
          legal_name: data.legal_name,
          dot_number: dotNumber,
          operating_status: data.operating_status,
        });
      }
    } catch (err) {
      console.error('Error verifying carrier:', err);
      setError('Failed to connect to verification server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>🔎 FMCSA Carrier Verification</h3>
      <input
        type="text"
        placeholder="Enter DOT Number"
        value={dotNumber}
        onChange={(e) => setDotNumber(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '1rem', width: '200px' }}
      />
      <button onClick={verifyCarrier} style={{ padding: '0.5rem 1rem' }}>
        Verify
      </button>

      {loading && <p style={{ marginTop: '1rem' }}>Loading...</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {carrier && (
        <div
          style={{
            background: '#f0fdf4',
            padding: '1rem',
            marginTop: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #cceccc',
          }}
        >
          <strong>Legal Name:</strong> {carrier.legal_name}<br />
          <strong>DOT Number:</strong> {carrier.dot_number}<br />
          <strong>Operating Status:</strong>{' '}
          <span style={{ color: carrier.operating_status?.includes('AUTHORIZED') ? 'green' : 'red' }}>
            {carrier.operating_status}
          </span>
          <br />
          <div
            style={{
              marginTop: '10px',
              display: 'inline-block',
              background: '#c5f7cb',
              color: '#0b5f18',
              padding: '6px 12px',
              borderRadius: '5px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            ✅ FMCSA Verified
          </div>
        </div>
      )}
    </div>
  );
}

export default FMCSAVerifier;
