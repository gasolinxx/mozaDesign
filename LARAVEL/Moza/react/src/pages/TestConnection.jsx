import { useEffect, useState } from 'react';

const TestConnection = () => {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/test-connection')
     .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => setResponse(data.message))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h2>API Connection Test</h2>
      {response && <p>{response}</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
    </div>
  );
};

export default TestConnection;