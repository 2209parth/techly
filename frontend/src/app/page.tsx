"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link'; // Added Link import
const Plasma = dynamic(() => import('@/components/Plasma'), { ssr: false });
import DecryptedText from '@/components/DecryptedText';
import SplashScreen from '@/components/SplashScreen';
import { motion, AnimatePresence } from 'framer-motion';
import MagicNav from '@/components/MagicNav';
import MagicBento from '@/components/MagicBento';
import TiltedCard from '@/components/TiltedCard';
import CardSwap, { Card } from '@/components/CardSwap';
import Dock from '@/components/Dock';
import LiquidDock from '@/components/LiquidDock';
import ProfileCard from '@/components/ProfileCard';
import WhyUs from '@/components/WhyUs';
import { VscHome, VscCode, VscMail, VscLayers, VscBriefcase, VscPulse, VscDeviceMobile, VscRobot, VscGraphLine, VscPackage, VscEdit, VscLink, VscGithub, VscSymbolMethod, VscSymbolColor } from 'react-icons/vsc';

// Hook for window size
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

const teamMembers = [
  {
    name: "Parth",
    role: "FOUNDER",
    description: "The visionary architect behind Techly's most ambitious projects. Parth combines strategic foresight with a deep obsession for technical perfection.",
    imageSrc: "/parth_grayscale_studio_1774344363235.png",
    icons: [<VscLink key="1" />, <VscEdit key="2" />]
  },
  {
    name: "Utsav",
    role: "CHIEF EXECUTIVE OFFICER",
    description: "Driving global growth and operational excellence. Utsav ensures the Techly ecosystem remains a leader in digital innovation and client success.",
    imageSrc: "/utsav_grayscale_studio_1774344385910.png",
    icons: [<VscLink key="1" />, <VscCode key="2" />]
  },
  {
    name: "Kaushik",
    role: "CHIEF TECHNOLOGY OFFICER",
    description: "Crafting the technical future of Techly. Kaushik bridges the gap between raw computing power and elegant software solutions.",
    imageSrc: "/kaushik_grayscale_studio_1774344408680.png",
    icons: [<VscSymbolColor key="1" />, <VscLink key="2" />]
  }
];

export default function Home() {
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const [showSplash, setShowSplash] = useState(true);

  // Sync navigation active state with page scroll
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  useEffect(() => {
    const sectionIds = ['home', 'services', 'playground', 'why', 'identity', 'contact'];
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionIds.indexOf(entry.target.id);
          if (index !== -1) {
            setActiveSectionIndex(index);
          }
        }
      });
    };

    // Use a negative rootMargin so the element must cross the mid-section to become active
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    });

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 40;
      window.scrollTo({ top, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: "Hello! I'm Techly's intelligent assistant. How can I help you build your digital experience today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<null | 'success' | 'error'>(null);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    setContactStatus(null);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch("https://formspree.io/f/xzdjlqaa", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      
      if (response.ok) {
        setContactStatus('success');
        form.reset();
      } else {
        setContactStatus('error');
      }
    } catch (error) {
      setContactStatus('error');
    } finally {
      setIsSubmittingContact(false);
      setTimeout(() => setContactStatus(null), 5000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatTyping, isChatOpen]);

  const handleSendMessage = async (text: string) => {
     if(!text.trim()) return;
     const newMessages = [...chatMessages, { role: 'user', content: text }];
     setChatMessages(newMessages);
     setChatInput('');
     setIsChatTyping(true);

     try {
       const res = await fetch("/api/chat", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ 
             message: text,
             history: chatMessages 
         }),
       });

       const data = await res.json();
       
       setChatMessages([...newMessages, { role: 'ai', content: data.reply }]);
     } catch (e) {
       setChatMessages([...newMessages, { role: 'ai', content: "An error occurred connecting to Gemini." }]);
     } finally {
       setIsChatTyping(false);
     }
  };

  const [editorCode, setEditorCode] = useState(`import { DigitalExperience } from '@techly/core';

const app = new DigitalExperience({
  id: 'techly-preview',
  performance: 1.0,
  vision: 'grow-your-business'
});

await app.deploy({
  mode: 'future' 
});

// Output: Techly Digital Experience initialized.`);

  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'system', message: '[SYSTEM] Ready to code. Techly Core v4.2.0 initialized successfully.' }
  ]);
  const [aiCommand, setAiCommand] = useState('');

  const runCode = (codeToRun = editorCode) => {
    setConsoleLogs(prev => [...prev, { type: 'info', message: '> Executing command...' }]);
    
    setTimeout(() => {
        try {
            if (codeToRun.includes('printf("Hello, World!");') || codeToRun.includes('hello world')) {
                setConsoleLogs(prev => [...prev, { type: 'success', message: '→ [OUTPUT] Hello, World!' }]);
            } else if (codeToRun.includes('app.deploy')) {
                setConsoleLogs(prev => [...prev, { type: 'success', message: '→ [DEPLOY] Success: Digital Experience live at dev-preview.techly.ai' }]);
                // eslint-disable-next-line no-eval
                const result = eval(codeToRun);
                setConsoleLogs(prev => [...prev, { type: 'success', message: `→ Result: ${result}` }]);
            }
        } catch (e: any) {
            setConsoleLogs(prev => [...prev, { type: 'error', message: `→ Error: ${e.message}` }]);
        }
    }, 500);
  };

  const handleAICommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCommand.trim()) return;

    const cmd = aiCommand.toLowerCase();
    setConsoleLogs(prev => [...prev, { type: 'system', message: `[AI] Understanding request: "${aiCommand}"...` }]);
    
    setTimeout(() => {
        if (cmd.includes('c program') && (cmd.includes('hello world') || cmd.includes('print'))) {
            const helloWorldC = `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}`;
            setEditorCode(helloWorldC);
            setConsoleLogs(prev => [...prev, { type: 'system', message: '[AI] Generated C Hello World program. Executing...' }]);
            runCode(helloWorldC);
        } else {
            setConsoleLogs(prev => [...prev, { type: 'error', message: '[AI] I only know C Hello World for now. Try "Write a C program to print hello world"' }]);
        }
        setAiCommand('');
    }, 1000);
  };

  return (
    <main className={`min-h-screen bg-black text-white selection:bg-[#0065FF]/30 font-[family-name:var(--font-geist-sans)] ${showSplash ? 'h-screen overflow-hidden' : ''}`}>
      
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
     

      {/* Fixed Logo - Top Left */}
      <Link href="/" className="fixed top-6 md:top-10 left-6 md:left-12 z-[60] hover:opacity-80 transition-opacity drop-shadow-2xl">
         <img src="/reallogo.png" alt="Techly Logo" className="h-10 md:h-16 w-auto" />
      </Link>

      {/* Hero Section */}
      <header className="relative w-full h-screen overflow-hidden bg-[#000510]" id="home">
        <div className="absolute inset-0 z-0 opacity-40">
          <Plasma color="#0065FF" speed={0.3} direction="forward" scale={1.2} opacity={0.6} mouseInteractive={false} />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto h-full px-8 flex flex-col pt-40 pb-20 items-center justify-center text-center">
          {/* Central Content Wrapper */}
          <div className="max-w-3xl w-full flex flex-col items-center relative">
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square bg-[#0065FF]/10 blur-[150px] rounded-full pointer-events-none"></div>

            {/* Centered Content */}
            <div className="relative z-30 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
              <h1 className="text-[2.2rem] xs:text-[2.5rem] md:text-7xl font-black tracking-tighter mb-8 leading-[1.05] md:leading-[0.95] max-w-4xl px-2 md:px-4">
                 <span className="text-white/90 text-center block md:inline">We Build Digital Experiences </span>
                 <span className="text-[#0065FF] text-center block md:inline">That Grow Your Business.</span>
              </h1>
              
              <p className="text-gray-400 text-sm md:text-lg max-w-xl mb-12 font-medium leading-relaxed mx-auto text-balance px-6 md:px-0">
                Predictive intelligence designed to automate focus and mitigate risk across your entire workflow.
              </p>
                     <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
                  <button 
                   onClick={() => setIsChatOpen(true)}
                   className="flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 bg-[#0065FF] text-white text-sm md:text-base font-black rounded-2xl hover:bg-[#0055dd] transition-all transform hover:scale-[1.05] active:scale-95 shadow-2xl shadow-[#0065FF]/40"
                  >
                     Free Counseling
                     <div className="bg-white/20 p-1 rounded-lg">
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                     </div>
                  </button>
              </div>
            </div>

            {/* AI Chat & Suggestion - Bottom Right */}
            <div className={`fixed ${isMobile ? 'bottom-24 right-5' : 'bottom-10 right-10'} z-50 flex flex-col items-end gap-3 md:gap-4 transition-all duration-500 w-[calc(100vw-40px)] md:w-auto`}>
               {/* Chat Window */}
               {isChatOpen && (
                 <div className="w-full md:w-[450px] h-[70vh] md:h-[600px] bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left animate-in zoom-in-95 fade-in slide-in-from-bottom-10 origin-bottom-right duration-300">
                    {/* Header */}
                    <div className="p-6 bg-[#0065FF]/10 border-b border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#0065FF] rounded-lg flex items-center justify-center">
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                          </div>
                          <div>
                             <h4 className="text-sm font-black tracking-tight text-white">Techly AI</h4>
                             <p className="text-[10px] text-[#0065FF] font-bold uppercase tracking-widest">Always Active</p>
                          </div>
                       </div>
                       <button onClick={() => setIsChatOpen(false)} className="text-white/20 hover:text-white transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                       </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide flex flex-col">
                       {chatMessages.map((msg, i) => (
                          <div key={i} className={`rounded-2xl p-4 max-w-[85%] border ${msg.role === 'ai' ? 'bg-white/5 border-white/5 self-start' : 'bg-[#0065FF]/10 border-[#0065FF]/20 self-end ml-auto'}`}>
                             <div className={`text-[13px] leading-relaxed whitespace-pre-wrap ${msg.role === 'ai' ? 'text-gray-300' : 'text-white'}`}>
                                {msg.content.split('\n').map((line, j) => (
                                   <span key={j} className={line.trim() === '' ? 'block h-2' : 'block mb-1'}>
                                      {line.split(/(\*\*.*?\*\*)/g).map((part, k) => 
                                         part.startsWith('**') && part.endsWith('**') ? 
                                         <strong key={k} className="text-white font-bold">{part.slice(2, -2)}</strong> : 
                                         part
                                      )}
                                   </span>
                                ))}
                             </div>
                          </div>
                       ))}
                       {isChatTyping && (
                          <div className="bg-white/5 rounded-2xl p-4 max-w-[85%] border border-white/5 animate-pulse self-start">
                             <p className="text-[13px] text-gray-500">Techly is typing...</p>
                          </div>
                       )}
                       <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-black/40 border-t border-white/5">
                       <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatInput); }} className="relative">
                          <input 
                             type="text" 
                             value={chatInput}
                             onChange={(e) => setChatInput(e.target.value)}
                             placeholder="Type your message..." 
                             className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-[13px] text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                          />
                          <button type="submit" disabled={!chatInput.trim() || isChatTyping} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0065FF] rounded-lg flex items-center justify-center hover:bg-[#0055dd] disabled:opacity-50 disabled:hover:bg-[#0065FF] transition-colors shadow-lg shadow-[#0065FF]/20">
                             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                          </button>
                       </form>
                    </div>
                 </div>

               )}

               <div className="flex items-center gap-4">
                  {/* Suggestion Hint - Permanently Visible when closed */}
                  {!isChatOpen && (
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-right-4 duration-1000">
                       <span className="text-[10px] font-black tracking-[0.25em] text-white/40 uppercase">Talk with our AI</span>
                  <div className="flex items-center gap-2">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/20"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
               </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 bg-[#0065FF] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                    <button 
                       onClick={() => setIsChatOpen(!isChatOpen)}
                       className={`relative w-16 h-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${isChatOpen ? 'bg-[#0065FF] border-[#0065FF]' : 'hover:bg-white/10'}`}
                    >
                       <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="transition-all duration-300">
                          {isChatOpen ? (
                             <path d="M18 6L6 18M6 6l12 12" strokeWidth="3" />
                          ) : (
                             <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                          )}
                       </svg>
                       {!isChatOpen && (
                          <>
                             <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0065FF] border-2 border-[#050505] rounded-full animate-ping"></div>
                             <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#0065FF] border-2 border-[#050505] rounded-full"></div>
                          </>
                       )}
                    </button>
                  </div>
               </div>
            </div>


          </div>
        </div>

        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000510] via-transparent to-[#000510] opacity-80 z-[5] pointer-events-none" />
      </header>

      {/* Services Section */}
      <section id="services" className="relative min-h-screen flex flex-col justify-center py-20 px-8 overflow-hidden bg-[#000510] border-t border-white/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0065FF]/10 border border-[#0065FF]/20 text-[#0065FF] text-[10px] font-black tracking-[0.2em] uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF] animate-pulse"></div>
                Our Expertise
              </div>
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-white uppercase">
                Our <span className="text-[#0065FF]">Services</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
                We provide end-to-end digital solutions designed to help your business thrive in the modern technological landscape. 
                Explore our core competencies where cutting-edge technology meets creative excellence.
              </p>
              <div className="pt-2 md:pt-4">
                <button className="px-6 md:px-8 py-3 md:py-4 bg-[#0065FF] text-white text-[10px] md:text-xs font-black tracking-widest uppercase rounded-xl hover:bg-blue-600 transition-all shadow-xl shadow-[#0065FF]/20 transform hover:scale-[1.02] active:scale-95">
                  View All Solutions
                </button>
              </div>
            </div>

            {/* Right Side: CardSwap */}
            <div className="relative w-full h-[600px] flex items-center justify-center lg:justify-end pt-64 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <div className="relative">
                {/* Decorative Glow behind cards */}
                <div className="absolute -inset-20 bg-[#0065FF]/5 blur-[100px] rounded-full"></div>
                
                <CardSwap
                  width={isMobile ? 280 : 500}
                  height={isMobile ? 320 : 400}
                  cardDistance={isMobile ? 30 : 60}
                  verticalDistance={isMobile ? 40 : 70}
                  delay={4000}
                  pauseOnHover={true}
                >
                  <Card className="flex flex-col p-6 md:p-10 border-white/5 bg-[#030712]/90">
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#0065FF] mb-4 md:mb-6">Engineering</span>
                    <h3 className="text-2xl md:text-4xl font-black text-white m-0 mb-4 md:mb-6 uppercase">Web Solutions</h3>
                    <p className="text-xs md:text-base text-white/50 font-semibold leading-relaxed">Bespoke Websites, Web Apps, and full-stack engineering.</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Techly Intelligence</span>
                      <div className="w-8 h-8 rounded-full bg-[#0065FF]/20 flex items-center justify-center">
                         <VscCode size={16} className="text-[#0065FF]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="flex flex-col p-6 md:p-10 border-white/5 bg-[#060010]/90">
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#0065FF] mb-4 md:mb-6">Mobile</span>
                    <h3 className="text-2xl md:text-4xl font-black text-white m-0 mb-4 md:mb-6 uppercase">App Ecosystems</h3>
                    <p className="text-xs md:text-base text-white/50 font-semibold leading-relaxed">Native iOS/Android apps and cross-platform experiences.</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[8px] md:text-[10px] text-white/30 uppercase font-bold tracking-widest">Techly Intelligence</span>
                      <div className="w-8 h-8 rounded-full bg-[#0065FF]/20 flex items-center justify-center">
                         <VscDeviceMobile size={16} className="text-[#0065FF]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="flex flex-col p-6 md:p-10 border-white/5 bg-[#030712]/90">
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#0065FF] mb-4 md:mb-6">Future Tech</span>
                    <h3 className="text-2xl md:text-4xl font-black text-white m-0 mb-4 md:mb-6 uppercase">AI & Automation</h3>
                    <p className="text-xs md:text-base text-white/50 font-semibold leading-relaxed">Intelligent Chatbots, AI Movie Creation, and Business Automation.</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Techly Intelligence</span>
                      <div className="w-8 h-8 rounded-full bg-[#0065FF]/20 flex items-center justify-center">
                         <VscRobot size={16} className="text-[#0065FF]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="flex flex-col p-6 md:p-10 border-white/5 bg-[#060010]/90">
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#0065FF] mb-4 md:mb-6">Growth</span>
                    <h3 className="text-2xl md:text-4xl font-black text-white m-0 mb-4 md:mb-6 uppercase">Digital Authority</h3>
                    <p className="text-xs md:text-base text-white/50 font-semibold leading-relaxed">Global SEO, API Integrations, and 24/7 Maintenance Support.</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[8px] md:text-[10px] text-white/30 uppercase font-bold tracking-widest">Techly Intelligence</span>
                      <div className="w-8 h-8 rounded-full bg-[#0065FF]/20 flex items-center justify-center">
                         <VscGraphLine size={16} className="text-[#0065FF]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="flex flex-col p-6 md:p-10 border-white/5 bg-[#030712]/90">
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#0065FF] mb-4 md:mb-6">Commerce</span>
                    <h3 className="text-2xl md:text-4xl font-black text-white m-0 mb-4 md:mb-6 uppercase">Value Sales</h3>
                    <p className="text-xs md:text-base text-white/50 font-semibold leading-relaxed">E-commerce, Course Selling, and High-ROI Digital Marketing.</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[8px] md:text-[10px] text-white/30 uppercase font-bold tracking-widest">Techly Intelligence</span>
                      <div className="w-8 h-8 rounded-full bg-[#0065FF]/20 flex items-center justify-center">
                         <VscPackage size={16} className="text-[#0065FF]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="flex flex-col p-6 md:p-10 border-white/5 bg-[#060010]/90">
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#0065FF] mb-4 md:mb-6">Creative</span>
                    <h3 className="text-2xl md:text-4xl font-black text-white m-0 mb-4 md:mb-6 uppercase">Design Excellence</h3>
                    <p className="text-xs md:text-base text-white/50 font-semibold leading-relaxed">Elite UI/UX and Brand Graphic Design.</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Techly Intelligence</span>
                      <div className="w-8 h-8 rounded-full bg-[#0065FF]/20 flex items-center justify-center">
                         <VscEdit size={16} className="text-[#0065FF]" />
                      </div>
                    </div>
                  </Card>
                </CardSwap>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Coding Section */}
      <section id="playground" className="relative min-h-screen flex flex-col justify-center py-20 px-8 overflow-hidden bg-[#050505] border-t border-white/5 scroll-mt-24">
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.3fr] gap-16 items-center">
               
               {/* Left Side - CTA (30%) */}
               <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0065FF]/10 border border-[#0065FF]/20 text-[#0065FF] text-[10px] font-black tracking-[0.2em] uppercase">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF] animate-pulse"></div>
                     Developer Preview
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-white">
                     Want to try some <span className="text-[#0065FF]">coding?</span>
                  </h2>
                  <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-sm">
                     Experience the power of our tech stack directly in your browser. Build, test, and witness high-performance code in real-time.
                  </p>
                  <div className="pt-4">
                     <a href="#" className="inline-flex items-center gap-4 text-white font-black tracking-widest text-xs uppercase group">
                        <span className="pb-1 border-b-2 border-[#0065FF] group-hover:border-white transition-all">Explore Documentation</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-2 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                     </a>
                  </div>
               </div>

               {/* Right Side - Interactive Editor (70%) */}
               <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
                  {/* Outer Glow */}
                  <div className="absolute -inset-4 bg-[#0065FF]/5 blur-3xl rounded-[2rem]"></div>
                  
                  {/* Mobile Run Button */}
                  <div className="md:hidden flex justify-between items-center mb-4 px-2">
                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
                        main.ts
                     </span>
                     <button 
                        onClick={() => runCode()}
                        className="px-4 py-2 bg-[#0065FF] text-white text-[10px] font-black tracking-widest uppercase rounded-xl shadow-lg shadow-[#0065FF]/20 flex items-center gap-2 active:scale-95 transition-transform"
                     >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        Run Code
                     </button>
                  </div>
                  
                  {/* Editor Window */}
                  <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
                     {/* Editor Header */}
                     <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="flex gap-1.5 shrink-0">
                              <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                           </div>
                           <div className="h-4 w-[1px] bg-white/10 mx-2 shrink-0"></div>
                           <span className="text-[8px] md:text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
                              main.ts — Techly Workspace
                           </span>
                        </div>
                        <button 
                           onClick={() => runCode()}
                           className="hidden md:flex px-4 py-1.5 bg-[#0065FF] hover:bg-[#0055dd] text-white text-[10px] font-black tracking-widest uppercase rounded-lg transition-all shadow-lg shadow-[#0065FF]/20 items-center gap-2 group/btn shrink-0"
                        >
                           <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="group-hover/btn:scale-110 transition-transform"><path d="M8 5v14l11-7z"/></svg>
                           Run Code
                        </button>
                     </div>

                     {/* AI Developer Input */}
                     <div className="px-4 md:px-6 py-2 md:py-3 bg-white/5 border-b border-white/5">
                        <form onSubmit={handleAICommand} className="relative group">
                           <div className="absolute -inset-1 bg-gradient-to-r from-[#0065FF]/20 to-purple-500/20 blur opacity-75 group-focus-within:opacity-100 transition-opacity rounded-xl"></div>
                           <div className="relative flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[11px] md:text-xs">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0065FF" strokeWidth="2.5" className="mr-3 shrink-0"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10h-10V2z" opacity="0.3"/></svg>
                              <input 
                                 type="text" 
                                 value={aiCommand}
                                 onChange={(e) => setAiCommand(e.target.value)}
                                 placeholder="Ask AI Developer to write code..." 
                                 className="w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none"
                              />
                              <div className="hidden md:flex items-center gap-2 ml-2">
                                 <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Enter</span>
                              </div>
                           </div>
                        </form>
                     </div>

                     {/* Editor Content */}
                     <div className="flex-1 flex overflow-hidden">
                        {/* Line Numbers */}
                        <div className="w-10 md:w-12 py-6 bg-black/20 border-r border-white/5 flex flex-col items-center gap-2 text-[8px] md:text-[10px] font-mono text-gray-700 select-none">
                           {Array.from({ length: 15 }).map((_, i) => (
                              <div key={i}>{i + 1}</div>
                           ))}
                        </div>
                        
                        {/* Editor Area */}
                        <div className="flex-1 relative">
                           <textarea 
                              spellCheck={false}
                              value={editorCode}
                              onChange={(e) => setEditorCode(e.target.value)}
                              className="absolute inset-0 w-full h-full bg-transparent p-4 md:p-6 font-mono text-[11px] md:text-sm leading-relaxed text-white caret-[#0065FF] resize-none focus:outline-none z-10"
                           />
                        </div>
                     </div>

                     {/* Output Console */}
                     <div className="h-40 bg-black/40 border-t border-white/5 p-4 overflow-y-auto flex flex-col gap-1 scrollbar-hide">
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-gray-600 mb-2 sticky top-0 bg-black/40 py-1">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#28c840]"></div>
                           Console Output
                        </div>
                        {consoleLogs.map((log, i) => (
                           <div key={i} className={`font-mono text-[11px] flex items-center gap-2 ${
                              log.type === 'error' ? 'text-red-500' : 
                              log.type === 'success' ? 'text-[#28c840]' : 
                              log.type === 'info' ? 'text-blue-400' : 'text-gray-500'
                           }`}>
                              <span className="opacity-40">{log.type === 'info' ? '>' : '→'}</span>
                              {log.message}
                           </div>
                        ))}
                     </div>
                   </div>
                </div>
             </div>
          </div>
         
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0065FF]/5 blur-[150px] rounded-full pointer-events-none"></div>
      </section>

       <WhyUs />

      {/* Identity / Team Section */}
      <section id="identity" className="relative min-h-screen flex flex-col justify-center pt-20 pb-48 px-8 overflow-hidden bg-[#050505] border-t border-white/5 scroll-mt-24">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase">
              Leadership <span className="text-[#0065FF]">Team</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl md:text-right">
              Meet the visionaries behind Techly Intelligence who are committed to delivering world-class digital experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center">
            {teamMembers.map((member: any, i: number) => (
              <ProfileCard
                key={i}
                name={member.name}
                title={member.role}
                handle={member.name.toLowerCase()}
                status="Active"
                avatarUrl={member.imageSrc}
                showUserInfo={true}
                enableTilt={true}
                behindGlowEnabled={true}
                behindGlowColor="rgba(0, 101, 255, 0.3)"
                innerGradient="linear-gradient(145deg, rgba(0, 101, 255, 0.1) 0%, rgba(0, 5, 16, 0.9) 100%)"
                onContactClick={() => scrollTo('contact')}
                contactText="Connect"
              />
            ))}
          </div>
        </div>
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0065FF]/5 blur-[150px] rounded-full pointer-events-none"></div>
      </section>
   

      {/* Contact Section */}
      <section id="contact" className="relative min-h-screen flex flex-col justify-center py-20 px-8 bg-[#000510] overflow-hidden border-t border-white/5 scroll-mt-24">
         {/* Background elements */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0065FF]/5 blur-[150px] rounded-full pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">
                  Contact Us
               </h2>
               <p className="text-gray-400 text-base md:text-lg max-w-xl md:text-right">
                  If you have any questions, please feel free to get in touch with us via phone, text, email, the form below, or even on social media!
               </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 mb-8">
               
               {/* Left: Form Card */}
               <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative animate-in zoom-in-95 fade-in duration-1000 delay-200">
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#0065FF]/20 to-transparent blur-2xl opacity-50 rounded-3xl -z-10"></div>
                  <h3 className="text-xs font-black tracking-widest text-[#0065FF] uppercase mb-6 md:mb-8">Get in Touch</h3>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-4 md:space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                           <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Name</label>
                           <input 
                              type="text" 
                              id="name" 
                              name="name" 
                              required 
                              placeholder="Enter your name" 
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                           />
                        </div>
                        <div className="space-y-2">
                           <label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                           <input 
                              type="tel" 
                              id="phone" 
                              name="phone" 
                              required
                              pattern="[0-9]{10}"
                              maxLength={10}
                              onInput={(e) => {
                                 const target = e.currentTarget;
                                 target.value = target.value.replace(/[^0-9]/g, '').slice(0, 10);
                              }}
                              placeholder="10-digit phone number" 
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                           <label htmlFor="business_name" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Business Name</label>
                           <input 
                              type="text" 
                              id="business_name" 
                              name="business_name" 
                              required 
                              placeholder="Your business" 
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                           />
                        </div>
                        <div className="space-y-2">
                           <label htmlFor="business_type" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Business Type</label>
                           <input 
                              type="text" 
                              id="business_type" 
                              name="business_type" 
                              required 
                              placeholder="e.g. E-commerce" 
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                           />
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</label>
                        <input 
                           type="email" 
                           id="email" 
                           name="email" 
                           required 
                           placeholder="Enter your email" 
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                        />
                     </div>
                     
                     <div className="space-y-2">
                        <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Your Message</label>
                        <textarea 
                           id="message" 
                           name="message" 
                           required 
                           rows={3} 
                           placeholder="Tell us about how we can help..." 
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors resize-none"
                        ></textarea>
                     </div>
                     
                     <div className="pt-2 flex justify-start">
                        <button 
                           type="submit" 
                           disabled={isSubmittingContact}
                           className={`flex items-center gap-3 px-8 md:px-10 py-3 md:py-4 ${contactStatus === 'success' ? 'bg-[#28c840] hover:bg-[#28c840]' : contactStatus === 'error' ? 'bg-[#ff5f57] hover:bg-[#ff5f57]' : 'bg-[#0065FF] hover:bg-[#0055dd]'} text-white font-black rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl ${contactStatus === 'success' ? 'shadow-[#28c840]/20' : 'shadow-[#0065FF]/20'} disabled:opacity-75 disabled:hover:scale-100 uppercase tracking-widest text-[10px]`}
                        >
                           {isSubmittingContact ? 'Sending...' : contactStatus === 'success' ? 'Sent!' : contactStatus === 'error' ? 'Error' : 'Send Message'}
                        </button>
                     </div>
                  </form>
               </div>

               {/* Right: Info Flow */}
               <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                  {/* Contact Info Card */}
                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl flex-1">
                     <h3 className="text-sm font-black tracking-widest text-[#0065FF] uppercase mb-8">Contact Information</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex items-start gap-4">
                           <div className="text-[#ff5f57]"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                              <p className="text-white text-sm">+91 9725942209</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="text-[#ff5f57]"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Address</p>
                              <p className="text-white text-sm">Akshardham-2, Bhavnagar, Gujarat</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4 sm:col-span-2">
                           <div className="text-[#ff5f57]"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email</p>
                              <p className="text-white text-sm">parthmk85@gmail.com</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Business Hours Card */}
                  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                     <h3 className="text-sm font-black tracking-widest text-[#0065FF] uppercase mb-8">Business Hours</h3>
                     <div className="flex items-center gap-4 bg-black/40 border border-white/10 p-5 rounded-2xl">
                        <div className="w-12 h-12 bg-[#28c840]/10 rounded-xl flex items-center justify-center text-[#28c840]">
                           <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8h4v2h-6V7h2v5z"/></svg>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Availability</p>
                           <p className="text-white font-bold tracking-wide">24/7 Support Available</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Map */}
            <div className="w-full h-[400px] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
               <div className="absolute inset-0 bg-[#000510]/40 mix-blend-overlay pointer-events-none group-hover:opacity-0 transition-opacity duration-1000 z-10"></div>
               <iframe 
                  title="Map Location"
                  src="https://maps.google.com/maps?q=Akshardham-2,%20Bhavnagar,%20Gujarat&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, filter: 'grayscale(100%) invert(90%) hue-rotate(180deg) opacity(0.8)' }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="relative z-0"
               ></iframe>
            </div>
         </div>
      </section>

      {/* Liquid Navigation Dock (Desktop) */}
      {!showSplash && (
        <div className="hidden md:block">
          <LiquidDock 
            activeIndex={activeSectionIndex}
            items={[
              { icon: <VscHome size={22} />, label: 'Home', onClick: () => scrollTo('home') },
              { icon: <VscBriefcase size={22} />, label: 'Services', onClick: () => scrollTo('services') },
              { icon: <VscCode size={22} />, label: 'Playground', onClick: () => scrollTo('playground') },
              { icon: <VscPulse size={22} />, label: 'Why Us', onClick: () => scrollTo('why') },
              { icon: <VscLayers size={22} />, label: 'Leadership', onClick: () => scrollTo('identity') },
              { icon: <VscMail size={22} />, label: 'Contact', onClick: () => scrollTo('contact') },
            ]}
          />
        </div>
      )}

      {/* Mobile Navigation Dock */}
      {!showSplash && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 py-2">
          <MagicNav 
            items={[
              { id: '1', icon: <VscHome size={22} />, label: 'Home', href: '#home' },
              { id: '2', icon: <VscBriefcase size={22} />, label: 'Work', href: '#services' },
              { id: '3', icon: <VscCode size={22} />, label: 'Code', href: '#playground' },
              { id: '4', icon: <VscLayers size={22} />, label: 'Team', href: '#identity' },
              { id: '5', icon: <VscMail size={22} />, label: 'Mail', href: '#contact' },
            ]}
          />
        </div>
      )}
    </main>
  );
}
