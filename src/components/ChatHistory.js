// src/components/ChatHistory.js

import React from 'react';
import { MessageSquare, Brain, Calendar, Hash } from 'lucide-react';

const ChatHistory = ({ messages, onAnalyze, isAnalyzing }) => {
  /**
   * Groups messages by date for better organization
   */
  const groupMessagesByDate = (messages) => {
    const groups = {};
    
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    
    return groups;
  };

  /**
   * Gets stats about the message history
   */
  const getMessageStats = () => {
    if (messages.length === 0) return null;

    const timestamps = messages.map(m => new Date(m.timestamp).getTime());
    const earliest = new Date(Math.min(...timestamps));
    const latest = new Date(Math.max(...timestamps));
    const daySpan = Math.ceil((latest - earliest) / (1000 * 60 * 60 * 24));
    const avgLength = Math.round(
      messages.reduce((sum, m) => sum + m.text.length, 0) / messages.length
    );

    return {
      total: messages.length,
      daySpan,
      avgLength,
      earliest: earliest.toLocaleDateString(),
      latest: latest.toLocaleDateString()
    };
  };

  const stats = getMessageStats();
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          Chat History
        </h2>
        {stats && (
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {stats.total} messages
          </span>
        )}
      </div>

      {/* Message Statistics */}
      {stats && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <Hash className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-900 font-semibold">{stats.total}</p>
            <p className="text-xs text-blue-700">Messages</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <Calendar className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-900 font-semibold">{stats.daySpan}</p>
            <p className="text-xs text-green-700">Days Span</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <MessageSquare className="w-4 h-4 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-purple-900 font-semibold">{stats.avgLength}</p>
            <p className="text-xs text-purple-700">Avg Length</p>
          </div>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 space-y-4 mb-4 border border-gray-200">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No messages loaded</p>
              <p className="text-sm mt-2">Select a test case to begin</p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-xs text-gray-500 font-medium px-2">
                  {date}
                </span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              
              {/* Messages for this date */}
              <div className="space-y-2">
                {msgs.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition group"
                  >
                    <p className="text-gray-800 text-sm leading-relaxed">
                      {msg.text}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                        {msg.text.length} chars
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Analysis Button */}
      <button
        onClick={onAnalyze}
        disabled={isAnalyzing || messages.length === 0}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Analyzing Memory...
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" />
            Extract Memory from {messages.length} Messages
          </>
        )}
      </button>

      {/* Helper Text */}
      {!isAnalyzing && messages.length > 0 && (
        <p className="text-xs text-gray-500 text-center mt-2">
          AI will analyze conversation patterns, preferences, and emotional cues
        </p>
      )}
    </div>
  );
};

export default ChatHistory;