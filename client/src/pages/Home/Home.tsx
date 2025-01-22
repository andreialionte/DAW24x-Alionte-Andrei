import React, { useState, useEffect } from 'react';
import { ChevronRight, CheckCircle, BarChart2, Wallet, Shield, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [typedText, setTypedText] = useState('');
  const phrases = [
    'Manage Your Expense Easily', 
    'Track Finances with Precision', 
    'Simplify Financial Management'
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    const phrase = phrases[currentPhraseIndex];
    let timeout: any;

    if (!isDeleting && typedText.length < phrase.length) {
      // Typing
      timeout = setTimeout(() => {
        setTypedText(phrase.slice(0, typedText.length + 1));
      }, 50);
    } else if (isDeleting && typedText.length > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setTypedText(typedText.slice(0, -1));
      }, 30);
    } else if (!isDeleting && typedText.length === phrase.length) {
      // Pause at full phrase
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
    } else if (isDeleting && typedText.length === 0) {
      // Move to next phrase
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentPhraseIndex]);

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h5 className="text-2xl font-bold text-green-400 tracking-wider">
              ExpenseFlow
            </h5>
          </div>
          {/* <div className="flex gap-6">
            <a href="#features" className="text-gray-200 hover:text-green-400 transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-gray-200 hover:text-green-400 transition-colors font-medium">Pricing</a>
            <a href="#testimonials" className="text-gray-200 hover:text-green-400 transition-colors font-medium">Testimonials</a>
            <a href="#contact" className="text-gray-200 hover:text-green-400 transition-colors font-medium">Contact</a>
          </div> */}
        </div>
      </nav>

      <div className="container mx-auto px-4 flex items-center justify-center flex-grow pt-24 h-screen">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              {typedText}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
            Streamline your financial tracking with our intuitive platform. Gain insights, control spending, and achieve your financial goals effortlessly.
          </p>

          <div className="flex justify-center space-x-4">
            <button className="group flex items-center justify-center bg-green-500 text-white px-8 py-4 rounded-lg 
              hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:-translate-y-1 
              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              onClick={() => navigate("/register")}>
              Get Started
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="group flex items-center justify-center border-2 border-green-500 text-green-500 
              px-8 py-4 rounded-lg hover:bg-green-500 hover:text-white 
              transition-all duration-300 ease-in-out transform hover:-translate-y-1 
              hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              onClick={() => {navigate("/dashboard")}}>
              View Dashboard
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      <section id="features" className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Powerful Features
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              ExpenseFlow offers comprehensive tools to transform your financial management experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <BarChart2 className="text-green-500 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Detailed Analytics</h3>
              <p className="text-gray-300">
                Get deep insights into your spending patterns with intuitive visualizations and comprehensive reports.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <Wallet className="text-blue-500 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Budget Tracking</h3>
              <p className="text-gray-300">
                Set and monitor budgets across different categories, with real-time alerts and recommendations.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform">
              <Shield className="text-purple-500 mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-gray-300">
                Bank-level encryption and strict privacy controls ensure your financial data remains confidential.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Freelance Designer",
                quote: "ExpenseFlow helped me understand my spending and save over $500 monthly!",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Small Business Owner",
                quote: "The analytics are incredible. I've optimized my business expenses significantly.",
                rating: 5
              },
              {
                name: "Emma Rodriguez",
                role: "Marketing Professional",
                quote: "Intuitive interface and powerful features. It's like having a financial advisor in my pocket.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500" fill="currentColor" />
                  ))}
                </div>
                <p className="italic mb-4 text-gray-300">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-xl font-bold text-green-400 mb-4">ExpenseFlow</h5>
            <p className="text-gray-300">Simplify your financial journey with smart, intuitive expense tracking.</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 text-center text-gray-400 border-t border-gray-800 pt-4">
          © 2025 ExpenseFlow. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;