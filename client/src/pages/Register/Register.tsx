import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, User, Mail, Lock } from 'lucide-react';
import { RegisterAPI } from '../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Confirm password is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof formSchema>;

const RegisterForm = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const registerPromise = RegisterAPI({
        Email: data.email,
        FirstName: data.firstName,
        LastName: data.lastName,
        Password: data.password,
        ConfirmPassword: data.confirmPassword,
      });
  
      registerPromise.then((response) => {
        toast.success(
          <div className="flex flex-col">
            <span className="font-bold">Welcome aboard! 🎉</span>
            <span className="text-sm">Your account has been created successfully</span>
          </div>,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
          }
        );
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }).catch((err) => {
        const errorMessage = err?.response?.data?.message || 'Something went wrong. Please try again.';
        toast.error(
          <div className="flex flex-col">
            <span className="font-bold">Registration failed</span>
            <span className="text-sm">{errorMessage}</span>
          </div>,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
          }
        );
      });
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <h5 className="text-2xl font-bold text-green-400 tracking-wider">
            ExpenseFlow
          </h5>
        </div>
      </nav>

      <div className="flex-grow container mx-auto px-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/50 rounded-lg p-8 shadow-xl backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Create Account
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="firstName">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    {...register('firstName')}
                    type="text"
                    id="firstName"
                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    {...register('lastName')}
                    type="text"
                    id="lastName"
                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    {...register('password')}
                    type="password"
                    id="password"
                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Create a password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    id="confirmPassword"
                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Confirm your password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full group flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg 
                hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Create Account
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Add ToastContainer here to display the toasts */}
      <ToastContainer />
    </div>
  );
};

export default RegisterForm;