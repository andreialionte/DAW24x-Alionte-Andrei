import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Mail, Lock } from 'lucide-react';
import { LoginAPI } from '../../services/AuthService';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters').min(1, 'Password is required'),
});

type FormData = z.infer<typeof formSchema>;

const LoginComponent = () => {
  const navigate = useNavigate(); // Correctly place useNavigate inside the component

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleLogin = async (data: FormData) => {
    try {
      const response = await LoginAPI(data); // Assuming LoginAPI handles login API request
      localStorage.setItem('Token', response); // Store the token
      navigate('/'); // Redirect to dashboard on successful login
      toast.success('Login successful! Welcome back.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(
        <div className="flex flex-col">
          <span className="font-bold">Login failed</span>
          <span className="text-sm">{errorMessage}</span>
        </div>,
        {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
        }
      );
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
              Welcome Back
            </h2>
            <p className="text-gray-300 text-center mb-8">
              Sign in to continue managing your expenses
            </p>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-center">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-gray-300 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className="w-full bg-gray-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-center">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="form-checkbox text-green-500 rounded bg-gray-900 border-gray-700" />
                  <span className="ml-2 text-gray-300">Remember me</span>
                </label>
                <a href="#" className="text-green-400 hover:text-green-300">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full group flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg 
                hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              >
                Sign In
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="mt-6 text-center text-gray-300">
              Don't have an account?{' '}
              <button className="text-green-400 hover:text-green-300">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default LoginComponent;
