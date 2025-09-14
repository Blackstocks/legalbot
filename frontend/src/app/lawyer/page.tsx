"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Dashboard from "@/components/lawyer/Dashboard";
import Cases from "@/components/lawyer/Cases";
import Clients from "@/components/lawyer/Clients";
import Documents from "@/components/lawyer/Documents";
import Kanban from "@/components/lawyer/Kanban";
import {
  Briefcase,
  Users,
  FileSearch,
  BookOpen,
  Shield,
  Scale,
  ChartBar,
  Calendar,
  MessageSquare,
  FileText,
  Clock,
  TrendingUp,
  Gavel,
  FolderOpen,
  UserCheck,
  BellRing,
  ArrowRight,
  BarChart3,
  Settings,
  HelpCircle,
  User2,
} from "lucide-react";

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

export default function LawyerPage() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveSection} />;
      case "cases":
        return <Cases />;
      case "clients":
        return <Clients />;
      case "documents":
        return <Documents />;
      case "calendar":
        return <Kanban />;
      case "analytics":
        return (
          <div className="text-center py-12">
            <BarChart3 className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Analytics</h2>
            <p className="text-muted-foreground">Analytics feature coming soon</p>
          </div>
        );
      case "research":
        return (
          <div className="text-center py-12">
            <BookOpen className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Legal Research</h2>
            <p className="text-muted-foreground">Legal research feature coming soon</p>
          </div>
        );
      case "messages":
        return (
          <div className="text-center py-12">
            <MessageSquare className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Messages</h2>
            <p className="text-muted-foreground">Messages feature coming soon</p>
          </div>
        );
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Sidebar */}
      <div className="w-72 border-r bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex flex-col shadow-xl">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">LegalBot Pro</span>
          </div>
          <p className="text-xs text-indigo-100 mt-1">Professional Legal Platform</p>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                activeSection === "dashboard" 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => setActiveSection("dashboard")}
            >
              <ChartBar className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${
                activeSection === "cases" 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => setActiveSection("cases")}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Cases
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${
                activeSection === "clients" 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => setActiveSection("clients")}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Clients
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${
                activeSection === "documents" 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => setActiveSection("documents")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${
                activeSection === "calendar" 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => setActiveSection("calendar")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendar
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${
                activeSection === "analytics" 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => setActiveSection("analytics")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${
                activeSection === "research" 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => setActiveSection("research")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Legal Research
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${
                activeSection === "messages" 
                  ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              onClick={() => setActiveSection("messages")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
          </nav>
        </ScrollArea>

        <Separator />

        {/* Bottom Navigation */}
        <div className="p-4 space-y-1">
          <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            Help & Support
          </Button>
        </div>

        <Separator />

        {/* User Section */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50">
          <SignedOut>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Please sign in to continue</p>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Welcome back, {user?.fullName || user?.firstName || "Legal Professional"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon">
                <BellRing className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => router.push("/customer")}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  <Users className="h-4 w-4" />
                  Customer
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md"
                >
                  <Briefcase className="h-4 w-4" />
                  Lawyer
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/50 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}