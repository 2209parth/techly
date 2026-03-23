"use client";

import React, { useState, useEffect, useRef } from 'react';
import Plasma from '@/components/Plasma';
import DecryptedText from '@/components/DecryptedText';
import MagicNav from '@/components/MagicNav';
import MagicBento from '@/components/MagicBento';
import ChromaGrid from '@/components/ChromaGrid';
import TiltedCard from '@/components/TiltedCard';
import CardSwap, { Card } from '@/components/CardSwap';
import Dock from '@/components/Dock';
import { VscHome, VscCode, VscMail, VscLayers, VscBriefcase, VscPulse } from 'react-icons/vsc';

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

export default function Home() {
  const { width: windowWidth } = useWindowSize();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Start fading out the splash screen after 4 seconds (to accommodate 3s animation + buffer)
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 4000);

    // Remove it completely from DOM after 5 seconds
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);
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

  const chromaItems = [
    {
      image: "/founder_parth_patel.png",
      title: "Parth Patel",
      subtitle: "Founder",
      handle: "@parthmk85",
      borderColor: "#0065FF",
      gradient: "linear-gradient(145deg, #0065FF30, #000B1A)",
      url: "#"
    },
    {
      image: "https://i.pravatar.cc/300?img=12",
      title: "Utsav",
      subtitle: "CEO",
      handle: "@utsavceo",
      borderColor: "#0065FF",
      gradient: "linear-gradient(145deg, #0065FF30, #000B1A)",
      url: "#"
    },
    {
      image: "https://i.pravatar.cc/300?img=11",
      title: "Kaushik",
      subtitle: "CTO",
      handle: "@kaushikcto",
      borderColor: "#0065FF",
      gradient: "linear-gradient(145deg, #0065FF30, #000B1A)",
      url: "#"
    },
    {
      image: "https://i.pravatar.cc/300?img=68",
      title: "Dhruv",
      subtitle: "UI/UX Designer",
      handle: "@dhruvdesign",
      borderColor: "#0065FF",
      gradient: "linear-gradient(145deg, #0065FF30, #000B1A)",
      url: "#"
    },
    {
      image: "https://i.pravatar.cc/300?img=45",
      title: "Netra",
      subtitle: "Developer",
      handle: "@netradev",
      borderColor: "#0065FF",
      gradient: "linear-gradient(145deg, #0065FF30, #000B1A)",
      url: "#"
    },
    {
      image: "https://i.pravatar.cc/300?img=48",
      title: "Madhvi",
      subtitle: "Sales Manager",
      handle: "@madhvisales",
      borderColor: "#0065FF",
      gradient: "linear-gradient(145deg, #0065FF30, #000B1A)",
      url: "#"
    }
  ];

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
            } else {
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
      {showSplash && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#000510] transition-opacity duration-1000 ${fadeSplash ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-[#0065FF]/5 blur-[150px] pointer-events-none"></div>
          <div className="text-2xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(0,101,255,0.4)] z-10 font-mono tracking-widest text-center px-4">
            <DecryptedText
              text="Lets Build Your Dreams"
              speed={135}
              maxIterations={10}
              characters="0123456789!@#$%^&*"
              animateOn="view"
              revealDirection="start"
              sequential={true}
            />
          </div>
        </div>
      )}

      {/* Fixed Logo - Top Left */}
      <a href="/" className="fixed top-10 left-8 md:left-12 z-[60] hover:opacity-80 transition-opacity drop-shadow-2xl">
         <img src="/reallogo.png" alt="Techly Logo" className="h-14 md:h-16 w-auto" />
      </a>

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
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.95] max-w-4xl px-4">
                 <span className="text-white/90">We Build Digital Experiences </span>
                 <span className="text-[#0065FF]">That Grow Your Business.</span>
              </h1>
              
              <p className="text-gray-400 text-base md:text-lg max-w-xl mb-12 font-medium leading-relaxed mx-auto text-balance">
                Predictive intelligence designed to automate focus and mitigate risk across your entire workflow.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
                 <button className="flex items-center gap-3 px-12 py-5 bg-[#0065FF] text-white font-black rounded-2xl hover:bg-[#0055dd] transition-all transform hover:scale-[1.05] active:scale-95 shadow-2xl shadow-[#0065FF]/40">
                    Book a Demo
                    <div className="bg-white/20 p-1 rounded-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg></div>
                 </button>
                 <a href="#" className="flex items-center gap-3 text-lg font-bold tracking-tight hover:text-white transition-colors text-gray-400 group">
                    Learn More
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                 </a>
              </div>
            </div>

            {/* AI Chat & Suggestion - Bottom Right */}
            <div className={`fixed bottom-10 right-10 z-50 flex flex-col items-end gap-4 transition-all duration-500`}>
               {/* Chat Window */}
               {isChatOpen && (
                 <div className="w-[450px] h-[600px] bg-[#050505]/80 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-left animate-in zoom-in-95 fade-in slide-in-from-bottom-10 origin-bottom-right duration-300">
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

      {/* Interactive Coding Section */}
      <section id="playground" className="relative py-32 px-8 overflow-hidden bg-[#050505] border-t border-white/5">
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.3fr] gap-16 items-center">
               
               {/* Left Side - CTA (30%) */}
               <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0065FF]/10 border border-[#0065FF]/20 text-[#0065FF] text-[10px] font-black tracking-[0.2em] uppercase">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF] animate-pulse"></div>
                     Developer Preview
                  </div>
                  <h2 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-white">
                     Want to try some <span className="text-[#0065FF]">coding?</span>
                  </h2>
                  <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
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
                  
                  {/* Editor Window */}
                  <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
                     {/* Editor Header */}
                     <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                           </div>
                           <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
                           <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>
                              main.ts — Techly Workspace
                           </span>
                        </div>
                        <button 
                           onClick={() => runCode()}
                           className="px-4 py-1.5 bg-[#0065FF] hover:bg-[#0055dd] text-white text-[10px] font-black tracking-widest uppercase rounded-lg transition-all shadow-lg shadow-[#0065FF]/20 flex items-center gap-2 group/btn"
                        >
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="group-hover/btn:scale-110 transition-transform"><path d="M8 5v14l11-7z"/></svg>
                           Run Code
                        </button>
                     </div>

                     {/* AI Developer Input */}
                     <div className="px-6 py-3 bg-white/5 border-b border-white/5">
                        <form onSubmit={handleAICommand} className="relative group">
                           <div className="absolute -inset-1 bg-gradient-to-r from-[#0065FF]/20 to-purple-500/20 blur opacity-75 group-focus-within:opacity-100 transition-opacity rounded-xl"></div>
                           <div className="relative flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0065FF" strokeWidth="2.5" className="mr-3 shrink-0"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10h-10V2z" opacity="0.3"/></svg>
                              <input 
                                 type="text" 
                                 value={aiCommand}
                                 onChange={(e) => setAiCommand(e.target.value)}
                                 placeholder="Ask AI Developer to write code... (e.g. 'Write a C program to print hello world')" 
                                 className="w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none"
                              />
                              <div className="flex items-center gap-2 ml-2">
                                 <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Enter</span>
                              </div>
                           </div>
                        </form>
                     </div>

                     {/* Editor Content */}
                     <div className="flex-1 flex overflow-hidden">
                        {/* Line Numbers */}
                        <div className="w-12 py-6 bg-black/20 border-r border-white/5 flex flex-col items-center gap-2 text-[10px] font-mono text-gray-700 select-none">
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
                              className="absolute inset-0 w-full h-full bg-transparent p-6 font-mono text-sm leading-relaxed text-white caret-[#0065FF] resize-none focus:outline-none z-10"
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

         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0065FF]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#0065FF]/3 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </section>

       {/* Feature Stack Section */}
       <section className="relative py-32 px-4 md:px-8 bg-[#000510] overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-8 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-24">
               {/* Left Side: Header */}
               <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start pb-12">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0065FF]/10 border border-[#0065FF]/20 text-[#0065FF] text-[10px] font-black tracking-[0.2em] uppercase mb-8">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF]"></div>
                     Our Expertise
                  </div>
                  <h2 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white mb-8 text-center lg:text-left leading-[0.85]">
                     Our <br /> <span className="text-[#0065FF]">Services</span>
                  </h2>
                  <p className="text-white/40 text-sm font-medium uppercase tracking-[0.2em] max-w-xs text-center lg:text-left leading-relaxed">
                     Transforming ideas into high-performance digital reality through elite engineering.
                  </p>
               </div>

               {/* Right Side: CardSwap centered in its area */}
               <div className="w-full lg:w-[55%] flex justify-center items-center py-20 min-h-[600px] relative overflow-visible">
                  <CardSwap
                    cardDistance={isMobile ? 25 : 40}
                    verticalDistance={isMobile ? 35 : 50}
                    delay={3000}
                    width={isMobile ? 300 : isTablet ? 450 : 550}
                    height={isMobile ? 280 : isTablet ? 320 : 380}
                    pauseOnHover={true}
                    containerClassName="mx-auto"
                  >
                    {[
                      { title: 'Web Solutions', description: 'Bespoke Websites, Web Apps, and full-stack engineering.', label: 'Engineering', icon: <VscCode className="text-[#0065FF] text-2xl" /> },
                      { title: 'App Ecosystems', description: 'Native iOS/Android apps and cross-platform experiences.', label: 'Mobile', icon: <VscCode className="text-[#0065FF] text-2xl" /> },
                      { title: 'AI & Automation', description: 'Intelligent Chatbots, AI Movie Creation, and Business Automation.', label: 'Future Tech', icon: <VscPulse className="text-[#0065FF] text-2xl" /> },
                      { title: 'Digital Authority', description: 'Global SEO, API Integrations, and 24/7 Maintenance Support.', label: 'Growth', icon: <VscMail className="text-[#0065FF] text-2xl" /> },
                      { title: 'Value Sales', description: 'E-commerce, Course Selling, and High-ROI Digital Marketing.', label: 'Commerce', icon: <VscHome className="text-[#0065FF] text-2xl" /> },
                      { title: 'Design Excellence', description: 'Elite UI/UX and Brand Graphic Design.', label: 'Creative', icon: <VscCode className="text-[#0065FF] text-2xl" /> }
                    ].map((service, i) => (
                      <Card key={i} className="p-10 border-[#0065FF]/30 bg-[#060010]/90 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-center group">
                        <div className="mb-6">
                          <div className="w-12 h-12 rounded-xl bg-[#0065FF]/10 flex items-center justify-center mb-6 border border-[#0065FF]/20 group-hover:scale-110 transition-transform duration-500">
                            {service.icon}
                          </div>
                          <span className="text-[#0065FF] text-[10px] font-black uppercase tracking-[0.3em] mb-3 block opacity-70">{service.label}</span>
                          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">{service.title}</h3>
                          <p className="text-sm text-white/50 leading-relaxed font-medium">{service.description}</p>
                        </div>
                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Solutions Series 2026</span>
                          <div className="flex gap-1">
                            {[...Array(3)].map((_, j) => (
                              <div key={j} className={`w-1 h-1 rounded-full ${j === 0 ? 'bg-[#0065FF]' : 'bg-white/10'}`}></div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardSwap>
               </div>
            </div>
             </div>
         
         <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#0065FF]/5 blur-[120px] rounded-full -translate-x-1/2 opacity-50 pointer-events-none"></div>
      </section>
            {/* Identity Section - Full Width ChromaGrid */}
      <section id="identity" className="relative py-24 px-8 bg-[#000510] border-t border-white/5 overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
            <div className="flex flex-col items-center mb-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0065FF]/10 border border-[#0065FF]/20 text-[#0065FF] text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0065FF]"></div>
                The Visionaries
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white text-center leading-none">
                Our <span className="text-[#0065FF]">Leadership</span> Team
              </h2>
            </div>
            
            <div className="w-full min-h-[600px] relative">
               <ChromaGrid 
                 items={chromaItems}
                 radius={isMobile ? 200 : 300}
                 damping={0.45}
                 fadeOut={0.6}
                 ease="power3.out"
               />
            </div>
         </div>
         
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0065FF]/5 blur-[150px] rounded-full pointer-events-none"></div>
      </section>
   

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-8 bg-[#000510] overflow-hidden border-t border-white/5">
         {/* Background elements */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0065FF]/5 blur-[150px] rounded-full pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
               <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase">
                  Contact Us
               </h2>
               <p className="text-gray-400 text-lg max-w-xl md:text-right">
                  If you have any questions, please feel free to get in touch with us via phone, text, email, the form below, or even on social media!
               </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 mb-8">
               
               {/* Left: Form Card */}
               <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95 fade-in duration-1000 delay-200">
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#0065FF]/20 to-transparent blur-2xl opacity-50 rounded-3xl -z-10"></div>
                  <h3 className="text-sm font-black tracking-widest text-[#0065FF] uppercase mb-8">Get in Touch</h3>
                  
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-500">Name</label>
                           <input 
                              type="text" 
                              id="name" 
                              name="name" 
                              required 
                              placeholder="Enter your name" 
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                           />
                        </div>
                        <div className="space-y-2">
                           <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
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
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label htmlFor="business_name" className="text-xs font-bold uppercase tracking-widest text-gray-500">Business Name</label>
                           <input 
                              type="text" 
                              id="business_name" 
                              name="business_name" 
                              required 
                              placeholder="Your business or company" 
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                           />
                        </div>
                        <div className="space-y-2">
                           <label htmlFor="business_type" className="text-xs font-bold uppercase tracking-widest text-gray-500">Business Type</label>
                           <input 
                              type="text" 
                              id="business_type" 
                              name="business_type" 
                              required 
                              placeholder="e.g. E-commerce, SaaS, Clinic" 
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                           />
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
                        <input 
                           type="email" 
                           id="email" 
                           name="email" 
                           required 
                           placeholder="Enter your email" 
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors"
                        />
                     </div>
                     
                     <div className="space-y-2">
                        <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-500">Your Message</label>
                        <textarea 
                           id="message" 
                           name="message" 
                           required 
                           rows={4} 
                           placeholder="Tell us about how we can help..." 
                           className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#0065FF]/50 transition-colors resize-none"
                        ></textarea>
                     </div>
                     
                     <div className="pt-2 flex justify-start">
                        <button 
                           type="submit" 
                           disabled={isSubmittingContact}
                           className={`flex items-center gap-3 px-10 py-4 ${contactStatus === 'success' ? 'bg-[#28c840] hover:bg-[#28c840]' : contactStatus === 'error' ? 'bg-[#ff5f57] hover:bg-[#ff5f57]' : 'bg-[#0065FF] hover:bg-[#0055dd]'} text-white font-black rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl ${contactStatus === 'success' ? 'shadow-[#28c840]/20' : 'shadow-[#0065FF]/20'} disabled:opacity-75 disabled:hover:scale-100 uppercase tracking-widest text-xs`}
                        >
                           {isSubmittingContact ? 'Sending...' : contactStatus === 'success' ? 'Message Sent!' : contactStatus === 'error' ? 'Error Sending' : 'Send Message'}
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

      {/* Simple Footer */}
      <footer className="py-20 px-8 border-t border-white/5 text-center text-gray-600 bg-[#000510] pb-32">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <img src="/reallogo.png" alt="Techly Logo" className="h-8 w-auto opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
          <p className="text-[10px] tracking-[0.2em] font-bold uppercase">© 2026 TECHLY INTELLIGENCE. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Apple-Style Navigation Dock */}
      <div className="hidden md:block">
        <Dock 
          items={[
            { icon: <VscHome size={20} />, label: 'Home', onClick: () => scrollTo('home') },
            { icon: <VscBriefcase size={20} />, label: 'Services', onClick: () => scrollTo('services') },
            { icon: <VscCode size={20} />, label: 'Playground', onClick: () => scrollTo('playground') },
            { icon: <VscLayers size={20} />, label: 'Leadership', onClick: () => scrollTo('identity') },
            { icon: <VscMail size={20} />, label: 'Contact', onClick: () => scrollTo('contact') },
          ]}
          panelHeight={68}
          baseItemSize={54}
          magnification={80}
        />
      </div>
    </main>
  );
}
