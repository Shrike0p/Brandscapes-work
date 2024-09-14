// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function App() {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ firstName: '', lastName: '', position: '', department: '' });
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchEmployees();
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmployees(response.data);
    } catch (error) {
      alert('Failed to fetch employees: ' + error.response?.data?.message || error.message);
    }
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post('http://localhost:5000/employees', newEmployee, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewEmployee({ firstName: '', lastName: '', position: '', department: '' });
      fetchEmployees();
    } catch (error) {
      alert('Failed to add employee: ' + error.response?.data?.message || error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search?q=${search}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEmployees(response.data);
    } catch (error) {
      alert('Failed to search employees: ' + error.response?.data?.message || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h1>Employee Management</h1>

      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <h2>Add New Employee</h2>
      <input
        type="text"
        placeholder="First Name"
        value={newEmployee.firstName}
        onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={newEmployee.lastName}
        onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
      />
      <input
        type="text"
        placeholder="Position"
        value={newEmployee.position}
        onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
      />
      <input
        type="text"
        placeholder="Department"
        value={newEmployee.department}
        onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
      />
      <button onClick={handleAddEmployee}>Add</button>

      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Position</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.firstName}</td>
              <td>{emp.lastName}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
