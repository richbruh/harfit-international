import React from "react";
import { useInView } from 'react-intersection-observer';
import { Building2, Phone, Mail, Clock, CheckCircle, Hammer, HardHat, Trophy, MessageCircle, LogIn, Users, Award, Globe, MapPin, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import Carousel from './Carousel';

function Home() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Top Black Bar */}
      <div className="bg-[#36454F] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>(021) 4602929</span>
            </div>
            <div className="flex items-center">
              <Printer className="h-4 w-4 mr-2" />
              <span>FAX: (021) 460 5824</span>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>Mon - Fri: 8:00 AM - 5:00 PM GMT+7</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/0214602929"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all z-50 flex items-center justify-center"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Hero Section */}
      <header className="relative h-screen">
        <div className="absolute inset-0 bg-[#36454F] bg-opacity-70"><Carousel /></div>
        <nav className="relative z-10 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
              <img
                  src="/images/harfit-logo.png"
                  alt="Harfit Logo"
                  className="h-32 w-32 mr-2" 
                />
                <a href="/" className="ml-2 text-2xl font-bold text-white">HARFIT INTERNATIONAL</a>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#about" className="text-white hover:text-[#FF0000]">About</a>
                <Link to="/projects" className="text-white hover:text-[#FF0000]">Projects</Link>
                <a href="#contact" className="text-white hover:text-[#FF0000]">Contact</a>
                <Link 
                  to="/login" 
                  className="flex items-center space-x-1 bg-[#FF0000] text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-80px)] flex items-center mt-[120px]">
          <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-from-top">
              Experienced Interior Contractor in Large Buildings
              </h1>            
              <p className="text-xl md:text-2xl mb-8 animate-slide-from-top">
              Premium Woodworking & Interior Solutions Since 1972
              </p>
              <Link to="/projects" className="bg-[#FF0000] text-white px-8 py-3 rounded-md font-semibold hover:bg-red-700 transition">
              Explore Our Work
            </Link>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#36454F] mb-4">
              PT. HARFIT INTERNATIONAL
            </h2>
            <p 
              ref={ref}
              className={`text-gray-600 max-w-3xl mx-auto transition-all duration-1000 transform 
                ${inView ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
            >
              Berdiri sejak tanggal <strong>16 November 1972</strong> <br/>
              Sebagai perusahaan yang telah berpengalaman di bidang furniture,
              maka kami telah mengembangkan diri di beberapa bidang sebagai pendukung 
              produksi furniture yaitu dengan membentuk Departemen Interior (Job Order), 
              Departemen Harfit Furnicraft Center (Trading), Departemen Hard System (Exhibition), 
              dan dengan dibentuknya departemen pendukung ini dapat menghasilkan produksi 
              yang inovatif dan variatif yang diharapkan dapat bersaing dengan industri 
              furniture yang selalu berkembang.
            </p>
          </div>

          {/* Google Map Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-[#36454F] mb-4">Our Location</h3>
            <div className="w-full h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5140227714924!2d106.9136461!3d-6.195704500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f53579269a7f%3A0xdaa1a2a665dcc29e!2sPT.%20Harfit%20International!5e0!3m2!1sid!2sid!4v1737827293706!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#36454F] mb-4">Our Mission</h3>
              <p className="text-gray-600">
              To deliver exceptional woodworking and interior solutions with innovative 
      furniture designs that exceed client expectations, while maintaining 
      the highest standards of quality craftsmanship and Indonesian 
      architectural heritage.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-[#36454F] mb-4">Our Vision</h3>
              <p className="text-gray-600">
                  To be Indonesia's leading furniture manufacturer and interior contractor, 
                recognized for our premium woodworking expertise, sustainable practices, 
                and transformative interior solutions that enhance both commercial 
                and residential spaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#36454F] mb-4">Contact Us</h2>
            <p className="text-gray-600">Get in touch with our team of experts</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-[#36454F] mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-[#FF0000] mt-1" />
                  <div>
                    <h4 className="font-semibold text-[#36454F] mb-1">Address</h4>
                    <p className="text-gray-600">
                      Jl. Rw. Terate II No.H/04 5, RT.2/RW.9, Jatinegara, Cakung, East Jakarta City, Jakarta 13930
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-[#FF0000] mt-1" />
                  <div>
                    <h4 className="font-semibold text-[#36454F] mb-1">Phone</h4>
                    <p className="text-gray-600">(021) 4602929</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-[#FF0000] mt-1" />
                  <div>
                    <h4 className="font-semibold text-[#36454F] mb-1">Email</h4>
                    <p className="text-gray-600">contact@harfitinternational.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-[#36454F] mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#36454F] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FF0000] focus:border-[#FF0000]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#36454F] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FF0000] focus:border-[#FF0000]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#36454F] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#FF0000] focus:border-[#FF0000]"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#FF0000] text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;