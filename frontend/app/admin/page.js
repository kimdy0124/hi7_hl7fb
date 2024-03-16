'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const { logOut } = UserAuth();
  const router = useRouter();
  const [loginHistory, setLoginHistory] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayContent, setDisplayContent] = useState(null); // State variable to track which content to display

  const fetchLoginHistory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login-history');
      if (!response.ok) {
        throw new Error('Failed to fetch login history');
      }
      const data = await response.json();
      setLoginHistory(data);
    } catch (error) {
      console.error('Failed to fetch login history:', error);
    }
  };

  const fetchActivityHistory = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/activity-history');
      if (!response.ok) {
        throw new Error('Failed to fetch activity history');
      }
      const data = await response.json();
      setActivityHistory(data);
    } catch (error) {
      console.error('Failed to fetch activity history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
    fetchActivityHistory();
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut(); 
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleDisplayLoginHistory = () => {
    setDisplayContent('loginHistory');
  };

  const handleDisplayActivityHistory = () => {
    setDisplayContent('activityHistory');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-400 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl">Admin Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-white-400 text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
          >
            Sign Out
          </button>
        </div>
      </header>
      <nav className="bg-gray-200 text-gray-800 py-2">
        <div className="container mx-auto px-4">
          <ul className="flex">
            <li className="mr-6">
              <button className={`hover:text-blue-500 focus:outline-none ${displayContent === 'loginHistory' ? 'text-blue-500' : 'text-gray-800'}`} onClick={handleDisplayLoginHistory}>Login History</button>
            </li>
            <li>
              <button className={`hover:text-blue-500 focus:outline-none ${displayContent === 'activityHistory' ? 'text-blue-500' : 'text-gray-800'}`} onClick={handleDisplayActivityHistory}>Activity History</button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mx-auto px-4 flex-grow flex justify-center items-center">
        {loading ? (
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.584 0-6.623-1.517-8.83-3.709z"></path>
            </svg>
            <span>Loading...</span>
          </div>
        ) : (
          displayContent === 'loginHistory' && (
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-center">Login History</h2>
              <ul>
                {loginHistory.map((item, index) => (
                  <li key={index} className="mb-2">{item.username} - {item.timestamp}</li>
                ))}
              </ul>
            </div>
          )
          || displayContent === 'activityHistory' && (
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg animate-fade-in">
              <h2 className="text-2xl font-bold mb-4 text-center">Activity History</h2>
              <ul>
                {activityHistory.map((item, index) => (
                  <li key={index} className="mb-2">{item.action} - {item.timestamp}</li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
      <footer className="bg-blue-400 text-white py-4">
      </footer>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

