"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Trash2,
  Download,
  Upload,
} from "lucide-react";

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  client: string;
  type: string;
  status: "active" | "pending" | "closed" | "on-hold";
  priority: "high" | "medium" | "low";
  dateOpened: string;
  lastActivity: string;
  nextHearing?: string;
  assignedTo: string;
}

const mockCases: Case[] = [
  {
    id: "1",
    caseNumber: "2024-CV-0123",
    title: "Johnson vs. State of California",
    client: "Robert Johnson",
    type: "Civil Rights",
    status: "active",
    priority: "high",
    dateOpened: "2024-01-15",
    lastActivity: "2024-03-20",
    nextHearing: "2024-04-15",
    assignedTo: "You",
  },
  {
    id: "2",
    caseNumber: "2024-FAM-0456",
    title: "Smith Divorce Proceedings",
    client: "Sarah Smith",
    type: "Family Law",
    status: "pending",
    priority: "medium",
    dateOpened: "2024-02-20",
    lastActivity: "2024-03-18",
    assignedTo: "You",
  },
  {
    id: "3",
    caseNumber: "2023-CR-0789",
    title: "State vs. Williams",
    client: "Michael Williams",
    type: "Criminal Defense",
    status: "active",
    priority: "high",
    dateOpened: "2023-11-10",
    lastActivity: "2024-03-19",
    nextHearing: "2024-03-25",
    assignedTo: "You",
  },
  {
    id: "4",
    caseNumber: "2024-BUS-0234",
    title: "ABC Corp Merger Agreement",
    client: "ABC Corporation",
    type: "Corporate Law",
    status: "on-hold",
    priority: "low",
    dateOpened: "2024-01-05",
    lastActivity: "2024-02-28",
    assignedTo: "Team",
  },
  {
    id: "5",
    caseNumber: "2023-EST-0567",
    title: "Thompson Estate Planning",
    client: "Estate of James Thompson",
    type: "Estate Planning",
    status: "closed",
    priority: "low",
    dateOpened: "2023-09-15",
    lastActivity: "2024-01-30",
    assignedTo: "You",
  },
];

export default function Cases() {
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showNewCaseDialog, setShowNewCaseDialog] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const filteredCases = cases.filter((case_) => {
    const matchesSearch = 
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || case_.status === statusFilter;
    const matchesType = typeFilter === "all" || case_.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: Case["status"]) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      closed: { color: "bg-gray-100 text-gray-800", icon: XCircle },
      "on-hold": { color: "bg-orange-100 text-orange-800", icon: AlertCircle },
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} font-medium`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Case["priority"]) => {
    const priorityConfig = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-blue-100 text-blue-800",
    };
    
    return (
      <Badge className={`${priorityConfig[priority]} font-medium`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Badge>
    );
  };

  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === "active").length,
    pending: cases.filter(c => c.status === "pending").length,
    closed: cases.filter(c => c.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cases Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your legal cases</p>
        </div>
        <Dialog open={showNewCaseDialog} onOpenChange={setShowNewCaseDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>
                Enter the details for the new case below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Case Title</label>
                  <Input placeholder="Enter case title" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Case Number</label>
                  <Input placeholder="Auto-generated" disabled className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Client Name</label>
                  <Input placeholder="Enter client name" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Case Type</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civil">Civil Rights</SelectItem>
                      <SelectItem value="family">Family Law</SelectItem>
                      <SelectItem value="criminal">Criminal Defense</SelectItem>
                      <SelectItem value="corporate">Corporate Law</SelectItem>
                      <SelectItem value="estate">Estate Planning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Case Description</label>
                <textarea 
                  className="w-full mt-1 p-3 border rounded-md min-h-[100px]"
                  placeholder="Enter case description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Assigned To</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Myself</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewCaseDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowNewCaseDialog(false)}>
                Create Case
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Cases</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FolderOpen className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Cases</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Cases</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Closed Cases</p>
              <p className="text-2xl font-bold">{stats.closed}</p>
            </div>
            <XCircle className="h-8 w-8 text-gray-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search cases by title, number, or client..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Civil Rights">Civil Rights</SelectItem>
              <SelectItem value="Family Law">Family Law</SelectItem>
              <SelectItem value="Criminal Defense">Criminal Defense</SelectItem>
              <SelectItem value="Corporate Law">Corporate Law</SelectItem>
              <SelectItem value="Estate Planning">Estate Planning</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Cases Table */}
      <Card>
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Number</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Next Hearing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.map((case_) => (
                <TableRow key={case_.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-medium">{case_.caseNumber}</TableCell>
                  <TableCell className="max-w-xs truncate">{case_.title}</TableCell>
                  <TableCell>{case_.client}</TableCell>
                  <TableCell>{case_.type}</TableCell>
                  <TableCell>{getStatusBadge(case_.status)}</TableCell>
                  <TableCell>{getPriorityBadge(case_.priority)}</TableCell>
                  <TableCell>
                    {case_.nextHearing ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {case_.nextHearing}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedCase(case_)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Case Details Dialog */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Case Details: {selectedCase.caseNumber}</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Case Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span className="font-medium">{selectedCase.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="font-medium">{selectedCase.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{selectedCase.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        {getStatusBadge(selectedCase.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Priority:</span>
                        {getPriorityBadge(selectedCase.priority)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Important Dates</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date Opened:</span>
                        <span className="font-medium">{selectedCase.dateOpened}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Activity:</span>
                        <span className="font-medium">{selectedCase.lastActivity}</span>
                      </div>
                      {selectedCase.nextHearing && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Next Hearing:</span>
                          <span className="font-medium">{selectedCase.nextHearing}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assigned To:</span>
                        <span className="font-medium">{selectedCase.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Case Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    This case involves {selectedCase.client} in a {selectedCase.type.toLowerCase()} matter. 
                    The case was opened on {selectedCase.dateOpened} and is currently {selectedCase.status}.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Case Documents</h3>
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
                <div className="space-y-2">
                  <Card className="p-3 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Initial Complaint.pdf</p>
                        <p className="text-xs text-muted-foreground">Uploaded on Jan 15, 2024</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </Card>
                  <Card className="p-3 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Motion to Dismiss.pdf</p>
                        <p className="text-xs text-muted-foreground">Uploaded on Feb 10, 2024</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4" />
                    </Button>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="timeline" className="space-y-4">
                <h3 className="font-semibold mb-4">Case Timeline</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Case Opened</p>
                      <p className="text-sm text-muted-foreground">{selectedCase.dateOpened}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Initial Client Meeting</p>
                      <p className="text-sm text-muted-foreground">Jan 20, 2024</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Documents Filed</p>
                      <p className="text-sm text-muted-foreground">Feb 10, 2024</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Case Notes</h3>
                  <Button size="sm">Add Note</Button>
                </div>
                <div className="space-y-3">
                  <Card className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">Client Interview Notes</p>
                      <p className="text-xs text-muted-foreground">Jan 20, 2024</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Discussed case details with client. Key points include...
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-sm">Research Findings</p>
                      <p className="text-xs text-muted-foreground">Feb 5, 2024</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Found relevant precedent cases that support our position...
                    </p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}