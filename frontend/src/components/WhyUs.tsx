import React from 'react';
import { motion } from 'framer-motion';
import Folder from './Folder';
import FastDelivery from './features/FastDelivery';
import AffordablePricing from './features/AffordablePricing';
import DedicatedSupport from './features/DedicatedSupport';
import DeepExperience from './features/DeepExperience';
import HighSecurity from './features/HighSecurity';
import ScalableSolutions from './features/ScalableSolutions';

const WhyUs: React.FC = () => {
  const folderItems = [
    <FastDelivery key="1" />,
    <AffordablePricing key="2" />,
    <DedicatedSupport key="3" />,
    <DeepExperience key="4" />,
    <HighSecurity key="5" />,
    <ScalableSolutions key="6" />
  ];

  return (
    <section id="why" className="py-32 bg-[#000510] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
        {/* Left Side: 35% Text */}
        <div className="w-full lg:w-[35%] text-left">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-black text-blue-500 tracking-[0.5em] uppercase mb-6">
              The Techly Advantage
            </h2>
            <h3 className="text-4xl lg:text-8xl font-black text-white tracking-tighter leading-tight mb-8">
              Why <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700">Techly?</span>
            </h3>
            <p className="text-gray-400 text-lg lg:text-xl font-medium leading-relaxed max-w-sm">
              We define excellence through strategic technical superiority and an obsessive focus on user experience. <span className="text-white">Click the folder</span> to explore our pillars.
            </p>
          </motion.div>
        </div>

        {/* Right Side: 65% Folder Box */}
        <div className="w-full lg:w-[65%]">
          <div className="w-full h-[350px] md:h-[600px] bg-[#050505] rounded-[40px] md:rounded-[60px] border border-white/5 shadow-[0_0_100px_rgba(0,101,255,0.1)] flex items-end justify-start relative group p-6 md:p-20 overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 opacity-20 rounded-[60px]" style={{ backgroundImage: 'radial-gradient(#1e1e1e 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,101,255,0.15)_0%,transparent_70%)] rounded-[60px]" />
            
            <div className="relative z-10 scale-[0.8] md:scale-[1.3] origin-bottom-left">
              <Folder 
                items={folderItems} 
                color="#0065FF"
                className="interactive-tech-folder"
              />
            </div>

            {/* Interaction Hint */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <span className="text-blue-500 text-[10px] uppercase tracking-[0.4em] font-black">Open Archive</span>
              <div className="w-px h-10 bg-gradient-to-b from-blue-500 to-transparent rounded-full animate-pulse" />
            </div>

            {/* Corner Decorative Elements */}
            <div className="absolute top-12 left-12 w-24 h-24 border-l-2 border-t-2 border-white/5 rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-12 right-12 w-24 h-24 border-r-2 border-b-2 border-white/5 rounded-br-3xl pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
