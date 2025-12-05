// src/App.js
import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, MessageSquare, FileText, Play } from 'lucide-react';
import MemoryExtractor from './components/MemoryExtractor';
import PersonalityEngine from './components/PersonalityEngine';
import ChatHistory from './components/ChatHistory';
import MemoryDisplay from './components/MemoryDisplay';
import { TEST_CASES } from './data/testCases';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [extractedMemory, setExtractedMemory] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState('default');
  const [activeTab, setActiveTab] = useState('extract');

  useEffect(() => {
    loadTestCase('default');
  }, []);

  const loadTestCase = (caseId) => {
    const testCase = TEST_CASES.find(tc => tc.id === caseId);
    if (testCase) {
      setMessages(testCase.messages.map((msg, idx) => ({
        id: idx,
        text: msg,
        timestamp: new Date(Date.now() - (testCase.messages.length - idx) * 86400000).toISOString()
      })));
      setSelectedTestCase(caseId);
      setExtractedMemory(null);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const memory = await MemoryExtractor.extractMemory(messages);
    setExtractedMemory(memory);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">AI Memory & Personality Engine</h1>
          </div>
          <p className="text-gray-600 text-lg">Modular system for memory extraction and personality transformation</p>
        </div>

        {/* Test Case Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Test Cases
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEST_CASES.map((testCase) => (
              <button
                key={testCase.id}
                onClick={() => loadTestCase(testCase.id)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedTestCase === testCase.id
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{testCase.icon}</span>
                  <h3 className="font-bold text-gray-800">{testCase.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{testCase.description}</p>
                <p className="text-xs text-gray-400 mt-2">{testCase.messages.length} messages</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-xl shadow-lg">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('extract')}
              className={`flex-1 py-4 px-6 font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'extract'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Brain className="w-5 h-5" />
              Memory Extraction
            </button>
            <button
              onClick={() => setActiveTab('personality')}
              className={`flex-1 py-4 px-6 font-semibold transition flex items-center justify-center gap-2 ${
                activeTab === 'personality'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              disabled={!extractedMemory}
            >
              <Sparkles className="w-5 h-5" />
              Personality Engine
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-xl shadow-lg p-6">
          {activeTab === 'extract' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChatHistory 
                messages={messages}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
              />
              <MemoryDisplay extractedMemory={extractedMemory} />
            </div>
          ) : (
            <PersonalityEngine extractedMemory={extractedMemory} />
          )}
        </div>

        {/* Architecture Info */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4 text-xl">System Architecture</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">1. Chat History</h4>
              <p className="text-sm text-blue-800">Manages conversation data with timestamps</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <h4 className="font-bold text-green-900 mb-2">2. Memory Extractor</h4>
              <p className="text-sm text-green-800">Analyzes and structures user information</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <h4 className="font-bold text-purple-900 mb-2">3. Memory Display</h4>
              <p className="text-sm text-purple-800">Visualizes extracted memories</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
              <h4 className="font-bold text-pink-900 mb-2">4. Personality Engine</h4>
              <p className="text-sm text-pink-800">Transforms responses by personality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;