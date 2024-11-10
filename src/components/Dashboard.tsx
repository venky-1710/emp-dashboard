import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, LogOut, Users, Menu, X } from 'lucide-react';

interface Employee {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  gender: string;
  course: string;
  image: string;
}

const Dashboard = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await fetch(`http://localhost:5000/api/employees/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">
                Employee Dashboard
              </span>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center">
              <button
                onClick={() => navigate('/employee/new')}
                className="mr-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                navigate('/employee/new');
                setIsMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Add Employee
            </button>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((employee) => (
            <div
              key={employee._id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={`http://localhost:5000${employee.image}`}
                    alt={employee.name}
                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                  {employee.name}
                </h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-500">
                    <strong>Email:</strong> {employee.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Mobile:</strong> {employee.mobile}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Designation:</strong> {employee.designation}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Gender:</strong> {employee.gender}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Course:</strong> {employee.course}
                  </p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <button
                    onClick={() => navigate(`/employee/edit/${employee._id}`)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;