// src/components/MemoryDisplay.js

import React, { useState } from 'react';
import { 
  Lightbulb, Settings, Heart, User, Brain, 
  TrendingUp, AlertCircle, CheckCircle, Filter 
} from 'lucide-react';

const MemoryDisplay = ({ extractedMemory }) => {
  const [filterConfidence, setFilterConfidence] = useState('all');
  const [filterImportance, setFilterImportance] = useState('all');

  if (!extractedMemory) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Extracted Memory
        </h2>
        <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center p-8">
            <Brain className="w-20 h-20 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No Memory Extracted Yet</p>
            <p className="text-sm mt-2">Click "Extract Memory" to analyze chat history</p>
            <div className="mt-6 bg-white rounded-lg p-4 max-w-md mx-auto border border-gray-200">
              <p className="text-xs text-gray-600 text-left">
                <strong>What we extract:</strong>
              </p>
              <ul className="text-xs text-gray-600 text-left mt-2 space-y-1">
                <li>• User preferences and likes/dislikes</li>
                <li>• Emotional patterns and triggers</li>
                <li>• Important facts and background</li>
                <li>• Personality traits and communication style</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter preferences by confidence
  const filteredPreferences = extractedMemory.preferences.filter(pref => 
    filterConfidence === 'all' || pref.confidence === filterConfidence
  );

  // Filter facts by importance
  const filteredFacts = extractedMemory.facts.filter(fact =>
    filterImportance === 'all' || fact.importance === filterImportance
  );

  // Get confidence distribution
  const confidenceStats = {
    high: extractedMemory.preferences.filter(p => p.confidence === 'high').length,
    medium: extractedMemory.preferences.filter(p => p.confidence === 'medium').length,
    low: extractedMemory.preferences.filter(p => p.confidence === 'low').length
  };

  // Get importance distribution
  const importanceStats = {
    high: extractedMemory.facts.filter(f => f.importance === 'high').length,
    medium: extractedMemory.facts.filter(f => f.importance === 'medium').length,
    low: extractedMemory.facts.filter(f => f.importance === 'low').length
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          Extracted Memory
        </h2>
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-green-700 font-medium">Analysis Complete</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-200">
          <p className="text-lg font-bold text-blue-900">
            {extractedMemory.preferences.length}
          </p>
          <p className="text-xs text-blue-700">Preferences</p>
        </div>
        <div className="bg-pink-50 rounded-lg p-2 text-center border border-pink-200">
          <p className="text-lg font-bold text-pink-900">
            {extractedMemory.emotional_patterns.length}
          </p>
          <p className="text-xs text-pink-700">Patterns</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 text-center border border-purple-200">
          <p className="text-lg font-bold text-purple-900">
            {extractedMemory.facts.length}
          </p>
          <p className="text-xs text-purple-700">Facts</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 text-center border border-green-200">
          <p className="text-lg font-bold text-green-900">
            {extractedMemory.personality_traits.length}
          </p>
          <p className="text-xs text-green-700">Traits</p>
        </div>
      </div>

      {/* Memory Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {/* Preferences Section */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              User Preferences ({filteredPreferences.length})
            </h3>
            <select
              value={filterConfidence}
              onChange={(e) => setFilterConfidence(e.target.value)}
              className="text-xs border border-blue-300 rounded px-2 py-1 bg-white"
            >
              <option value="all">All ({extractedMemory.preferences.length})</option>
              <option value="high">High ({confidenceStats.high})</option>
              <option value="medium">Medium ({confidenceStats.medium})</option>
              <option value="low">Low ({confidenceStats.low})</option>
            </select>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredPreferences.map((pref, idx) => (
              <div key={idx} className="bg-white p-2 rounded shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-700 flex-1">{pref.preference}</p>
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                    pref.confidence === 'high' ? 'bg-green-100 text-green-700' :
                    pref.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {pref.confidence}
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-1 inline-block">
                  {pref.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Patterns Section */}
        <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
          <h3 className="font-bold text-pink-900 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Emotional Patterns ({extractedMemory.emotional_patterns.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {extractedMemory.emotional_patterns.map((pattern, idx) => (
              <div key={idx} className="bg-white p-3 rounded shadow-sm">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-700">{pattern.pattern}</p>
                </div>
                <div className="ml-6">
                  <p className="text-xs text-gray-600">
                    <strong>Triggers:</strong> {pattern.triggers.join(', ')}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-pink-600" />
                    <span className="text-xs text-pink-700 font-medium">
                      {pattern.frequency}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Facts Section */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-purple-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Important Facts ({filteredFacts.length})
            </h3>
            <select
              value={filterImportance}
              onChange={(e) => setFilterImportance(e.target.value)}
              className="text-xs border border-purple-300 rounded px-2 py-1 bg-white"
            >
              <option value="all">All ({extractedMemory.facts.length})</option>
              <option value="high">High ({importanceStats.high})</option>
              <option value="medium">Medium ({importanceStats.medium})</option>
              <option value="low">Low ({importanceStats.low})</option>
            </select>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredFacts.map((fact, idx) => (
              <div key={idx} className="bg-white p-2 rounded shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-gray-700 flex-1">{fact.fact}</p>
                  <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                    fact.importance === 'high' ? 'bg-red-100 text-red-700' :
                    fact.importance === 'medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {fact.importance}
                  </span>
                </div>
                <span className="text-xs text-gray-500 mt-1 inline-block">
                  {fact.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Personality Traits Section */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Personality Profile
          </h3>
          <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
            <p className="text-xs text-gray-600 font-medium mb-2">Traits:</p>
            <div className="flex flex-wrap gap-2">
              {extractedMemory.personality_traits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-xs text-gray-600 font-medium mb-2">
              Communication Style:
            </p>
            <p className="text-sm text-gray-700">
              {extractedMemory.communication_style}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryDisplay;