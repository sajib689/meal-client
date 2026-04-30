"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  CheckCircle,
  Users,
  Home,
  Utensils,
  PieChart,
  MessageSquare,
  DollarSign,
  Shield,
  Smartphone,
  TrendingUp,
  ChevronDown,
  MonitorPlay
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-500/30">
      {/* 1. Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Utensils className="text-white w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tight text-slate-900 block leading-none">MEAL</span>
                <span className="font-bold text-[10px] tracking-[0.2em] text-indigo-600 uppercase block">Master</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">FAQ</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                Log in
              </Link>
              <Link href="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg shadow-indigo-200">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 shadow-xl shadow-slate-200/50 absolute w-full"
            >
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg">Features</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg">How it Works</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg">Pricing</a>
              <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-lg">FAQ</a>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 text-base font-semibold text-slate-700 bg-slate-100 rounded-xl">Log in</Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 text-base font-semibold text-white bg-indigo-600 rounded-xl shadow-md">Get Started</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-400 opacity-20 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1.5 px-3 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6 shadow-sm">
              🚀 The #1 SaaS Platform for Hostels & Messes
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
              Smart Mess Management <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Made Effortless.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Manage meals, members, billing, and reports easily with our cloud-based SaaS platform. Say goodbye to messy spreadsheets.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95">
                Start Free Trial
              </Link>
              <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                <MonitorPlay className="w-5 h-5 text-indigo-600" /> Watch Demo
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 3. Trusted By / Stats Section */}
      <div className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">Trusted by institutions worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "500+", label: "Mess Owners" },
              { value: "20,000+", label: "Active Members" },
              { value: "1M+", label: "Meals Managed" },
              { value: "99.9%", label: "System Uptime" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Features Section */}
      <div id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Everything you need to run your mess smoothly.</h2>
            <p className="text-lg text-slate-600">Powerful features designed to save you hours of administrative work every single week.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Member Management", desc: "Easily add, track, and manage all your mess members in one centralized dashboard." },
              { icon: Home, title: "Room & Seat Management", desc: "Organize your housing layout. Assign and monitor available rooms and seats instantly." },
              { icon: Utensils, title: "Meal Tracking", desc: "Track daily meals, monitor consumption trends, and calculate precise daily meal costs." },
              { icon: DollarSign, title: "Billing System", desc: "Generate monthly bills automatically based on individual meal records and fixed costs." },
              { icon: TrendingUp, title: "Expense Tracking", desc: "Log all daily bazar expenses and operational costs cleanly to maintain balance sheets." },
              { icon: PieChart, title: "Reports & Analytics", desc: "Get visual financial insights, usage reports, and export data in one click." },
              { icon: MessageSquare, title: "Smart Notifications", desc: "Send automated SMS and Email alerts for low balances, new bills, and notices." },
              { icon: Shield, title: "Multi-Mess Support", desc: "Run multiple hostels or messes from a single super-admin master account." },
              { icon: Smartphone, title: "Mobile Friendly", desc: "Fully responsive design ensures you can manage operations on the go from your phone." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. How It Works */}
      <div id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">How it works</h2>
            <p className="text-lg text-slate-600">Get your mess completely digitized in just four simple steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 z-0"></div>

            {[
              { step: "01", title: "Create Account", desc: "Sign up and configure your mess settings in minutes." },
              { step: "02", title: "Add Members", desc: "Invite members and assign them to specific rooms and seats." },
              { step: "03", title: "Track Activity", desc: "Log daily meals, bazar expenses, and deposits easily." },
              { step: "04", title: "Automate Billing", desc: "Let the system calculate per-meal costs and generate bills." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-indigo-100/50">
                  <span className="text-2xl font-black text-indigo-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Pricing Plans */}
      <div id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-600">Choose the perfect plan for the size of your hostel or mess.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Basic</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for small messes</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">৳900</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> <span className="text-slate-700 font-medium">Up to 50 Members</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> <span className="text-slate-700 font-medium">Meal Tracking</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> <span className="text-slate-700 font-medium">Basic Billing</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> <span className="text-slate-700 font-medium">Standard Reports</span></li>
              </ul>
              <Link href="/register?plan=basic" className="block w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 text-center rounded-xl font-bold transition-colors">
                Choose Basic
              </Link>
            </div>

            {/* Standard Plan */}
            <div className="bg-indigo-600 rounded-3xl p-8 shadow-2xl shadow-indigo-600/30 border border-indigo-500 relative transform md:-translate-y-4">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
              <p className="text-indigo-200 text-sm mb-6">For growing hostels</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">৳1900</span>
                <span className="text-indigo-200 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-300" /> <span className="text-white font-medium">Up to 200 Members</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-300" /> <span className="text-white font-medium">SMS Notifications</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-300" /> <span className="text-white font-medium">Room Management</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-300" /> <span className="text-white font-medium">Advanced Reports</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-300" /> <span className="text-white font-medium">Email Support</span></li>
              </ul>
              <Link href="/register?plan=standard" className="block w-full py-4 px-6 bg-white hover:bg-slate-50 text-indigo-600 text-center rounded-xl font-bold transition-colors shadow-lg shadow-black/5">
                Start Free Trial
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Premium</h3>
              <p className="text-slate-500 text-sm mb-6">For large enterprises</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">৳3900</span>
                <span className="text-slate-500 font-medium">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> <span className="text-slate-700 font-medium">Unlimited Members</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> <span className="text-slate-700 font-medium">SMS + Email Alerts</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> <span className="text-slate-700 font-medium">Custom Branding</span></li>
                <li className="flex items-center gap-3"><CheckCircle className="w-5 h-5 text-indigo-500" /> <span className="text-slate-700 font-medium">Priority 24/7 Support</span></li>
              </ul>
              <Link href="/register?plan=premium" className="block w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 text-center rounded-xl font-bold transition-colors">
                Choose Premium
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 8. Testimonials Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-16">Loved by Mess Owners</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rahim Ahmed", role: "Mess Manager", quote: "Best mess management software I have ever used. It completely eliminated our Excel sheet nightmares." },
              { name: "Sarah Khan", role: "Hostel Owner", quote: "The automated billing and clear transparent reporting has increased trust among all my hostel residents." },
              { name: "Abir Hossain", role: "Student Leader", quote: "Tracking meals from my phone and getting weekly sms updates is so convenient. Highly recommended." }
            ].map((t, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
                <div className="text-yellow-400 font-serif text-3xl mb-4">"</div>
                <p className="text-slate-700 mb-6 italic">{t.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. FAQ Section */}
      <div id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is the software cloud-based?", a: "Yes, our platform is fully cloud-based. You can access it from any browser on your computer, tablet, or smartphone without installing any desktop software." },
              { q: "Can I manage multiple messes from one account?", a: "Yes, our Premium plan allows you to seamlessly switch between different mess properties from a single master dashboard." },
              { q: "Is my data secure?", a: "Absolutely. We use enterprise-grade encryption and perform daily backups to ensure your financial data and resident information is always safe." },
              { q: "How do SMS notifications work?", a: "We integrate with leading SMS gateways. Whenever a bill is generated or an urgent notice is posted, members receive instant text alerts." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex justify-between items-center font-bold p-6 text-slate-900">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* 10. CTA & Footer */}
      <div className="bg-indigo-900 relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Start Managing Your Mess Smartly Today</h2>
          <p className="text-xl text-indigo-200 mb-10">Join hundreds of owners saving dozens of hours every month.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="px-8 py-4 bg-white text-indigo-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:scale-105">
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 pt-16 pb-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Utensils className="text-white w-4 h-4" />
                </div>
                <span className="font-black text-xl text-white tracking-tight">MealMaster</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-sm">
                The all-in-one SaaS solution designed specifically for hostel and mess administrators.
                Simplifying life since 2024.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="text-slate-400 hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} MealMaster SaaS Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
