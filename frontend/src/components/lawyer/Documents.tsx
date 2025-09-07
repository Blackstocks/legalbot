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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  FolderOpen,
  FileImage,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  File,
  Plus,
  Clock,
  User,
  Calendar,
  Tag,
  Share2,
  Lock,
  Unlock,
  Star,
  StarOff,
  Grid3X3,
  List,
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  modifiedDate: string;
  uploadedBy: string;
  caseNumber?: string;
  clientName?: string;
  tags: string[];
  status: "draft" | "final" | "archived";
  isConfidential: boolean;
  isFavorite: boolean;
  category: "contracts" | "pleadings" | "correspondence" | "evidence" | "research" | "other";
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Johnson_vs_State_Initial_Complaint.pdf",
    type: "pdf",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    modifiedDate: "2024-01-15",
    uploadedBy: "You",
    caseNumber: "2024-CV-0123",
    clientName: "Robert Johnson",
    tags: ["complaint", "civil-rights"],
    status: "final",
    isConfidential: true,
    isFavorite: true,
    category: "pleadings",
  },
  {
    id: "2",
    name: "Merger_Agreement_ABC_Corp_Draft.docx",
    type: "docx",
    size: "1.8 MB",
    uploadDate: "2024-02-20",
    modifiedDate: "2024-03-10",
    uploadedBy: "Team",
    caseNumber: "2024-BUS-0234",
    clientName: "ABC Corporation",
    tags: ["contract", "merger", "draft"],
    status: "draft",
    isConfidential: true,
    isFavorite: false,
    category: "contracts",
  },
  {
    id: "3",
    name: "Legal_Research_Precedents.pdf",
    type: "pdf",
    size: "5.2 MB",
    uploadDate: "2024-03-05",
    modifiedDate: "2024-03-05",
    uploadedBy: "You",
    tags: ["research", "precedents"],
    status: "final",
    isConfidential: false,
    isFavorite: true,
    category: "research",
  },
  {
    id: "4",
    name: "Client_Meeting_Recording.mp3",
    type: "mp3",
    size: "45.3 MB",
    uploadDate: "2024-03-15",
    modifiedDate: "2024-03-15",
    uploadedBy: "You",
    clientName: "Sarah Smith",
    tags: ["meeting", "audio"],
    status: "final",
    isConfidential: true,
    isFavorite: false,
    category: "correspondence",
  },
  {
    id: "5",
    name: "Evidence_Photos.zip",
    type: "zip",
    size: "128.7 MB",
    uploadDate: "2024-03-18",
    modifiedDate: "2024-03-18",
    uploadedBy: "You",
    caseNumber: "2023-CR-0789",
    clientName: "Michael Williams",
    tags: ["evidence", "photos"],
    status: "final",
    isConfidential: true,
    isFavorite: false,
    category: "evidence",
  },
];

const getFileIcon = (type: string) => {
  const iconMap: { [key: string]: any } = {
    pdf: FileText,
    docx: FileText,
    doc: FileText,
    xls: FileSpreadsheet,
    xlsx: FileSpreadsheet,
    jpg: FileImage,
    png: FileImage,
    mp3: FileAudio,
    mp4: FileVideo,
    zip: FolderOpen,
  };
  return iconMap[type] || File;
};

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.clientName && doc.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.caseNumber && doc.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: documents.length,
    totalSize: "215.4 MB",
    confidential: documents.filter(d => d.isConfidential).length,
    favorites: documents.filter(d => d.isFavorite).length,
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Handle file upload
      setShowUploadDialog(true);
    }
  };

  const toggleFavorite = (docId: string) => {
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === docId ? { ...doc, isFavorite: !doc.isFavorite } : doc
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Documents Management</h1>
          <p className="text-muted-foreground mt-1">Organize and manage all your legal documents</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Size</p>
              <p className="text-2xl font-bold">{stats.totalSize}</p>
            </div>
            <FolderOpen className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Confidential</p>
              <p className="text-2xl font-bold">{stats.confidential}</p>
            </div>
            <Lock className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Favorites</p>
              <p className="text-2xl font-bold">{stats.favorites}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search documents, tags, cases, or clients..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="contracts">Contracts</SelectItem>
              <SelectItem value="pleadings">Pleadings</SelectItem>
              <SelectItem value="correspondence">Correspondence</SelectItem>
              <SelectItem value="evidence">Evidence</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="final">Final</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Documents Display with Drag and Drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            : "border-transparent"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {viewMode === "list" ? (
          /* List View */
          <div className="space-y-2">
            {filteredDocuments.map((document) => {
              const Icon = getFileIcon(document.type);
              return (
                <Card 
                  key={document.id} 
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedDocument(document)}
                >
                  <div className="flex items-center gap-4">
                    {/* File Icon */}
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${
                      document.category === "contracts" ? "from-blue-500 to-blue-600" :
                      document.category === "pleadings" ? "from-purple-500 to-purple-600" :
                      document.category === "evidence" ? "from-green-500 to-green-600" :
                      document.category === "research" ? "from-orange-500 to-orange-600" :
                      "from-gray-500 to-gray-600"
                    }`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate">{document.name}</p>
                        {document.isConfidential && (
                          <Lock className="h-3 w-3 text-red-500" />
                        )}
                        {document.isFavorite && (
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{document.size}</span>
                        {document.caseNumber && (
                          <span>Case: {document.caseNumber}</span>
                        )}
                        {document.clientName && (
                          <span>Client: {document.clientName}</span>
                        )}
                        <span>Modified: {document.modifiedDate}</span>
                      </div>
                    </div>

                    {/* Status and Tags */}
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          document.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                          document.status === "final" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {document.status}
                      </Badge>
                      {document.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{document.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(document.id);
                        }}
                      >
                        {document.isFavorite ? (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => {
              const Icon = getFileIcon(document.type);
              return (
                <Card 
                  key={document.id} 
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedDocument(document)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${
                        document.category === "contracts" ? "from-blue-500 to-blue-600" :
                        document.category === "pleadings" ? "from-purple-500 to-purple-600" :
                        document.category === "evidence" ? "from-green-500 to-green-600" :
                        document.category === "research" ? "from-orange-500 to-orange-600" :
                        "from-gray-500 to-gray-600"
                      }`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-sm">{document.name}</p>
                        <p className="text-xs text-muted-foreground">{document.size}</p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(document.id);
                      }}
                    >
                      {document.isFavorite ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2 mb-3">
                    {document.caseNumber && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <FolderOpen className="h-3 w-3" />
                        <span>Case: {document.caseNumber}</span>
                      </div>
                    )}
                    {document.clientName && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{document.clientName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Modified: {document.modifiedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      className={
                        document.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                        document.status === "final" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {document.status}
                    </Badge>
                    {document.isConfidential && (
                      <Badge className="bg-red-100 text-red-800">
                        <Lock className="h-3 w-3 mr-1" />
                        Confidential
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground">No documents found</p>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload and categorize your legal documents
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
              <p className="text-sm text-muted-foreground">Support for PDF, Word, Images, and more</p>
              <Button className="mt-4">Choose Files</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
                    <SelectItem value="contracts">Contracts</SelectItem>
                    <SelectItem value="pleadings">Pleadings</SelectItem>
                    <SelectItem value="correspondence">Correspondence</SelectItem>
                    <SelectItem value="evidence">Evidence</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Related Case</label>
                <Input placeholder="Case number" className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Tags</label>
              <Input placeholder="Enter tags separated by commas" className="mt-1" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Mark as confidential</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowUploadDialog(false)}>
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}