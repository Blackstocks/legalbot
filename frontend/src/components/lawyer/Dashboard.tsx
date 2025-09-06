"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FolderOpen,
  UserCheck,
  FileText,
  Clock,
  TrendingUp,
  Calendar,
  MessageSquare,
  Gavel,
  Shield,
  BookOpen,
  FileSearch,
  Scale,
  ArrowRight,
  ChartBar,
} from "lucide-react";

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const stats = [
    { label: "Active Cases", value: "24", change: "+12%", icon: FolderOpen, color: "from-blue-500 to-blue-600" },
    { label: "Clients", value: "152", change: "+8%", icon: UserCheck, color: "from-purple-500 to-purple-600" },
    { label: "Documents", value: "1,284", change: "+24%", icon: FileText, color: "from-green-500 to-green-600" },
    { label: "Billable Hours", value: "342h", change: "+15%", icon: Clock, color: "from-orange-500 to-orange-600" },
  ];

  const recentActivities = [
    { action: "New case filed", case: "Johnson vs. State", time: "2 hours ago", type: "case" },
    { action: "Document uploaded", case: "Smith Estate", time: "4 hours ago", type: "document" },
    { action: "Client message", case: "ABC Corp Merger", time: "5 hours ago", type: "message" },
    { action: "Court date set", case: "Doe vs. Roe", time: "Yesterday", type: "calendar" },
  ];

  const quickActions = [
    { label: "New Case", icon: FolderOpen, color: "from-blue-500 to-blue-600", action: "cases" },
    { label: "Add Client", icon: UserCheck, color: "from-purple-500 to-purple-600", action: "clients" },
    { label: "Upload Document", icon: FileText, color: "from-green-500 to-green-600", action: "documents" },
    { label: "Schedule Event", icon: Calendar, color: "from-orange-500 to-orange-600", action: "calendar" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Your legal practice at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="p-6 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => {
              if (index === 0) onNavigate("cases");
              else if (index === 1) onNavigate("clients");
              else if (index === 2) onNavigate("documents");
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-24 flex-col gap-2 hover:shadow-md transition-all hover:border-indigo-500"
              onClick={() => onNavigate(action.action)}
            >
              <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color}`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'case' ? 'bg-blue-100 dark:bg-blue-900/20' :
                    activity.type === 'document' ? 'bg-green-100 dark:bg-green-900/20' :
                    activity.type === 'message' ? 'bg-purple-100 dark:bg-purple-900/20' :
                    'bg-orange-100 dark:bg-orange-900/20'
                  }`}>
                    {activity.type === 'case' ? <Gavel className="h-4 w-4 text-blue-600 dark:text-blue-400" /> :
                     activity.type === 'document' ? <FileText className="h-4 w-4 text-green-600 dark:text-green-400" /> :
                     activity.type === 'message' ? <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" /> :
                     <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.case}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* AI Assistant Card */}
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Legal Assistant</h2>
              <p className="text-sm text-muted-foreground">Advanced tools for legal professionals</p>
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full justify-between group hover:shadow-md transition-all" 
              variant="outline"
              onClick={() => onNavigate("research")}
            >
              <span className="flex items-center gap-2">
                <FileSearch className="h-4 w-4" />
                Advanced Document Analysis
              </span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button 
              className="w-full justify-between group hover:shadow-md transition-all" 
              variant="outline"
              onClick={() => onNavigate("research")}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Case Law Research
              </span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button 
              className="w-full justify-between group hover:shadow-md transition-all" 
              variant="outline"
            >
              <span className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Contract Generator
              </span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button 
              className="w-full justify-between group hover:shadow-md transition-all" 
              variant="outline"
              onClick={() => onNavigate("analytics")}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Case Outcome Predictor
              </span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Upcoming Events</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate("calendar")}
          >
            View Calendar
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Court Hearing - Johnson vs. State</p>
                <p className="text-xs text-muted-foreground">Tomorrow at 9:00 AM</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Details</Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <UserCheck className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Client Meeting - Sarah Smith</p>
                <p className="text-xs text-muted-foreground">March 25 at 2:00 PM</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Details</Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Filing Deadline - ABC Corp Documents</p>
                <p className="text-xs text-muted-foreground">March 30</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Details</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}