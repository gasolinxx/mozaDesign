import React, { useEffect, useState } from 'react';
import './Agent.css';

const Agent = () => {
  const [agents, setAgents] = useState([]);
  const [stateFilter, setStateFilter] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        setFilteredAgents(data);
      })
      .catch(err => console.error('Error fetching agents:', err));
  }, []);

  useEffect(() => {
    const filter = stateFilter.trim().toLowerCase();
    if (filter === '') {
      setFilteredAgents(agents);
    } else {
      setFilteredAgents(
        agents.filter(agent =>
          agent.state.toLowerCase().includes(filter)
        )
      );
    }
  }, [stateFilter, agents]);

  const formatWhatsAppLink = (phone) => {
    const digits = phone.replace(/\D/g, '');
    const formattedNumber = digits.startsWith('0') ? '60' + digits.slice(1) : digits;
    return `https://wa.me/${formattedNumber}`;
  };

  return (
    <div className="agent-container">
      <h1> Our Agents</h1>

     <div className="filter-container">
  <label htmlFor="state-search" className="filter-label">
    Search by State:&nbsp;
    <input
      type="text"
      id="state-search"
      placeholder="Type a state name..."
      value={stateFilter}
      onChange={e => setStateFilter(e.target.value)}
      className="filter-input"
    />
  </label>
</div>


      <table className="agent-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Agent Name</th>
            <th>State</th>
            <th>District</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent, idx) => (
              <tr key={agent.agent_id}>
                <td>{idx + 1}</td>
                <td>{agent.name}</td>
                <td>{agent.state}</td>
                <td>{agent.branch}</td>
                <td>
                  <a
                    href={formatWhatsAppLink(agent.phone_number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#007e33', fontWeight: '600', textDecoration: 'none' }}
                    title={`Chat with ${agent.name} on WhatsApp`}
                  >
                    {agent.phone_number}
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                No agents found for "{stateFilter}"
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Agent;
