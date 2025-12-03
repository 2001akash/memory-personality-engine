// components/PersonalityEngine.js

import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { SAMPLE_QUERIES } from '../data/testCases';
import MemoryExtractor from './MemoryExtractor';

/**
 * Personality definitions with detailed prompting strategies
 */
const PERSONALITIES = {
  neutral: {
    name: "Neutral Assistant",
    icon: "🤖",
    description: "Balanced, professional, informative",
    systemPrompt: `You are a neutral, professional AI assistant. 

Characteristics:
- Balanced and objective
- Clear and concise
- Informative without being overly formal
- Respectful and helpful
- Focus on facts and actionable information

Tone: Professional yet approachable
Style: Direct, organized, solution-oriented`
  },
  mentor: {
    name: "Calm Mentor",
    icon: "🧘",
    description: "Wise, patient, guiding",
    systemPrompt: `You are a wise, patient mentor with years of life experience.

Characteristics:
- Patient and understanding
- Share wisdom through stories and analogies
- Ask reflective questions
- Encourage self-discovery
- Speak thoughtfully and deliberately
- Use phrases like "Consider this...", "In my experience...", "Take a moment to reflect..."

Tone: Calm, warm, and reassuring
Style: Thoughtful pauses, gentle guidance, empowering questions`
  },
  friend: {
    name: "Witty Friend",
    icon: "😄",
    description: "Casual, humorous, relatable",
    systemPrompt: `You are a witty, supportive friend who gets it.

Characteristics:
- Casual and conversational
- Use appropriate humor and pop culture references
- Relatable and down-to-earth
- Honest but kind
- Share personal-style anecdotes
- Use phrases like "Dude,", "I totally get that", "Here's the thing...", "Real talk,"

Tone: Casual, warm, and genuine
Style: Conversational, occasional humor, very relatable`
  },
  therapist: {
    name: "Empathetic Therapist",
    icon: "💙",
    description: "Compassionate, reflective, supportive",
    systemPrompt: `You are an empathetic therapist trained in active listening and validation.

Characteristics:
- Deeply compassionate and non-judgmental
- Validate feelings before offering perspectives
- Ask open-ended questions
- Reflect back what you hear
- Create safe space for emotions
- Use phrases like "It sounds like...", "What I'm hearing is...", "That must feel...", "Help me understand..."

Tone: Gentle, validating, emotionally attuned
Style: Reflective listening, validation, exploratory questions`
  },
  coach: {
    name: "Motivational Coach",
    icon: "💪",
    description: "Energetic, encouraging, action-oriented",
    systemPrompt: `You are a high-energy motivational coach focused on action and results.

Characteristics:
- Energetic and enthusiastic
- Action-oriented and results-focused
- Break down goals into steps
- Celebrate wins and progress
- Challenge with encouragement
- Use phrases like "Let's do this!", "You've got this!", "Here's your game plan:", "First step:"

Tone: Energetic, inspiring, empowering
Style: Direct calls to action, structured plans, celebration of effort`
  }
};

const PersonalityEngine = ({ extractedMemory }) => {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePersonalities, setActivePersonalities] = useState(new Set());

  /**
   * Generates response for a specific personality
   */
  const generateResponse = async (personalityKey, userQuery) => {
    const personality = PERSONALITIES[personalityKey];
    const memoryContext = MemoryExtractor.formatMemoryContext(extractedMemory);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: personality.systemPrompt,
          messages: [{
            role: "user",
            content: `User Context (use this to personalize your response):
${memoryContext}

User Query: "${userQuery}"

Respond in character (2-4 paragraphs). Use the user context naturally to show you know them.`
          }]
        })
      });

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error(`Error generating ${personalityKey} response:`, error);
      return `I'm having trouble generating a response right now. Please try again.`;
    }
  };

  /**
   * Generates all personality responses
   */
  const handleGenerateAll = async () => {
    if (!query.trim()) return;

    setIsGenerating(true);
    setResponses({});
    setActivePersonalities(new Set());

    // Generate responses sequentially to show progressive loading
    for (const key of Object.keys(PERSONALITIES)) {
      setActivePersonalities(prev => new Set([...prev, key]));
      const response = await generateResponse(key, query);
      setResponses(prev => ({ ...prev, [key]: response }));
    }

    setIsGenerating(false);
  };

  /**
   * Loads a sample query
   */
  const loadSampleQuery = (sampleKey) => {
    setQuery(SAMPLE_QUERIES[sampleKey]);
    setResponses({});
    setActivePersonalities(new Set());
  };

  return (
    <div>
      {/* Query Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter a query to see personality-transformed responses:
        </label>
        
        {/* Sample Query Buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs text-gray-500 self-center">Quick samples:</span>
          {Object.keys(SAMPLE_QUERIES).map(key => (
            <button
              key={key}
              onClick={() => loadSampleQuery(key)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs transition"
            >
              {key}
            </button>
          ))}
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="E.g., I'm feeling overwhelmed with my project deadlines..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows="4"
        />
        
        <button
          onClick={handleGenerateAll}
          disabled={isGenerating || !query.trim()}
          className="mt-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Generating Responses...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generate All Personality Responses
            </>
          )}
        </button>
      </div>

      {/* Personality Response Grid */}
      {activePersonalities.size > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Before/After Comparison: Same Query, Different Personalities
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(PERSONALITIES).map(([key, personality]) => (
              <div
                key={key}
                className={`rounded-lg p-4 border-2 transition-all ${
                  activePersonalities.has(key)
                    ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300'
                    : 'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{personality.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{personality.name}</h3>
                    <p className="text-xs text-gray-500">{personality.description}</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 min-h-48 max-h-96 overflow-y-auto">
                  {responses[key] ? (
                    <div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {responses[key]}
                      </p>
                      
                      {/* Response Metadata */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          <strong>Tone:</strong> {personality.systemPrompt.match(/Tone: (.+)/)?.[1] || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Style:</strong> {personality.systemPrompt.match(/Style: (.+)/)?.[1] || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ) : activePersonalities.has(key) ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                        <p className="text-xs text-gray-500">Generating response...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-400">
                      <p className="text-sm">Waiting to generate...</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Differences Analysis */}
      {Object.keys(responses).length === Object.keys(PERSONALITIES).length && (
        <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
          <h3 className="font-bold text-indigo-900 mb-3 text-lg">
            Key Personality Differences
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-900">
            <div>
              <strong>Tone Variations:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-indigo-800">
                <li>Neutral: Professional and balanced</li>
                <li>Mentor: Calm and reflective</li>
                <li>Friend: Casual and conversational</li>
              </ul>
            </div>
            <div>
              <strong>Approach Differences:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-indigo-800">
                <li>Therapist: Validates emotions first</li>
                <li>Coach: Action-oriented with clear steps</li>
                <li>All: Personalized using memory context</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalityEngine;