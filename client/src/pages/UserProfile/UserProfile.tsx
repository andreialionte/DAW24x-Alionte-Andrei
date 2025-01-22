import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Calendar, MapPin, 
  Edit3, Key, LogOut, ChevronLeft
} from 'lucide-react';
import axios from 'axios';
import { API_CONFIG } from '../../configs/ApiConfig';
import { DecodeJWT } from '../../utils/DecodeJWT';
import { GetUserAPI } from '../../services/UserService';
import { use } from 'react';
import { User } from '../../Interfaces/User';

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('Token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userId = DecodeJWT(token).userId;
        const response = await GetUserAPI(userId);
        setUser(response);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(new Error('Failed to load user data'));
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('Token');
    navigate('/login');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <button 
        onClick={handleBackToDashboard}
        className="flex items-center text-gray-400 hover:text-white mb-6"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-green-500 to-blue-500 rounded-t-lg">
            <div className="absolute -bottom-16 left-6">
              <div className="w-32 h-32 bg-gray-800 rounded-full p-1">
                <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 p-6">
            {/* Basic Info */}
            <div className="flex justify-between items-start mb-6">
              {/* <div>
                <h1 className="text-2xl font-bold text-white">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-400">Member since {new Date(user?.dateCreated).toLocaleDateString()}</p>
              </div> */}
              <div className="space-x-4">
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{user?.email}</span>
                </div>
                {/* <div className="flex items-center text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{user?.|| 'Not provided'}</span>
                </div> */}
              </div>
              <div className="space-y-4">
                {/* <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {new Date(user?.dateCreated).toLocaleDateString()}</span>
                </div> */}
                {/* <div className="flex items-center text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{user?.location || 'Not provided'}</span>
                </div> */}
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;