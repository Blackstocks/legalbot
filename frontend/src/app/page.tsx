"use client";

import { useState, FormEvent, useRef, useEffect } from 'react';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const exampleQuestions = [
  "What are my rights if I'm stopped by the police?",
  "How do I file for divorce?",
  "What is intellectual property law?",
  "Can you explain contract law in simple terms?",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setFilePreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    } else {
      setFilePreviewUrl(null);
    }
  }, [selectedFile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return; // Don't submit if both are empty

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Handle text message submission
      if (input.trim()) {
        const response = await fetch('http://localhost:8000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage.text }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botMessage: Message = { text: data.reply, sender: 'bot' };
        setMessages((prev) => [...prev, botMessage]);
      }

      // Handle file upload submission
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await fetch('http://localhost:8000/api/uploadfile', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('File upload failed');
        }

        const uploadData = await uploadResponse.json();
        const uploadMessage: Message = { text: `File uploaded: ${uploadData.filename}`, sender: 'bot' };
        setMessages((prev) => [...prev, uploadMessage]);
        setSelectedFile(null); // Clear selected file after upload
      }

    } catch (error) {
      console.error('There was a problem with the operation:', error);
      const errorMessage: Message = { text: 'Error: Could not process your request.', sender: 'bot' };
      setMessages((prev) => [...prev, errorMessage]);
    }
    finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput('');
    setSelectedFile(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-[15%] bg-gray-900 text-gray-100 p-4 flex flex-col justify-between shadow-lg">
        <div>
          <h1 className="text-xl font-semibold mb-6">Legalbot</h1>
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Chat
          </button>
          {/* Future: Chat history or other navigation */}
        </div>
        {/* Optional: User settings/profile at the bottom */}
      </div>

      {/* Right Main Content */}
      <div className="w-[85%] flex flex-col bg-gray-50">
        <header className="bg-white text-gray-800 p-4 flex justify-center items-center shadow-sm border-b border-gray-200">
          <h2 className="text-xl font-semibold">Legalbot Chat</h2>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 px-4">
              <h2 className="text-4xl font-extrabold mb-4 text-gray-800">Welcome to Legalbot!</h2>
              <p className="text-lg mb-8 text-gray-700">Your AI assistant for legal inquiries.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(question)}
                    className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg shadow-sm p-4 text-left transition-colors duration-200"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] px-4 py-2 rounded-lg shadow-md bg-gray-200 text-gray-800">
                Typing...
              </div>
            </div>
          )}
        </main>

        <footer className="bg-white border-t border-gray-200 p-4 shadow-lg">
          {selectedFile && (
            <div className="text-sm text-gray-600 mb-2 flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex items-center space-x-2">
                {filePreviewUrl ? (
                  <img src={filePreviewUrl} alt="File Preview" className="h-10 w-10 object-cover rounded-md" />
                ) : selectedFile.type === 'application/pdf' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L14.414 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h7V6.414L12.414 4H6zM10 8a1 1 0 011 1v3a1 1 0 11-2 0V9a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L14.414 5A2 2 0 0115 6.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h7V6.414L12.414 4H6z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{selectedFile.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors duration-200"
              title="Upload File"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13.5" />
              </svg>
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ask Legalbot a question..."
              disabled={loading || selectedFile !== null}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || (!input.trim() && !selectedFile)}
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
}
