import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Globe, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Link as LinkIcon,
  Wifi,
  FileText,
  TrendingUp,
  Mic,
  Award,
  Users,
  Target,
  Heart,
  ArrowRight,
  Truck,
  Shield,
  Smartphone,
  Star,
  MapPin,
  Package
} from 'lucide-react';

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Refs for sections
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const marketplaceRef = useRef(null);
  const howItWorksRef = useRef(null);
  const aboutRef = useRef(null);

  const features = [
    {
      icon: LinkIcon,
      title: "Blockchain Provenance",
      description: "Every transaction and product movement is recorded on an immutable blockchain ledger ensuring complete transparency."
    },
    {
      icon: Wifi,
      title: "IoT Monitoring (in future)",
      description: "Real-time monitoring of product conditions (temperature, humidity) throughout the supply chain journey."
    },
    {
      icon: FileText,
      title: "Smart Contracts",
      description: "Automated escrow payments and quality verification through tamper-proof smart contracts."
    },
    {
      icon: TrendingUp,
      title: "AI Fraud Detection",
      description: "Machine learning algorithms monitor transactions for anomalies and potential fraud."
    },
    {
      icon: Mic,
      title: "Voice Interface (in future)",
      description: "Voice commands and multilingual support for farmers with limited digital literacy."
    },
    {
      icon: Award,
      title: "Sustainability Rewards",
      description: "Farmers earn tokens for sustainable practices that can be redeemed for benefits."
    }
  ];

  const steps = [
    {
      number: "1",
      icon: Users,
      title: "Create Account",
      description: "Sign up as a farmer, buyer, or logistics provider with email verification and Aadhaar authentication."
    },
    {
      number: "2", 
      icon: ShoppingCart,
      title: "Browse Marketplace",
      description: "Explore available products, connect with verified partners, and discover new opportunities."
    },
    {
      number: "3",
      icon: Shield,
      title: "Secure Transactions",
      description: "Execute smart contracts with escrow protection and blockchain-based provenance tracking."
    },
    {
      number: "4",
      icon: Truck,
      title: "Logistics & Delivery",
      description: "Coordinate transportation and delivery with trusted logistics partners in real-time."
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Mission",
      description: "To empower farmers and revolutionize agricultural supply chains through technology, transparency, and trust."
    },
    {
      icon: Award,
      title: "Vision", 
      description: "To create a global agricultural ecosystem where every farmer has direct access to markets and fair prices."
    },
    {
      icon: Heart,
      title: "Values",
      description: "Transparency, fairness, innovation, and sustainability guide everything we do at AgriChain."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Farmers Connected" },
    { number: "50,000+", label: "Active Buyers" },
    { number: "₹100Cr+", label: "Transactions Processed" },
    { number: "25+", label: "States Covered" }
  ];

  const marketplaceProducts = [
    {
      name: "Premium Basmati Rice",
      location: "Punjab",
      farmer: "Rajesh Kumar",
      price: "₹85/kg"
    },
    {
      name: "Fresh Tomatoes",
      location: "Maharashtra", 
      farmer: "Amit Singh",
      price: "₹40/kg"
    },
    {
      name: "Organic Turmeric",
      location: "Karnataka",
      farmer: "Lakshmi Reddy", 
      price: "₹180/kg"
    }
  ];

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll detection for navbar transparency and active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      // Update navbar transparency
      setIsScrolled(window.scrollY > 20);

      // Update active section
      if (aboutRef.current && scrollPosition >= aboutRef.current.offsetTop) {
        setActiveSection('about');
      } else if (howItWorksRef.current && scrollPosition >= howItWorksRef.current.offsetTop) {
        setActiveSection('how-it-works');
      } else if (marketplaceRef.current && scrollPosition >= marketplaceRef.current.offsetTop) {
        setActiveSection('marketplace');
      } else if (featuresRef.current && scrollPosition >= featuresRef.current.offsetTop) {
        setActiveSection('features');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionRef, sectionName) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionName);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full filter blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-emerald-300/40 to-teal-300/40 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Mouse Follow Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.1), transparent 50%)`,
        }}
      />
      
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-2xl border-b border-emerald-200/40 shadow-lg shadow-emerald-500/20' 
          : 'bg-white/60 backdrop-blur-xl border-b border-emerald-200/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Text Only */}
            <div className="flex items-center">
              <button 
                onClick={() => scrollToSection(homeRef, 'home')}
                className="flex items-center space-x-2"
              >
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  SmartKissan
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 relative">
              <button 
                onClick={() => scrollToSection(homeRef, 'home')}
                className={`text-gray-600 hover:text-emerald-500 font-medium transition-all duration-300 py-5 px-1 ${
                  activeSection === 'home' ? 'text-emerald-500' : ''
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection(featuresRef, 'features')}
                className={`text-gray-600 hover:text-emerald-500 font-medium transition-all duration-300 py-5 px-1 ${
                  activeSection === 'features' ? 'text-emerald-500' : ''
                }`}
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection(marketplaceRef, 'marketplace')}
                className={`text-gray-600 hover:text-emerald-500 font-medium transition-all duration-300 py-5 px-1 ${
                  activeSection === 'marketplace' ? 'text-emerald-500' : ''
                }`}
              >
                Marketplace
              </button>
              <button 
                onClick={() => scrollToSection(howItWorksRef, 'how-it-works')}
                className={`text-gray-600 hover:text-emerald-500 font-medium transition-all duration-300 py-5 px-1 ${
                  activeSection === 'how-it-works' ? 'text-emerald-500' : ''
                }`}
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection(aboutRef, 'about')}
                className={`text-gray-600 hover:text-emerald-500 font-medium transition-all duration-300 py-5 px-1 ${
                  activeSection === 'about' ? 'text-emerald-500' : ''
                }`}
              >
                About
              </button>
              
              {/* Moving Underline - Centered below nav items */}
              <div 
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ease-in-out"
                style={{
                  width: activeSection === 'home' ? '35px' : 
                         activeSection === 'features' ? '55px' :
                         activeSection === 'marketplace' ? '75px' :
                         activeSection === 'how-it-works' ? '85px' : 
                         activeSection === 'about' ? '35px' : '0px',
                  left: activeSection === 'home' ? '0px' : 
                        activeSection === 'features' ? '55px' : 
                        activeSection === 'marketplace' ? '130px' :
                        activeSection === 'how-it-works' ? '215px' : 
                        activeSection === 'about' ? '300px' : '0px',
                }}
              />
            </div>

            {/* Right Side Items */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <button className="text-gray-500 hover:text-emerald-500 transition-all duration-300 hover:scale-110">
                <ShoppingCart className="w-4 h-4" />
              </button>

              {/* Language Icon (Placeholder) */}
              <button className="text-gray-500 hover:text-emerald-500 transition-all duration-300 hover:scale-110">
                <Globe className="w-4 h-4" />
              </button>

              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className="text-gray-500 hover:text-emerald-500 transition-all duration-300 hover:scale-110"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Auth Buttons */}
              <Link 
                to="/login"
                className="px-3 py-1.5 text-gray-600 font-medium hover:text-emerald-500 transition-all duration-300 text-sm"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 text-sm shadow-lg shadow-emerald-500/30"
              >
                Register
              </Link>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-500 hover:text-emerald-500 transition-all duration-300 hover:scale-110"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 -mx-4 px-4 py-4">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => {
                    scrollToSection(homeRef, 'home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-gray-600 hover:text-emerald-500 font-medium transition-all duration-300 text-left ${
                    activeSection === 'home' ? 'text-emerald-500' : ''
                  }`}
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    scrollToSection(featuresRef, 'features');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-gray-700 hover:text-green-600 font-medium transition-colors text-left ${
                    activeSection === 'features' ? 'text-green-600' : ''
                  }`}
                >
                  Features
                </button>
                <button 
                  onClick={() => {
                    scrollToSection(marketplaceRef, 'marketplace');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-gray-700 hover:text-green-600 font-medium transition-colors text-left ${
                    activeSection === 'marketplace' ? 'text-green-600' : ''
                  }`}
                >
                  Marketplace
                </button>
                <button 
                  onClick={() => {
                    scrollToSection(howItWorksRef, 'how-it-works');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-gray-700 hover:text-green-600 font-medium transition-colors text-left ${
                    activeSection === 'how-it-works' ? 'text-green-600' : ''
                  }`}
                >
                  How It Works
                </button>
                <button 
                  onClick={() => {
                    scrollToSection(aboutRef, 'about');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-gray-700 hover:text-green-600 font-medium transition-colors text-left ${
                    activeSection === 'about' ? 'text-green-600' : ''
                  }`}
                >
                  About
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Main Content */}
      <main className="pt-16 relative z-10">
        {/* Home Section */}
        <section ref={homeRef} className="h-screen flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 pt-0 relative z-20">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-center">
            <div className="text-center relative w-full">
              {/* Glass Card Container */}
              <div className="bg-white/20 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl shadow-black/10 border border-white/30 relative overflow-hidden mx-auto max-w-5xl lg:max-w-4xl transform hover:scale-105 transition-all duration-700">
                {/* Glass Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 rounded-3xl"></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-40 sm:w-48 h-40 sm:h-48 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-48 sm:w-56 h-48 sm:h-56 bg-gradient-to-tl from-cyan-200/20 to-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-4 sm:mb-6 border border-white/30 shadow-lg shadow-black/10">
                    <span className="text-emerald-600 font-semibold text-sm sm:text-base">🌱 Revolutionizing Agriculture</span>
                  </div>
                  
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-center">
                    <span className="block mb-1 sm:mb-2 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent drop-shadow-lg">
                      Transforming
                    </span>
                    <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-lg">
                      Agriculture
                    </span>
                    <span className="block text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mt-2 sm:mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">
                      with SmartKissan
                    </span>
                  </h1>
                  
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl sm:max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed font-medium text-center px-2 sm:px-0">
                    Connect directly with farmers, ensure fair prices, and revolutionize the agricultural supply chain with 
                    <span className="text-emerald-500 font-bold"> blockchain technology</span> and 
                    <span className="text-teal-500 font-bold"> transparent transactions</span>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center">
                    <button 
                      onClick={() => scrollToSection(featuresRef, 'features')}
                      className="group px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 backdrop-blur-sm border border-white/20 text-sm sm:text-base"
                    >
                      <span className="flex items-center space-x-2">
                        <span>Explore Features</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                    <button 
                      onClick={() => scrollToSection(marketplaceRef, 'marketplace')}
                      className="group px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 bg-white/20 backdrop-blur-xl text-gray-700 font-bold rounded-xl hover:bg-white/30 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-black/10 border border-white/30 text-sm sm:text-base"
                    >
                      <span className="flex items-center space-x-2">
                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Visit Marketplace</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-10 sm:-top-12 -left-10 sm:-left-12 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-emerald-300/30 to-teal-300/30 rounded-full blur-2xl animate-bounce"></div>
              <div className="absolute -bottom-10 sm:-bottom-12 -right-10 sm:-right-12 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-tl from-cyan-300/30 to-emerald-300/30 rounded-full blur-2xl animate-bounce delay-500"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Powerful Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl sm:max-w-4xl mx-auto font-medium px-2 sm:px-0">
              SmartKissan combines cutting-edge technologies to revolutionize agricultural supply chains
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 hover:bg-white/10 transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-black/10 border border-white/15 relative overflow-hidden"
                >
                  {/* Watery Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-white/3 rounded-2xl sm:rounded-3xl"></div>
                  
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl from-emerald-100/10 to-green-100/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-xl shadow-black/10 group-hover:shadow-emerald-500/30 transition-all duration-500 group-hover:scale-110">
                      <Icon className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 group-hover:text-emerald-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Marketplace Section */}
        <section ref={marketplaceRef} className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Agricultural Marketplace
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Connect directly with verified farmers and get fresh, quality produce at fair prices
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">2,500+</div>
                <div className="text-sm text-gray-600">Active Listings</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">10,000+</div>
                <div className="text-sm text-gray-600">Verified Farmers</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">50,000+</div>
                <div className="text-sm text-gray-600">Completed Orders</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">₹100Cr+</div>
                <div className="text-sm text-gray-600">Secure Transactions</div>
              </div>
            </div>

            {/* Featured Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🌾</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Premium Basmati Rice</h3>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Certified
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                      <span className="text-sm text-gray-400">(124 reviews)</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        Punjab
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-3 h-3 mr-1" />
                        Rajesh Kumar
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹85/kg</span>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                        Contact Farmer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🍅</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Fresh Tomatoes</h3>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Certified
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.6</span>
                      </div>
                      <span className="text-sm text-gray-400">(89 reviews)</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        Maharashtra
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-3 h-3 mr-1" />
                        Amit Singh
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹40/kg</span>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                        Contact Farmer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">🧡</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Organic Turmeric</h3>
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Certified
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.9</span>
                      </div>
                      <span className="text-sm text-gray-400">(156 reviews)</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        Karnataka
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-3 h-3 mr-1" />
                        Lakshmi Reddy
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-green-600">₹180/kg</span>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                        Contact Farmer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-white rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Selling?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of farmers already selling their produce on SmartKissan
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Register as Farmer
                </Link>
                <Link 
                  to="/register"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Register as Buyer
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Simple steps to transform your agricultural supply chain with SmartKissan
              </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-start space-x-6 p-6 bg-white rounded-xl hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className="w-6 h-6 text-green-600" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="text-center bg-white rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of farmers and buyers already using SmartKissan
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link 
                  to="/marketplace"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Browse Marketplace
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section ref={aboutRef} className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center py-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                About SmartKissan
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We're building the future of agricultural supply chains with technology, trust, and transparency
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Values Section */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Our Core Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div 
                      key={index}
                      className="text-center p-8 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-3">
                        {value.title}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Story Section */}
            <div className="bg-gray-50 rounded-xl p-8 mb-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h3>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p className="mb-4">
                  SmartKissan was born from a simple observation: farmers deserve better. We saw hardworking farmers 
                  struggling with complex supply chains, middlemen taking unfair cuts, and lack of direct market access.
                </p>
                <p className="mb-4">
                  Founded in 2024, our mission was to leverage blockchain technology, smart contracts, and modern 
                  logistics to create a transparent, efficient agricultural marketplace. We wanted to put power back 
                  into the hands of those who feed our nation.
                </p>
                <p>
                  Today, SmartKissan connects thousands of farmers directly with buyers, ensuring fair prices, 
                  secure transactions, and complete transparency. We're not just building a platform; we're 
                  building a movement to transform Indian agriculture.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center bg-white rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Join Us in Revolutionizing Agriculture
              </h3>
              <p className="text-gray-600 mb-6">
                Whether you're a farmer, buyer, or logistics partner, there's a place for you in SmartKissan
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join SmartKissan Today
                </Link>
                <Link 
                  to="/contact"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  SmartKissan
                </span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Revolutionizing agricultural supply chains through blockchain technology, connecting farmers directly with buyers for fair prices and complete transparency.
              </p>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Globe className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Users className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection(homeRef, 'home')}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection(featuresRef, 'features')}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection(marketplaceRef, 'marketplace')}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    Marketplace
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection(howItWorksRef, 'how-it-works')}
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    How It Works
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>New Delhi, India</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>support@agrichain.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; 2026 SmartKissan. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm">
                Made with ❤️ by <span className="text-green-400 font-semibold">SmartKissan</span> • Empowering Indian Farmers
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
