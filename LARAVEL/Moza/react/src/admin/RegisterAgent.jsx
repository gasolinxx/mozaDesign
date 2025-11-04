import React, { useState, useEffect } from 'react';
import './RegisterAgent.css';

const Agent = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [existingAgent, setExistingAgent] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [agentId, setAgentId] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [branch, setBranch] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const stateList = [
    'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
    'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak',
    'Selangor', 'Terengganu', 'Kuala Lumpur', 'Labuan', 'Putrajaya'
  ];

  const generateAgentId = () => {
    const randomSix = Math.floor(100000 + Math.random() * 900000);
    setAgentId(`AG${randomSix}`);
  };

  const handleSearchEmail = async () => {
    setSearchLoading(true);
    setSearchError('');
    setFoundUser(null);
    setExistingAgent(null);
    setSubmitStatus('');
    generateAgentId();
    setPhoneNumber('');
    setBranch('');
    setSelectedState('');

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/check-user-by-email?email=${encodeURIComponent(searchEmail)}`);
      if (!res.ok) {
        setSearchError('User not found');
        return;
      }

    const data = await res.json();
    setFoundUser(data.user);


    setPhoneNumber(data.user.phone_number || '');

    // Check if this user is already an agent
    const agentRes = await fetch(`http://127.0.0.1:8000/api/agents`);
    const allAgents = await agentRes.json();
    const matchAgent = allAgents.find(a => a.email === data.user.email);

    if (matchAgent) {
      setExistingAgent(matchAgent);
      setAgentId(matchAgent.agent_id);
      setPhoneNumber(matchAgent.phone_number); // override with agent phone
      setBranch(matchAgent.branch);
      setSelectedState(matchAgent.state);
    }

    } catch (err) {
      setSearchError('Something went wrong');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!foundUser || !selectedState || !branch || !agentId || !phoneNumber) {
      setSubmitStatus('Please complete all fields');
      return;
    }

    try {
      const payload = {
        agent_id: agentId,
        name: foundUser.name,
        email: foundUser.email,
        phone_number: phoneNumber,
        state: selectedState,
        branch: branch,
      };

      const url = existingAgent
        ? `http://127.0.0.1:8000/api/agents/${existingAgent.agent_id}`
        : `http://127.0.0.1:8000/api/agents`;

      const method = existingAgent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to save agent');
      }

      setSubmitStatus(existingAgent ? 'Agent updated successfully!' : 'Agent registered successfully!');
      setFoundUser(null);
      setSearchEmail('');
      setSelectedState('');
      setBranch('');
      setPhoneNumber('');
      fetchAgents();
    } catch (error) {
      setSubmitStatus(error.message);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/agents');
      const data = await res.json();
      setAgents(data);
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div>
      {/* Register/Update Agent Form */}
      <div className="register-agent">
        <h3>{existingAgent ? 'Update Agent' : 'Register New Agent'}</h3>

        <div className="form-group">
          <label>Email:</label>
          <div className="search-row">
            <input
              type="email"
              placeholder="Enter email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              disabled={!!foundUser}
            />
            <button onClick={handleSearchEmail} disabled={searchLoading || !!foundUser}>
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {searchError && <p className="status-msg error">{searchError}</p>}
        </div>

        {foundUser && (
          <div className="agent-details">
            <p><strong>Name:</strong> {foundUser.name}</p>
            <p><strong>Email:</strong> {foundUser.email}</p>
            <p><strong>Usertype:</strong> {foundUser.usertype}</p>

            <div className="form-group">
              <label>Phone Number:</label>
              <input
              type="text"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            </div>

            <div className="form-group">
              <label>Agent ID:</label>
              <input type="text" value={agentId} readOnly />
            </div>

            <div className="form-group">
              <label>State:</label>
              <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                <option value="">-- Select State --</option>
                {stateList.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Branch:</label>
              <input
                type="text"
                placeholder="Enter branch name"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>

            <button className="submit-btn" onClick={handleSubmit}>
              {existingAgent ? 'Update Agent' : 'Register Agent'}
            </button>

            {submitStatus && (
              <p className={`status-msg ${submitStatus.includes('success') ? 'success' : 'error'}`}>
                {submitStatus}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Agent List */}
      <h3 style={{ marginTop: '40px' }}>Agent List</h3>
      {loadingAgents ? (
        <p>Loading agents...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
          <thead>
            <tr style={{ backgroundColor: '#0b4569ff', textAlign: 'left' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Agent ID</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Phone</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>State</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Branch</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.agent_id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{agent.agent_id}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{agent.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{agent.email || '-'}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{agent.phone_number}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{agent.state}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{agent.branch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Agent;
