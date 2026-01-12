import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI } from '../services/api';
import './EmployeeList.css';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await employeeAPI.getAll(pageNumber, 10, department, searchTerm);
      setEmployees(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Error fetching employees: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  }, [pageNumber, department, searchTerm]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      } catch (error) {
        alert('Error deleting employee: ' + (error.message || error));
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/employee/${id}`);
  };

  const handleAddEmployee = () => {
    navigate('/employee');
  };
  
  return (
    <div className="employee-list">
      <div className="list-header">
        <h1>Employees</h1>
        {/* Button "Add" is visible for Admins */}
        {user?.role === 'Admin' && (
        <button onClick={handleAddEmployee} className="btn-add-employee">
          + Add Employee
        </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPageNumber(1);
          }}
        />
        <input
          type="text"
          placeholder="Filter by department..."
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setPageNumber(1);
          }}
        />
      </div>

      {/* Loading */}
      {loading && <p className="loading">Loading...</p>}

      {/* Employees Table */}
      {!loading && employees.length === 0 && <p className="no-data">No employees found</p>}

      {!loading && employees.length > 0 && (
        <>
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Salary</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.fullName}</td>
                  <td>{emp.email}</td>
                  <td>${emp.salary.toLocaleString()}</td>
                  <td>{emp.department || 'N/A'}</td>
                  <td>
                    {/* Edit / Delete buttons are visible for Admins*/}
                    {user?.role === 'Admin' ? (
                      <>
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(emp.id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <span className="role-badge">View</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button 
              onClick={() => setPageNumber(pageNumber - 1)} 
              disabled={pageNumber === 1}
            >
              Previous
            </button>
            <span>Page {pageNumber} of {totalPages}</span>
            <button 
              onClick={() => setPageNumber(pageNumber + 1)} 
              disabled={pageNumber === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default EmployeeList;
