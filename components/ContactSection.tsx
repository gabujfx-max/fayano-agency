import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight, MessageCircle } from 'lucide-react';

export const ContactSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-950 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Contact Details */}
          <div className="space-y-10">
            <div>
              <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm">Get in Touch</span>
              <h2 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Visit Our HQ</h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                We are based in Nairobi but our network of fundis covers the entire metropolitan area. Come visit us or book online.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-brand-50 dark:bg-gray-800 p-3 rounded-xl text-brand-600 dark:text-brand-400 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nairobi Location</h3>
                  <p className="text-gray-600 dark:text-gray-400">Westlands Commercial Center, Ring Road<br />Nairobi, Kenya</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-50 dark:bg-gray-800 p-3 rounded-xl text-brand-600 dark:text-brand-400 shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Call or WhatsApp</h3>
                  <div className="flex flex-col">
                    <p className="text-gray-600 dark:text-gray-400">0759298305</p>
                    <a 
                      href="https://wa.me/254759298305" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-green-600 dark:text-green-400 font-bold text-sm mt-1 hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Chat on WhatsApp
                    </a>
                  </div>
                  <span className="text-sm text-gray-400 mt-1 block">Mon-Sat, 8am - 6pm</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-brand-50 dark:bg-gray-800 p-3 rounded-xl text-brand-600 dark:text-brand-400 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Email Support</h3>
                  <p className="text-gray-600 dark:text-gray-400">support@fayano.co.ke</p>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:gap-3 transition-all">
              View all service areas <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Google Map */}
          <div className="relative h-[500px] w-full bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
             <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.19036281522!2d36.70730729737158!3d-1.3031933758372605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi!5e0!3m2!1sen!2ske!4v1709669547629!5m2!1sen!2ske" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%] hover:grayscale-0 transition-all duration-500"
            ></iframe>
            
            <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Our office is open now. Walk-ins welcome.</p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};