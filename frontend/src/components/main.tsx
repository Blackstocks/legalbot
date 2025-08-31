import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EnhancedLegalbotUI = () => {
  const router = useRouter();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInitialGreeting, setShowInitialGreeting] = useState(true);
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Particle animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => [
        ...prev.slice(-20),
        {
          id: Date.now(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          opacity: Math.random() * 0.5 + 0.1
        }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleExampleClick = (text) => {
    setMessages([{ sender: 'user', text }]);
    setShowInitialGreeting(false);
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: `I understand you need help with: "${text}". I'm analyzing your request and will provide comprehensive legal guidance based on current regulations and best practices.` 
      }]);
    }, 2000);
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-black overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255,255,255,0.03) 0%, transparent 50%)`
      }}
    >
      {/* Animated Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full pointer-events-none animate-pulse"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
            animation: `float 4s ease-in-out infinite`
          }}
        />
      ))}

      {/* Cursor Glow Effect */}
      <div 
        className="fixed w-96 h-96 pointer-events-none z-10 transition-opacity duration-300"
        style={{
          left: cursorPosition.x - 192,
          top: cursorPosition.y - 192,
          background: `radial-gradient(circle, rgba(255,255,255,${isHovering ? 0.1 : 0.05}) 0%, transparent 70%)`,
          borderRadius: '50%'
        }}
      />

      <main className="relative z-20 flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
          {showInitialGreeting && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
              
              {/* Enhanced Logo Section */}
              <div className="mb-16 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 blur-xl rounded-3xl transform group-hover:scale-110 transition-transform duration-700" />
                  <Card className="relative px-16 py-12 border border-white/20 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all duration-500 group-hover:border-white/40">
                    <h1 className="text-6xl font-thin text-white tracking-wider relative">
                      Legal
                      <span className="relative">
                        bot
                        <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
                      </span>
                    </h1>
                    <p className="text-white/60 mt-4 text-lg font-light">
                      AI-Powered Legal Intelligence
                    </p>
                  </Card>
                </div>
              </div>

              {/* Chat with PDF Button */}
              <div className="mb-8">
                <Button
                  onClick={() => router.push('/chat-pdf')}
                  className="bg-white text-black hover:bg-white/90 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-3"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <FileText className="h-5 w-5" />
                  Chat with Your Documents
                </Button>
              </div>

              {/* Auth Section - Signed Out State */}
              <div className="mb-16">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 blur-2xl rounded-2xl" />
                  <div className="relative backdrop-blur-sm border border-white/10 rounded-2xl p-8 bg-black/20">
                    <p className="text-white/70 mb-6 text-lg">
                      Sign in to access your personalized legal assistant
                    </p>
                    <div className="flex gap-6 justify-center">
                      <Button 
                        className="bg-white text-black hover:bg-white/90 px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:border-white/60"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Service Verticals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                {[
                  {
                    title: "Legal Services",
                    services: [
                      { text: "I need legal consultation for my business", icon: "⚖️" },
                      { text: "Can you review this document for me?", icon: "📄" }
                    ]
                  },
                  {
                    title: "Analysis & Research",
                    services: [
                      { text: "Analyze this contract for potential issues", icon: "🔍" },
                      { text: "Help me with legal research on intellectual property", icon: "🧠" }
                    ]
                  },
                  {
                    title: "Compliance & Cases",
                    services: [
                      { text: "Check my business for regulatory compliance", icon: "✅" },
                      { text: "Summarize this legal case for me", icon: "📊" }
                    ]
                  }
                ].map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-6">
                    <h3 className="text-white/80 text-lg font-medium text-center mb-4">
                      {category.title}
                    </h3>
                    <div className="space-y-4">
                      {category.services.map((service, index) => (
                        <div key={index} className="group relative">
                          <div className="absolute inset-0 bg-white/5 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <Button
                            onClick={() => handleExampleClick(service.text)}
                            variant="outline"
                            className="relative w-full justify-start text-sm bg-black/30 border-white/20 text-white/90 hover:bg-white/10 hover:border-white/40 p-4 h-auto rounded-xl transition-all duration-300 hover:scale-105"
                            onMouseEnter={() => setIsHovering(true)}
                            onMouseLeave={() => setIsHovering(false)}
                          >
                            <span className="mr-3 text-lg">{service.icon}</span>
                            <span className="text-left leading-relaxed">{service.text}</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 py-8">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-4 max-w-[80%] ${
                      msg.sender === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 blur-md rounded-full" />
                        <Avatar className="relative h-10 w-10 border border-white/30">
                          <AvatarFallback className="bg-black text-white text-sm font-medium">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-white/5 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Card
                        className={`relative px-6 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                          msg.sender === "user"
                            ? "bg-white text-black border-white/30"
                            : "bg-black/40 text-white border-white/20 hover:bg-black/60"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {loading && (
            <div className="flex justify-start py-6">
              <div className="flex gap-4 max-w-[80%]">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 blur-md rounded-full" />
                  <Avatar className="relative h-10 w-10 border border-white/30">
                    <AvatarFallback className="bg-black text-white text-sm font-medium">
                      AI
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Card className="px-6 py-4 bg-black/40 border-white/20 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 200}ms` }}
                      />
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(90deg); }
          50% { transform: translateY(-5px) rotate(180deg); }
          75% { transform: translateY(-15px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedLegalbotUI;