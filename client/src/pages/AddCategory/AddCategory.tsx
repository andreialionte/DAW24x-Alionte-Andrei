import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Plus,
  FileText,
  Check,
  Tag
} from 'lucide-react';
import { CreateCategory } from '../../services/CategoryService';
import { DecodeJWT } from '../../utils/DecodeJWT';
import { Category } from '../../Interfaces/Category';

const AddCategory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const token = localStorage.getItem('Token') || '';
  const userId = DecodeJWT(token).userId;

  // Initialize form data based on Category interface
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    userId: userId,
    expenses: [],
    recurringExpenses: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await CreateCategory(formData, userId);
      setSuccess(true);
      setTimeout(() => {
        navigate('/categories');
      }, 2000);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(`Category ${err.response.data.message}`);
      } else {
        setError('Failed to create category. Please try again.');
      }
      console.error('Create category error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white mr-4"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-green-400">Add Category</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center text-red-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center text-green-400">
            <Check className="w-5 h-5 mr-2" />
            Category created successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center mb-1">
                <Tag className="w-4 h-4 mr-2" />
                Category Name
              </div>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="e.g., Groceries, Entertainment, etc."
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center mb-1">
                <FileText className="w-4 h-4 mr-2" />
                Description
              </div>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Add a description for this category..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-colors ${
              loading || success
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? (
              'Creating...'
            ) : success ? (
              <>
                <Check className="w-5 h-5" />
                Created!
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Create Category
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;