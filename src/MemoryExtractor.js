// components/MemoryExtractor.js

/**
 * Memory Extractor Module
 * Analyzes chat messages and extracts structured user information
 */

class MemoryExtractor {
  /**
   * Main extraction method
   * @param {Array} messages - Array of message objects with text and timestamp
   * @returns {Object} Structured memory object
   */
  static async extractMemory(messages) {
    const conversationText = messages.map(m => m.text).join('\n');

    const systemPrompt = `You are a memory extraction AI. Analyze chat messages and extract structured user information.

Your task:
1. Identify explicit and implicit user preferences
2. Detect emotional patterns and their triggers
3. Extract important facts about the user
4. Infer personality traits
5. Determine communication style

Return ONLY valid JSON with NO markdown formatting, backticks, or explanations.

Required JSON structure:
{
  "preferences": [
    {
      "category": "string (Work/Lifestyle/Technology/Diet/Recreation/Communication)",
      "preference": "string (clear, specific preference)",
      "confidence": "high|medium|low"
    }
  ],
  "emotional_patterns": [
    {
      "pattern": "string (the emotional pattern)",
      "triggers": ["string (what causes this)"],
      "frequency": "string (how often: recurring/occasional/common/emerging)"
    }
  ],
  "facts": [
    {
      "category": "string (Personal/Background/Professional/Social/Wellness/Goals/Learning)",
      "fact": "string (clear, specific fact)",
      "importance": "high|medium|low"
    }
  ],
  "personality_traits": ["string (trait 1)", "string (trait 2)", ...],
  "communication_style": "string (description of how they communicate)"
}

Focus on:
- Quality over quantity
- Specific, actionable insights
- Confidence based on evidence strength
- Patterns that emerge across multiple messages`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          system: systemPrompt,
          messages: [{
            role: "user",
            content: `Analyze these messages and extract user memory:\n\n${conversationText}`
          }]
        })
      });

      const data = await response.json();
      const content = data.content[0].text.trim();
      
      // Clean any markdown formatting
      const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
      const memory = JSON.parse(cleanJson);
      
      // Validate structure
      return this.validateMemoryStructure(memory);
    } catch (error) {
      console.error("Memory extraction error:", error);
      return this.getFallbackMemory(conversationText);
    }
  }

  /**
   * Validates and sanitizes extracted memory structure
   * @param {Object} memory - Raw memory object
   * @returns {Object} Validated memory object
   */
  static validateMemoryStructure(memory) {
    return {
      preferences: Array.isArray(memory.preferences) ? memory.preferences : [],
      emotional_patterns: Array.isArray(memory.emotional_patterns) ? memory.emotional_patterns : [],
      facts: Array.isArray(memory.facts) ? memory.facts : [],
      personality_traits: Array.isArray(memory.personality_traits) ? memory.personality_traits : [],
      communication_style: memory.communication_style || "Not enough data to determine"
    };
  }

  /**
   * Provides basic fallback memory extraction using pattern matching
   * @param {string} text - Conversation text
   * @returns {Object} Basic memory structure
   */
  static getFallbackMemory(text) {
    const preferences = [];
    const facts = [];
    const emotionalPatterns = [];

    // Simple pattern matching for common expressions
    if (text.includes('love') || text.includes('enjoy')) {
      const matches = text.match(/I (love|enjoy) ([^.,!?]+)/gi) || [];
      matches.forEach(match => {
        preferences.push({
          category: "Recreation",
          preference: match,
          confidence: "medium"
        });
      });
    }

    if (text.includes('stressed') || text.includes('worried') || text.includes('anxious')) {
      emotionalPatterns.push({
        pattern: "Experiences stress and anxiety",
        triggers: ["work pressure", "deadlines"],
        frequency: "recurring"
      });
    }

    return {
      preferences,
      emotional_patterns: emotionalPatterns,
      facts,
      personality_traits: ["Self-aware", "Reflective"],
      communication_style: "Conversational and expressive",
      note: "Fallback extraction - AI service unavailable"
    };
  }

  /**
   * Extracts key insights summary from memory
   * @param {Object} memory - Extracted memory object
   * @returns {Object} Key insights
   */
  static getKeyInsights(memory) {
    return {
      topPreferences: memory.preferences
        .filter(p => p.confidence === 'high')
        .slice(0, 5),
      criticalFacts: memory.facts
        .filter(f => f.importance === 'high'),
      primaryEmotionalConcerns: memory.emotional_patterns
        .filter(p => p.frequency === 'recurring' || p.frequency === 'common')
    };
  }

  /**
   * Formats memory for context injection
   * @param {Object} memory - Extracted memory object
   * @returns {string} Formatted context string
   */
  static formatMemoryContext(memory) {
    if (!memory) return '';

    const sections = [];

    if (memory.preferences.length > 0) {
      const topPrefs = memory.preferences
        .filter(p => p.confidence === 'high' || p.confidence === 'medium')
        .slice(0, 5)
        .map(p => p.preference)
        .join(', ');
      sections.push(`Key Preferences: ${topPrefs}`);
    }

    if (memory.facts.length > 0) {
      const importantFacts = memory.facts
        .filter(f => f.importance === 'high')
        .map(f => f.fact)
        .join(', ');
      if (importantFacts) {
        sections.push(`Important Facts: ${importantFacts}`);
      }
    }

    if (memory.emotional_patterns.length > 0) {
      const patterns = memory.emotional_patterns
        .map(p => p.pattern)
        .join(', ');
      sections.push(`Emotional Patterns: ${patterns}`);
    }

    if (memory.personality_traits.length > 0) {
      sections.push(`Personality: ${memory.personality_traits.join(', ')}`);
    }

    if (memory.communication_style) {
      sections.push(`Communication Style: ${memory.communication_style}`);
    }

    return sections.join('\n');
  }
}

export default MemoryExtractor;