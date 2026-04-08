/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  ChevronRight, 
  X, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Star,
  Menu,
  MessageCircle,
  ArrowRight,
  Info,
  Calendar,
  User,
  Activity,
  Droplets,
  Stethoscope,
  FileText,
  Microscope,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TESTS, WELLNESS_PACKAGE } from './constants';
import { Test, CartItem, BookingDetails } from './types';
import { cn } from './lib/utils';

const WHATSAPP_NUMBER = "7354645650";

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    fullName: '',
    mobile: '',
    address: '',
    gender: 'Male',
    age: '',
    preferredDate: '',
    preferredTime: '',
    homeCollection: true,
    fasting: false,
    specialNote: '',
  });

  // Filtered tests based on search
  const filteredTests = useMemo(() => {
    return TESTS.filter(test => 
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const cartTotal = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    if (isCouponApplied) {
      return Math.round(subtotal * 0.95);
    }
    return subtotal;
  }, [cart, isCouponApplied]);

  const cartSavings = useMemo(() => {
    const baseSavings = cart.reduce((sum, item) => {
      if (item.type === 'test') {
        const test = TESTS.find(t => t.id === item.id);
        return sum + (test ? (test.mrp - test.offerPrice) : 0);
      }
      return sum + 1200; // Estimated savings for package
    }, 0);

    if (isCouponApplied) {
      const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
      return baseSavings + Math.round(subtotal * 0.05);
    }
    return baseSavings;
  }, [cart, isCouponApplied]);

  const applyCoupon = () => {
    if (couponInput.toUpperCase() === 'FIRST5') {
      setIsCouponApplied(true);
      alert("Coupon FIRST5 applied successfully! 5% discount added.");
    } else {
      alert("Invalid coupon code. Try FIRST5 for 5% off.");
    }
  };

  const addToCart = (item: CartItem) => {
    if (!cart.find(i => i.id === item.id)) {
      setCart([...cart, item]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleWhatsAppClick = (customMessage?: string) => {
    const message = customMessage || "Hello SIS Pathology, I would like to inquire about lab tests.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Using a simple reverse geocoding API or just showing coordinates if API not available
          // For now, we'll just set a placeholder or try to fetch if we had a key
          // Since I don't have a Google Maps key here, I'll just show the coordinates and ask user to confirm
          setBookingDetails(prev => ({
            ...prev,
            address: `${prev.address}\n(Detected Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)})`.trim()
          }));
          setIsDetectingLocation(false);
        } catch (error) {
          console.error("Error detecting location:", error);
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsDetectingLocation(false);
        alert("Unable to retrieve your location. Please enter it manually.");
      }
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const testList = cart.map(item => `- ${item.name} (₹${item.price})`).join('\n');
    const message = `*New Lab Booking - SIS Pathology*\n\n` +
      `*Patient Details:*\n` +
      `Name: ${bookingDetails.fullName}\n` +
      `Phone: ${bookingDetails.mobile}\n` +
      `Age/Gender: ${bookingDetails.age} / ${bookingDetails.gender}\n` +
      `Address: ${bookingDetails.address}\n\n` +
      `*Booking Info:*\n` +
      `Date: ${bookingDetails.preferredDate}\n` +
      `Time: ${bookingDetails.preferredTime}\n` +
      `Home Collection: ${bookingDetails.homeCollection ? 'Yes' : 'No'}\n` +
      `Fasting: ${bookingDetails.fasting ? 'Yes' : 'No'}\n` +
      `Note: ${bookingDetails.specialNote || 'N/A'}\n\n` +
      `*Selected Tests:*\n${testList}\n\n` +
      `*Coupon Applied:* ${isCouponApplied ? 'FIRST5 (5% OFF)' : 'None'}\n` +
      `*Total Amount:* ₹${cartTotal}\n` +
      `*Total Savings:* ₹${cartSavings}\n\n` +
      `Please confirm my booking.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Navbar (Non-sticky) */}
      <nav className="relative border-b border-white/5 bg-darker">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* SIS Brand */}
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                <Microscope className="text-white w-6 h-6 relative z-10" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none tracking-tight">SIS</h1>
                <p className="text-[9px] text-primary font-bold uppercase mt-0.5">Pathology</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-white/10" />
            
            {/* Tenet Brand */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                <Zap className="text-accent w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none tracking-tight">TENET</h1>
                <p className="text-[9px] text-accent font-bold uppercase mt-0.5">Diagnostics</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#tests" className="text-sm font-medium hover:text-primary transition-colors">Tests</a>
            <a href="#packages" className="text-sm font-medium hover:text-primary transition-colors">Packages</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Reviews</a>
            <div className="h-4 w-px bg-white/10" />
            <a href={`tel:${WHATSAPP_NUMBER}`} className="flex items-center gap-2 text-sm font-bold text-primary">
              <Phone size={16} />
              +91 {WHATSAPP_NUMBER}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 glass-hover rounded-full"
            >
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-darker">
                  {cart.length}
                </span>
              )}
            </button>
            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 glass rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-darker/90 backdrop-blur-md z-[80]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[80%] max-w-sm bg-dark border-r border-white/10 z-[90] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Microscope className="text-primary w-6 h-6" />
                    <span className="text-lg font-bold">SIS</span>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="flex items-center gap-2">
                    <Zap className="text-accent w-6 h-6" />
                    <span className="text-lg font-bold">TENET</span>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <a 
                  href="#tests" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-lg font-medium hover:text-primary transition-colors"
                >
                  <Stethoscope size={20} className="text-primary" /> All Tests
                </a>
                <a 
                  href="#packages" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-lg font-medium hover:text-primary transition-colors"
                >
                  <ShieldCheck size={20} className="text-accent" /> Health Packages
                </a>
                <a 
                  href="#testimonials" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-lg font-medium hover:text-primary transition-colors"
                >
                  <Star size={20} className="text-amber-400" /> Patient Reviews
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-lg font-medium hover:text-primary transition-colors"
                >
                  <Clock size={20} className="text-accent" /> How it Works
                </a>
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                <p className="text-xs text-slate-500 mb-4 uppercase font-bold tracking-wider">Contact Support</p>
                <a 
                  href={`tel:${WHATSAPP_NUMBER}`}
                  className="flex items-center gap-3 text-primary font-bold mb-4"
                >
                  <Phone size={18} /> +91 {WHATSAPP_NUMBER}
                </a>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleWhatsAppClick();
                  }}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> WhatsApp Booking
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck size={14} /> SIS & TENET Diagnostic Alliance
            </span>
            <h2 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
              Advanced Diagnostics – <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">SIS x TENET Excellence</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
              Fast reports, affordable packages, and professional home sample collection. 
              Get accurate results from the comfort of your home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => {
                  const el = document.getElementById('tests');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
              >
                Book Home Collection <ChevronRight size={18} />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('tests');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-outline w-full sm:w-auto"
              >
                View Test Prices
              </button>
              <button 
                onClick={() => handleWhatsAppClick()}
                className="flex items-center justify-center gap-2 text-secondary font-bold hover:text-secondary/80 transition-colors"
              >
                <MessageCircle size={20} /> WhatsApp Booking
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Clock className="text-primary" />, label: "60 Min Collection", desc: "Fastest at-home service" },
            { icon: <ShieldCheck className="text-secondary" />, label: "Accurate Reports", desc: "NABL standard labs" },
            { icon: <Droplets className="text-primary" />, label: "Safe & Hygienic", desc: "Certified phlebotomists" },
            { icon: <Stethoscope className="text-accent" />, label: "Same Day Result", desc: "Digital reports on phone" },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-2xl border-white/5"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-bold mb-1">{feature.label}</h3>
              <p className="text-xs text-slate-500">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Wellness Package Highlight */}
      <section id="packages" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[32px] p-8 md:p-12 relative overflow-hidden border-primary/20">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck size={200} className="text-primary" />
            </div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="px-4 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase mb-4 inline-block">
                  Best Value Package
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">{WELLNESS_PACKAGE.name}</h2>
                <p className="text-slate-400 mb-8 text-lg">{WELLNESS_PACKAGE.description}</p>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-6 mb-10">
                  {WELLNESS_PACKAGE.tests.map((test, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-primary" />
                      <span>{test}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-end gap-4 mb-8">
                  <div>
                    <p className="text-slate-500 text-sm line-through">MRP ₹4,000</p>
                    <p className="text-4xl font-bold text-white">₹{WELLNESS_PACKAGE.price}</p>
                  </div>
                  <div className="bg-secondary/20 text-secondary px-3 py-1 rounded-lg text-sm font-bold mb-1">
                    30% OFF
                  </div>
                </div>

                <button 
                  onClick={() => addToCart({ id: WELLNESS_PACKAGE.id, name: WELLNESS_PACKAGE.name, price: WELLNESS_PACKAGE.price, type: 'package' })}
                  className="btn-primary w-full md:w-auto"
                >
                  Book This Package
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="glass p-6 rounded-2xl">
                    <h4 className="font-bold text-primary mb-2">Full Body</h4>
                    <p className="text-xs text-slate-500">Comprehensive screening of all vital organs.</p>
                  </div>
                  <div className="glass p-6 rounded-2xl">
                    <h4 className="font-bold text-accent mb-2">Vitamins</h4>
                    <p className="text-xs text-slate-500">Includes B12 and Vitamin D levels.</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="glass p-6 rounded-2xl">
                    <h4 className="font-bold text-accent mb-2">Diabetes</h4>
                    <p className="text-xs text-slate-500">HbA1c and FBS included for sugar monitoring.</p>
                  </div>
                  <div className="glass p-6 rounded-2xl">
                    <h4 className="font-bold text-rose-400 mb-2">Thyroid</h4>
                    <p className="text-xs text-slate-500">Complete thyroid profile for hormonal health.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Catalog */}
      <section id="tests" className="py-20 px-4 bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Search Lab Tests</h2>
              <p className="text-slate-400">Browse our extensive list of pathology tests with real-time pricing.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input 
                type="text"
                placeholder="Search tests (e.g. CBC, Thyroid...)"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTests.map((test) => {
              const discount = Math.round(((test.mrp - test.offerPrice) / test.mrp) * 100);
              return (
                <motion.div 
                  layout
                  key={test.id}
                  className="glass rounded-2xl p-6 flex flex-col border-white/5 hover:border-primary/30 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {test.category}
                    </span>
                    {test.fastingRequired && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                        <Info size={12} /> Fasting Required
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{test.name}</h3>
                  <p className="text-xs text-slate-500 mb-6 line-clamp-2">{test.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold">₹{test.offerPrice}</span>
                      <span className="text-sm text-slate-500 line-through">₹{test.mrp}</span>
                      {discount > 0 && (
                        <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => addToCart({ id: test.id, name: test.name, price: test.offerPrice, type: 'test' })}
                        className="flex-1 bg-white/5 hover:bg-primary text-white py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Add to Cart
                      </button>
                      <button 
                        onClick={() => {
                          addToCart({ id: test.id, name: test.name, price: test.offerPrice, type: 'test' });
                          setIsBookingModalOpen(true);
                        }}
                        className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-500">No tests found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose SIS Pathology?</h2>
            <p className="text-slate-400">Experience premium healthcare services with a personal touch.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Same Day Report", desc: "Get your digital reports on the same day for most tests.", icon: <Clock className="text-primary" /> },
              { title: "Accurate Digital Reports", desc: "High-precision testing with easy-to-read digital reports.", icon: <ShieldCheck className="text-secondary" /> },
              { title: "Home Collection in 60 Mins", desc: "Our phlebotomists reach your doorstep within an hour.", icon: <Truck className="text-accent" /> },
              { title: "Trusted Local Service", desc: "Serving your community with reliability and care.", icon: <Star className="text-amber-400" /> },
              { title: "Safe & Hygienic", desc: "Strict adherence to safety protocols and hygiene.", icon: <Droplets className="text-primary" /> },
              { title: "Expert Phlebotomists", desc: "Experienced professionals for painless sample collection.", icon: <User className="text-secondary" /> },
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-3xl border-white/5">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 bg-darker/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400">Simple 4-step process for your health checkup</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Select Test", desc: "Choose from our wide range of individual tests or health packages.", icon: <ShoppingCart className="text-primary" /> },
              { step: "02", title: "Book Slot", desc: "Pick a convenient date and time for home sample collection.", icon: <Calendar className="text-secondary" /> },
              { step: "03", title: "Sample Collection", desc: "Our expert phlebotomist visits your home for a painless collection.", icon: <Droplets className="text-primary" /> },
              { step: "04", title: "Get Reports", desc: "Receive accurate digital reports on your WhatsApp/Email within 24 hours.", icon: <FileText className="text-secondary" /> },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="glass p-8 rounded-[32px] border-white/5 h-full hover:border-primary/30 transition-all">
                  <div className="text-4xl font-black text-white/5 absolute top-6 right-8 group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-10">
                    <ArrowRight className="text-white/10" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Info */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass p-8 md:p-16 rounded-[48px] border-white/5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                  Advanced Diagnostics <br />
                  <span className="text-primary">Right At Your Doorstep</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <ShieldCheck className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">NABL Standard Labs</h4>
                      <p className="text-sm text-slate-500">All samples are processed in state-of-the-art labs following international quality standards.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <User className="text-accent" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Certified Professionals</h4>
                      <p className="text-sm text-slate-500">Our phlebotomists are highly trained and experienced in pediatric and geriatric sample collection.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <MessageCircle className="text-green-500" size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Smart Digital Reports</h4>
                      <p className="text-sm text-slate-500">Receive easy-to-understand reports with historical trends and health recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[32px] overflow-hidden">
                  <img 
                    src="https://picsum.photos/seed/medical-lab/800/800" 
                    alt="SIS Pathology Lab" 
                    className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl border-white/10 max-w-[240px]">
                  <p className="text-xs text-slate-400 mb-2">Trusted by</p>
                  <p className="text-2xl font-bold text-white">50,000+</p>
                  <p className="text-xs text-primary font-bold">Satisfied Patients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews / Testimonials */}
      <section id="testimonials" className="py-24 px-4 bg-dark relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">What Our Patients Say</h2>
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
              </div>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Trusted by over 5,000+ happy customers. We pride ourselves on accuracy, 
                speed, and compassionate care.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                name: "Rahul Sharma", 
                text: "Very professional service. The phlebotomist arrived on time and the report was delivered by evening. Highly recommended for home collection!", 
                rating: 5,
                date: "2 days ago",
                location: "Indore"
              },
              { 
                name: "Priya Patel", 
                text: "The home collection is a lifesaver. Painless blood draw and very affordable prices compared to other labs. The digital report is very clear.", 
                rating: 5,
                date: "1 week ago",
                location: "Bhopal"
              },
              { 
                name: "Amit Verma", 
                text: "Booked the Wellness Package. It's great value for money. The comprehensive report helped me understand my health better. Excellent service!", 
                rating: 5,
                date: "2 weeks ago",
                location: "Indore"
              },
              { 
                name: "Sneha Gupta", 
                text: "Fastest reports I've ever received. I needed my thyroid profile urgently and they delivered within 6 hours. Truly impressive speed.", 
                rating: 5,
                date: "3 days ago",
                location: "Ujjain"
              },
              { 
                name: "Vikram Singh", 
                text: "Very hygienic and safe. The staff followed all protocols and were very polite. The booking process on WhatsApp was seamless.", 
                rating: 5,
                date: "1 month ago",
                location: "Indore"
              },
              { 
                name: "Anjali Deshmukh", 
                text: "Great experience! The phlebotomist was very skilled, didn't even feel the needle. Prices are much better than big brand labs.", 
                rating: 5,
                date: "5 days ago",
                location: "Dewas"
              },
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[32px] border-white/5 relative group hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(review.rating)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                
                <p className="text-slate-300 mb-8 italic leading-relaxed">"{review.text}"</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center font-bold text-primary border border-white/5">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold flex items-center gap-1">
                        {review.name}
                        <CheckCircle2 size={12} className="text-accent" />
                      </h4>
                      <p className="text-[10px] text-slate-500">{review.location} • {review.date}</p>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider">
                    Verified
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={() => handleWhatsAppClick("Hi SIS Pathology, I want to share my feedback about your service.")}
              className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
            >
              Share your experience with us <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Microscope className="text-primary w-6 h-6" />
                <span className="text-xl font-bold">SIS</span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <Zap className="text-accent w-6 h-6" />
                <span className="text-xl font-bold">TENET</span>
              </div>
            </div>
            <p className="text-slate-500 max-w-md mb-8">
              Premium pathology services powered by the combined expertise of SIS and TENET. 
              We leverage advanced technology to provide accurate and timely results.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary transition-all"><MessageCircle size={20} /></a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary transition-all"><Phone size={20} /></a>
              <a href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-primary transition-all"><MapPin size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><a href="#tests" className="hover:text-primary transition-colors">All Tests</a></li>
              <li><a href="#packages" className="hover:text-primary transition-colors">Health Packages</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Home Collection</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-primary" />
                <span>+91 {WHATSAPP_NUMBER}</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={16} className="text-primary" />
                <span>WhatsApp Booking Available</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-primary" />
                <span>7:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-slate-600 text-xs">
          © 2026 SIS Pathology Service. All rights reserved.
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-darker/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-dark border-l border-white/10 z-[70] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart size={20} /> Your Cart
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingCart size={48} className="mx-auto text-slate-700 mb-4" />
                    <p className="text-slate-500">Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-primary font-bold"
                    >
                      Browse Tests
                    </button>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.id} className="glass p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-sm">{item.name}</h4>
                          <p className="text-primary font-bold">₹{item.price}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Minus size={18} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Upsell */}
                    {!cart.find(i => i.id === WELLNESS_PACKAGE.id) && (
                      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mt-8">
                        <h4 className="font-bold text-sm mb-2">Upgrade to Wellness Package?</h4>
                        <p className="text-xs text-slate-400 mb-4">Get 14 vital tests for just ₹2800. Save over ₹1200!</p>
                        <button 
                          onClick={() => addToCart({ id: WELLNESS_PACKAGE.id, name: WELLNESS_PACKAGE.name, price: WELLNESS_PACKAGE.price, type: 'package' })}
                          className="text-xs font-bold text-primary flex items-center gap-1"
                        >
                          Add Best Value Package <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-white/5">
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm text-slate-400">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-secondary">
                      <span>Total Savings</span>
                      <span>-₹{cartSavings}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/5">
                      <span>Total Amount</span>
                      <span>₹{cartTotal}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      placeholder="Coupon Code" 
                      className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button 
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-sm font-bold hover:bg-primary/30 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {isCouponApplied && (
                    <p className="text-[10px] text-secondary font-bold mb-4 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Coupon FIRST5 applied! 5% extra discount.
                    </p>
                  )}

                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsBookingModalOpen(true);
                    }}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Proceed to Booking <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-darker/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-dark border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div>
                  <h3 className="text-xl font-bold">Complete Your Booking</h3>
                  <p className="text-xs text-slate-500">Total Amount: ₹{cartTotal}</p>
                </div>
                <button onClick={() => setIsBookingModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        required
                        type="text"
                        placeholder="Enter patient name"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={bookingDetails.fullName}
                        onChange={(e) => setBookingDetails({...bookingDetails, fullName: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        required
                        type="tel"
                        placeholder="10-digit mobile number"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={bookingDetails.mobile}
                        onChange={(e) => setBookingDetails({...bookingDetails, mobile: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Age</label>
                    <input 
                      required
                      type="number"
                      placeholder="Years"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={bookingDetails.age}
                      onChange={(e) => setBookingDetails({...bookingDetails, age: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Gender</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={bookingDetails.gender}
                      onChange={(e) => setBookingDetails({...bookingDetails, gender: e.target.value})}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Preferred Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input 
                        required
                        type="time"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={bookingDetails.preferredTime}
                        onChange={(e) => setBookingDetails({...bookingDetails, preferredTime: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      required
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={bookingDetails.preferredDate}
                      onChange={(e) => setBookingDetails({...bookingDetails, preferredDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase">Full Address</label>
                    <button 
                      type="button"
                      onClick={detectLocation}
                      disabled={isDetectingLocation}
                      className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline disabled:opacity-50"
                    >
                      <MapPin size={12} /> {isDetectingLocation ? 'Detecting...' : 'Detect My Location'}
                    </button>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-500" size={18} />
                    <textarea 
                      required
                      placeholder="Enter your complete address for home collection"
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={bookingDetails.address}
                      onChange={(e) => setBookingDetails({...bookingDetails, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 py-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={bookingDetails.homeCollection}
                        onChange={(e) => setBookingDetails({...bookingDetails, homeCollection: e.target.checked})}
                      />
                      <div className={cn(
                        "w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center",
                        bookingDetails.homeCollection ? "bg-primary border-primary" : "border-white/20"
                      )}>
                        {bookingDetails.homeCollection && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-sm font-medium">Home Collection</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={bookingDetails.fasting}
                        onChange={(e) => setBookingDetails({...bookingDetails, fasting: e.target.checked})}
                      />
                      <div className={cn(
                        "w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center",
                        bookingDetails.fasting ? "bg-primary border-primary" : "border-white/20"
                      )}>
                        {bookingDetails.fasting && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-sm font-medium">I will be fasting</span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Special Note (Optional)</label>
                  <input 
                    type="text"
                    placeholder="Any specific instructions?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={bookingDetails.specialNote}
                    onChange={(e) => setBookingDetails({...bookingDetails, specialNote: e.target.value})}
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
                  >
                    Confirm & Book on WhatsApp <MessageCircle size={22} />
                  </button>
                  <p className="text-center text-[10px] text-slate-500 mt-4">
                    By clicking confirm, you will be redirected to WhatsApp to finalize your booking with our team.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp CTA */}
      <motion.button 
        onClick={() => handleWhatsAppClick()}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 z-50 cursor-pointer"
      >
        <MessageCircle size={28} />
      </motion.button>

    </div>
  );
}
