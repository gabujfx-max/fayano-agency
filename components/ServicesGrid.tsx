import React from 'react';
import { Wrench, Zap, Tv, Hammer, Cctv, Info, ArrowRight } from 'lucide-react';
import { ServiceCategory, ServiceType } from '../types';

interface ServicesGridProps {
  onSelectService: (category: ServiceCategory) => void;
}

const services: ServiceType[] = [
  { id: '1', name: ServiceCategory.PLUMBING, icon: 'wrench', description: 'Expert leak repairs, pipe installations, and complete drain cleaning services.', basePrice: '500' },
  { id: '2', name: ServiceCategory.ELECTRICAL, icon: 'zap', description: 'Safe wiring, socket repairs, lighting installation, and fault diagnosis.', basePrice: '500' },
  { id: '3', name: ServiceCategory.APPLIANCES, icon: 'tv', description: 'Professional repair for fridges, washing machines, microwaves, and cookers.', basePrice: '1500' },
  { id: '4', name: ServiceCategory.HANDYMAN, icon: 'hammer', description: 'Furniture assembly, wall mounting, painting touch-ups, and general fixes.', basePrice: '1000' },
  { id: '5', name: ServiceCategory.CCTV_SECURITY, icon: 'cctv', description: 'CCTV camera installation, electric fences, and security system maintenance.', basePrice: '2500' },
  { id: '6', name: ServiceCategory.GENERAL, icon: 'info', description: 'Not sure what you need? Book a general consultation visit.', basePrice: '500' },
];

const getIcon = (name: string) => {
  switch (name) {
    case 'wrench': return <Wrench className="w-7 h-7" />;
    case 'zap': return <Zap className="w-7 h-7" />;
    case 'tv': return <Tv className="w-7 h-7" />;
    case 'hammer': return <Hammer className="w-7 h-7" />;
    case 'cctv': return <Cctv className="w-7 h-7" />;
    default: return <Info className="w-7 h-7" />;
  }
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectService }) => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm">Our Expertise</span>
          <h2 className="mt-3 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl tracking-tight">Professional Services</h2>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Skilled, vetted experts ready to tackle every corner of your home or office with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="group relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => onSelectService(service.name)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 dark:bg-brand-900/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
              
              <div className="relative bg-white dark:bg-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-sm border border-gray-100 dark:border-gray-600 mb-8 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-colors duration-300">
                {getIcon(service.icon)}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{service.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed h-16">{service.description}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700/50">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-semibold">Starting from</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">KSh {service.basePrice}</span>
                </div>
                <span className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};