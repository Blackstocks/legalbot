"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Paperclip,
  Send,
  MessageSquare,
  FileText,
  Search,
  Shield,
  Sparkles,
  ArrowRight,
  Clock,
  X,
  Bot,
  User2,
  ChevronDown,
  Zap,
  Scale,
  BookOpen,
  FileSearch,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import React from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
  timestamp?: Date;
}

const exampleQuestions = [
  "What are my rights if I'm stopped by the police?",
  "How do I file for divorce?",
  "What is intellectual property law?",
  "Can you explain contract law in simple terms?",
];

function UserInfo() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="space-y-1">
      <div className="font-medium text-sm text-foreground">
        {user.fullName || user.firstName || "User"}
      </div>
      <div className="text-xs text-muted-foreground">
        {user.primaryEmailAddress?.emailAddress}
      </div>
    </div>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [showInitialGreeting, setShowInitialGreeting] = useState(true);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<
    { id: string; title: string; date: string; preview?: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFilePreviewUrl(null);
    }
  }, [selectedFile]);

  const { isSignedIn, user } = useUser();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      alert("Please sign in to use the chat feature");
      return;
    }

    if (!input.trim() && !selectedFile) return;

    const userMessage: Message = { 
      text: input, 
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);
    setShowInitialGreeting(false);

    // Add to chat history if new chat
    if (messages.length === 0) {
      const newChat = {
        id: Date.now().toString(),
        title: input.substring(0, 30) + (input.length > 30 ? '...' : ''),
        date: new Date().toLocaleDateString(),
        preview: input.substring(0, 50)
      };
      setChatHistory(prev => [newChat, ...prev]);
      setActiveChat(newChat.id);
    }

    try {
      if (input.trim()) {
        const response = await fetch("http://localhost:8000/v1/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage.text }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const botMessage: Message = { 
          text: data.reply, 
          sender: "bot",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botMessage]);
      }

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await fetch(
          "http://localhost:8000/v1/api/uploadfile",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("File upload failed");
        }

        const uploadData = await uploadResponse.json();
        const uploadMessage: Message = {
          text: `✅ File uploaded successfully: ${uploadData.filename}`,
          sender: "bot",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, uploadMessage]);
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("There was a problem with the operation:", error);
      const errorMessage: Message = {
        text: "⚠️ Error: Could not process your request. Please try again.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleExampleClick = async (question: string) => {
    if (!isSignedIn) {
      alert("Please sign in to use the chat feature");
      return;
    }

    setInput(question);
    const userMessage: Message = { 
      text: question, 
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setIsTyping(true);
    setShowInitialGreeting(false);

    try {
      const response = await fetch("http://localhost:8000/v1/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botMessage: Message = { 
        text: data.reply, 
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("There was a problem with the operation:", error);
      const errorMessage: Message = {
        text: "⚠️ Error: Could not process your request. Please try again.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setSelectedFile(null);
    setShowInitialGreeting(true);
    setActiveChat(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Enhanced Left Sidebar */}
      <div className="w-72 border-r bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col shadow-xl">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">LegalBot</span>
          </div>
          <p className="text-xs text-blue-100 mt-1">AI-Powered Legal Assistant</p>
        </div>
        
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full justify-start gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            <Plus className="h-4 w-4" />
            New Chat
            <Sparkles className="h-3 w-3 ml-auto" />
          </Button>
        </div>

        {/* Enhanced Chat History */}
        <ScrollArea className="flex-1 px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Chats
            </h3>
            <Clock className="h-3 w-3 text-muted-foreground" />
          </div>
          {chatHistory.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                No chat history yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Start a conversation to see it here
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 group ${
                    activeChat === chat.id
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className={`h-4 w-4 mt-0.5 ${
                      activeChat === chat.id 
                        ? "text-blue-600" 
                        : "text-muted-foreground group-hover:text-blue-600"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm">{chat.title}</div>
                      {chat.preview && (
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {chat.preview}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground/70 mt-1">{chat.date}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Enhanced Tools Section */}
        <div className="p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Tools
          </div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-sm group hover:bg-blue-50 dark:hover:bg-blue-900/20"
              size="sm"
            >
              <FileSearch className="h-4 w-4 mr-2 text-blue-600" />
              Document Analysis
              <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm group hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2 text-emerald-600" />
              Legal Research
              <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-sm group hover:bg-purple-50 dark:hover:bg-purple-900/20"
              size="sm"
            >
              <Shield className="h-4 w-4 mr-2 text-purple-600" />
              Contract Review
              <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Enhanced User Section */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
          <SignedOut>
            <div className="space-y-2">
              <SignInButton mode="modal">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" size="sm">
                  <User2 className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50" size="sm">
                  Sign up for free
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10"
                  }
                }}
              />
              <div className="flex-1">
                <UserInfo />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <div className="px-6 py-4 border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <SignedIn>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">
                    AI Assistant Online
                  </span>
                </div>
              </SignedIn>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Pro Features
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto flex flex-col bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/50">
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
            {showInitialGreeting && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fadeIn">
                {/* Enhanced Hero Section */}
                <div className="mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-3xl opacity-20"></div>
                    <Card className="relative px-12 py-8 border-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl">
                      <Scale className="h-16 w-16 mx-auto mb-4" />
                      <h1 className="text-5xl font-bold mb-2">
                        LegalBot AI
                      </h1>
                      <p className="text-blue-100">Your Intelligent Legal Assistant</p>
                    </Card>
                  </div>
                </div>

                <SignedOut>
                  <div className="mb-8 animate-slideUp">
                    <p className="text-lg text-muted-foreground mb-2">
                      Get instant legal guidance powered by AI
                    </p>
                    <p className="text-sm text-muted-foreground/70 mb-6">
                      Sign in to access personalized legal assistance
                    </p>
                    <div className="flex gap-4 justify-center">
                      <SignInButton mode="modal">
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-6 text-lg shadow-xl">
                          Get Started
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button
                          variant="outline"
                          className="border-2 border-blue-200 hover:bg-blue-50 px-8 py-6 text-lg"
                        >
                          Create Free Account
                        </Button>
                      </SignUpButton>
                    </div>
                  </div>
                </SignedOut>

                <SignedIn>
                  {/* Enhanced Service Cards */}
                  <div className="w-full max-w-6xl">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      How can I help you today?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Column 1 */}
                      <div className="space-y-3">
                        <Card 
                          onClick={() => handleExampleClick("I need legal consultation for my business")}
                          className="group cursor-pointer border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10"
                        >
                          <div className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Scale className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                  Legal Consultation
                                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Expert business legal advice
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                        <Card 
                          onClick={() => handleExampleClick("Can you review this document for me?")}
                          className="group cursor-pointer border-2 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10"
                        >
                          <div className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                                <FileText className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                  Document Review
                                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Professional document analysis
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-3">
                        <Card 
                          onClick={() => handleExampleClick("Analyze this contract for potential issues")}
                          className="group cursor-pointer border-2 hover:border-purple-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10"
                        >
                          <div className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Search className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                  Contract Analysis
                                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Detailed contract examination
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                        <Card 
                          onClick={() => handleExampleClick("Help me with legal research on intellectual property")}
                          className="group cursor-pointer border-2 hover:border-orange-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10"
                        >
                          <div className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                                <BookOpen className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                  Legal Research
                                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Comprehensive legal investigation
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-3">
                        <Card 
                          onClick={() => handleExampleClick("Check my business for regulatory compliance")}
                          className="group cursor-pointer border-2 hover:border-cyan-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-900/10 dark:to-sky-900/10"
                        >
                          <div className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Shield className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                  Compliance Check
                                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Regulatory compliance audit
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                        <Card 
                          onClick={() => handleExampleClick("Summarize this legal case for me")}
                          className="group cursor-pointer border-2 hover:border-rose-500 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/10 dark:to-pink-900/10"
                        >
                          <div className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
                                <CheckCircle className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                  Case Summary
                                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Legal case analysis & summary
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    
                  </div>
                </SignedIn>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    } animate-fadeIn`}
                  >
                    <div
                      className={`flex gap-3 max-w-[85%] ${
                        msg.sender === "user" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className="h-9 w-9 shadow-md">
                        {msg.sender === "bot" ? (
                          <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                            <User2 className="h-5 w-5" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <Card
                          className={`px-4 py-3 shadow-lg ${
                            msg.sender === "user"
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        </Card>
                        {msg.timestamp && (
                          <p className="text-xs text-muted-foreground mt-1 px-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-fadeIn">
                    <div className="flex gap-3 max-w-[85%]">
                      <Avatar className="h-9 w-9 shadow-md">
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                          <Bot className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <Card className="px-4 py-3 bg-white dark:bg-slate-800 shadow-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4">
          {selectedFile && (
            <div className="mb-3 animate-slideUp">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                {filePreviewUrl ? (
                  <img
                    src={filePreviewUrl}
                    alt="File Preview"
                    className="h-8 w-8 object-cover rounded"
                  />
                ) : (
                  <FileText className="h-5 w-5 text-blue-600" />
                )}
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {selectedFile.name}
                </span>
                <Button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="icon"
              className="hover:bg-blue-50 dark:hover:bg-blue-900/20 border-slate-300"
              title="Attach File"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,image/*"
            />
            <div className="flex-1 relative">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full pr-12 py-6 text-base border-2 focus:border-blue-500 transition-colors"
                placeholder="Ask me anything about legal matters..."
                disabled={loading}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button
                  type="submit"
                  disabled={loading || (!input.trim() && !selectedFile)}
                  size="icon"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
          
        </footer>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}