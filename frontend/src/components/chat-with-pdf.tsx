"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Upload, Send, FileText, Trash2, BarChart } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UploadedFile {
  name: string;
  chunks: number;
}

export default function ChatWithPDF() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stats, setStats] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side validation for file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'pdf') {
      setMessages([...messages, {
        role: 'assistant',
        content: 'Only PDF files are supported. Please upload a PDF file.'
      }]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Client-side validation for file size (1MB = 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setMessages([...messages, {
        role: 'assistant',
        content: `File size exceeds maximum allowed size of 1MB. Your file is ${fileSizeMB}MB`
      }]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/v1/api/uploadfile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // If it's a 413 error (file too large), parse the error message
        if (response.status === 413) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'File size exceeds maximum allowed size');
        }
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedFiles([...uploadedFiles, { name: data.filename, chunks: data.chunks_count }]);
      
      // Add system message
      setMessages([...messages, {
        role: 'assistant',
        content: `Successfully uploaded and indexed "${data.filename}" with ${data.chunks_count} chunks. You can now ask questions about this document!`
      }]);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file. Please try again.';
      setMessages([...messages, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages([...messages, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/v1/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDocuments = async () => {
    try {
      const response = await fetch('http://localhost:8000/v1/api/clear', {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedFiles([]);
        setMessages([]);
        setStats(null);
      }
    } catch (error) {
      console.error('Clear error:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/v1/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/10 bg-black/50 p-4 space-y-4">
        <Card className="bg-black/40 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Upload
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-white text-black hover:bg-white/90"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>

            {uploadedFiles.length > 0 && (
              <>
                <Separator className="bg-white/10" />
                <div className="space-y-2">
                  <p className="text-sm text-white/60">Uploaded Files:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="text-sm text-white/80 p-2 bg-white/5 rounded">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-white/60">{file.chunks} chunks</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button
                onClick={fetchStats}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Stats
              </Button>
              <Button
                onClick={handleClearDocuments}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>

            {stats && (
              <div className="text-xs text-white/60 p-2 bg-white/5 rounded">
                <p>Documents: {stats.document_count || 0}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="text-center text-white/40 py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Upload a PDF document to start chatting</p>
                <p className="text-sm mt-2">Only PDF files are supported (Max size: 1MB)</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 border border-white/20">
                      <AvatarFallback className="bg-black text-white text-xs">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <Card className={`${
                    message.role === 'user' 
                      ? 'bg-white text-black' 
                      : 'bg-black/40 text-white border-white/20'
                  }`}>
                    <CardContent className="p-4">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8 border border-white/20">
                    <AvatarFallback className="bg-black text-white text-xs">AI</AvatarFallback>
                  </Avatar>
                  <Card className="bg-black/40 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 200}ms` }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex gap-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question about your documents..."
              className="flex-1 bg-black/40 border-white/20 text-white placeholder:text-white/40"
            />
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-white text-black hover:bg-white/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}