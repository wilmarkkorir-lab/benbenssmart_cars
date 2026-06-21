import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ConnectionTest() {
  const [status, setStatus] = useState('testing');
  const [message, setMessage] = useState('Testing AlwaysData connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔗 Testing AlwaysData connection...');
        
        const response = await api.get('cars/');
        console.log('✅ AlwaysData connection successful!', response.data);
        
        setStatus('success');
        setMessage(`✅ AlwaysData connected! Found ${response.data.length} cars.`);
        
      } catch (error) {
        console.error('❌ AlwaysData connection failed:', error);
        setStatus('error');
        
        if (error.code === 'ECONNABORTED') {
          setMessage('⏰ Connection timeout - Server is slow');
        } else if (error.message.includes('Network Error')) {
          setMessage('🌐 Network Error - Check internet');
        } else {
          setMessage(`❌ Connection failed: ${error.message}`);
        }
      }
    };

    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#27ae60';
      case 'error': return '#c0392b';
      default: return '#3498db';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '10px',
      background: '#fff',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      border: `2px solid ${getStatusColor()}`,
      zIndex: 1000,
      maxWidth: '280px',
      fontSize: '13px',
      fontWeight: '600',
      color: getStatusColor()
    }}>
      {message}
    </div>
  );
}