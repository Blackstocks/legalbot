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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Edit,
  Eye,
  Trash2,
  Building,
  User,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: "individual" | "corporate";
  status: "active" | "inactive";
  joinedDate: string;
  lastContact: string;
  totalCases: number;
  activeCases: number;
  totalBilled: number;
  avatarUrl?: string;
  company?: string;
  notes?: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Robert Johnson",
    email: "robert.johnson@email.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Los Angeles, CA 90001",
    type: "individual",
    status: "active",
    joinedDate: "2023-06-15",
    lastContact: "2024-03-15",
    totalCases: 3,
    activeCases: 1,
    totalBilled: 45000,
  },
  {
    id: "2",
    name: "Sarah Smith",
    email: "sarah.smith@email.com",
    phone: "(555) 234-5678",
    address: "456 Oak Ave, San Francisco, CA 94102",
    type: "individual",
    status: "active",
    joinedDate: "2024-01-10",
    lastContact: "2024-03-18",
    totalCases: 1,
    activeCases: 1,
    totalBilled: 12000,
  },
  {
    id: "3",
    name: "ABC Corporation",
    email: "legal@abccorp.com",
    phone: "(555) 345-6789",
    address: "789 Business Park, San Jose, CA 95110",
    type: "corporate",
    status: "active",
    joinedDate: "2022-11-20",
    lastContact: "2024-03-10",
    totalCases: 8,
    activeCases: 2,
    totalBilled: 125000,
    company: "ABC Corporation",
  },
  {
    id: "4",
    name: "Michael Williams",
    email: "m.williams@email.com",
    phone: "(555) 456-7890",
    address: "321 Pine St, Sacramento, CA 95814",
    type: "individual",
    status: "inactive",
    joinedDate: "2023-03-05",
    lastContact: "2023-12-20",
    totalCases: 2,
    activeCases: 0,
    totalBilled: 28000,
  },
  {
    id: "5",
    name: "Tech Innovations Inc.",
    email: "contact@techinnovations.com",
    phone: "(555) 567-8901",
    address: "555 Tech Way, Palo Alto, CA 94301",
    type: "corporate",
    status: "active",
    joinedDate: "2023-08-12",
    lastContact: "2024-03-20",
    totalCases: 5,
    activeCases: 3,
    totalBilled: 87000,
    company: "Tech Innovations Inc.",
  },
];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === "active").length,
    individual: clients.filter(c => c.type === "individual").length,
    corporate: clients.filter(c => c.type === "corporate").length,
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clients Management</h1>
          <p className="text-muted-foreground mt-1">Manage your client relationships and information</p>
        </div>
        <Dialog open={showNewClientDialog} onOpenChange={setShowNewClientDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the details for the new client below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Client Type</label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Full Name / Company</label>
                  <Input placeholder="Enter name" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" placeholder="email@example.com" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="(555) 123-4567" className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input placeholder="Street address, City, State ZIP" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <textarea 
                  className="w-full mt-1 p-3 border rounded-md min-h-[100px]"
                  placeholder="Additional notes about the client..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewClientDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowNewClientDialog(false)}>
                Add Client
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
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Clients</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Individual</p>
              <p className="text-2xl font-bold">{stats.individual}</p>
            </div>
            <User className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Corporate</p>
              <p className="text-2xl font-bold">{stats.corporate}</p>
            </div>
            <Building className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clients by name, email, phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <Card 
            key={client.id} 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedClient(client)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={client.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{client.name}</h3>
                  {client.company && (
                    <p className="text-sm text-muted-foreground">{client.company}</p>
                  )}
                </div>
              </div>
              <Badge 
                className={client.status === "active" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
                }
              >
                {client.status}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{client.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold">{client.totalCases}</p>
                <p className="text-xs text-muted-foreground">Total Cases</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{client.activeCases}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-lg font-bold">${(client.totalBilled / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Billed</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Client Details Dialog */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Client Details</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cases">Cases</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedClient.avatarUrl} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-2xl">
                      {getInitials(selectedClient.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                    {selectedClient.company && (
                      <p className="text-muted-foreground">{selectedClient.company}</p>
                    )}
                    <Badge 
                      className={selectedClient.status === "active" 
                        ? "bg-green-100 text-green-800 mt-2" 
                        : "bg-gray-100 text-gray-800 mt-2"
                      }
                    >
                      {selectedClient.status} client
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.address}</span>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h3 className="font-semibold mb-3">Client Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client Since:</span>
                        <span className="font-medium">{selectedClient.joinedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Contact:</span>
                        <span className="font-medium">{selectedClient.lastContact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Client Type:</span>
                        <span className="font-medium capitalize">{selectedClient.type}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="cases" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Client Cases</h3>
                  <Button size="sm">New Case</Button>
                </div>
                <div className="space-y-2">
                  <Card className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Johnson vs. State</p>
                        <p className="text-sm text-muted-foreground">Case #2024-CV-0123 • Civil Rights</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="billing" className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Billing Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">${selectedClient.totalBilled.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Billed</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">$0</p>
                      <p className="text-sm text-muted-foreground">Outstanding</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="notes" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Client Notes</h3>
                  <Button size="sm">Add Note</Button>
                </div>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">No notes available for this client.</p>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}