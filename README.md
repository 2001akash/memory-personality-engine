# AI Memory & Personality Engine

A modular React application that demonstrates advanced AI companion capabilities through memory extraction and personality transformation.

## 🎯 Features

### 1. Memory Extraction Module
- **User Preferences**: Identifies likes, dislikes, and habits with confidence scoring
- **Emotional Patterns**: Detects recurring emotional states, triggers, and frequencies
- **Important Facts**: Categorizes biographical and contextual information by importance
- **Personality Traits**: Infers character traits from conversation patterns
- **Communication Style**: Analyzes how users prefer to communicate

### 2. Personality Engine
Transforms AI responses across 5 distinct personalities:
- 🤖 **Neutral Assistant** - Professional and balanced
- 🧘 **Calm Mentor** - Wise, patient, reflective
- 😄 **Witty Friend** - Casual, humorous, relatable
- 💙 **Empathetic Therapist** - Compassionate and validating
- 💪 **Motivational Coach** - Energetic and action-oriented

### 3. Test Cases
6 comprehensive test scenarios:
- 💻 Tech Professional (default)
- 🎓 College Student
- 🚀 Startup Founder
- 🎨 Creative Professional
- ⚕️ Healthcare Worker
- 🌻 Active Retiree

## 📁 Project Structure

```
memory-personality-engine/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ChatHistory.js          # Chat message display
│   │   ├── MemoryDisplay.js        # Memory visualization
│   │   ├── MemoryExtractor.js      # Memory analysis logic
│   │   └── PersonalityEngine.js    # Personality transformation
│   ├── data/
│   │   └── testCases.js            # Test data & sample queries
│   ├── App.js                      # Main application component
│   ├── App.css                     # Global styles
│   └── index.js                    # Entry point
├── package.json
└── README.md
```

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/memory-personality-engine.git
cd memory-personality-engine

# Install dependencies
npm install

# Install required packages
npm install lucide-react
```

### Development

```bash
# Start development server
npm start

# Build for production
npm run build
```

## 🏗️ Architecture

### Component Breakdown

#### 1. **App.js** (Main Controller)
- Manages application state
- Handles test case selection
- Coordinates tab navigation between Memory Extraction and Personality Engine

#### 2. **ChatHistory.js** (Data Display)
- Displays chat messages with timestamps
- Groups messages by date
- Shows conversation statistics
- Triggers memory extraction

#### 3. **MemoryExtractor.js** (Core Logic)
- Analyzes conversation text using Claude AI
- Extracts structured memory data
- Provides fallback parsing
- Formats memory for context injection

#### 4. **MemoryDisplay.js** (Visualization)
- Visualizes extracted memories
- Filters by confidence and importance
- Shows distribution statistics
- Interactive memory exploration

#### 5. **PersonalityEngine.js** (Transformation)
- Generates personality-specific responses
- Injects memory context into prompts
- Compares before/after responses
- Demonstrates personality differences

#### 6. **testCases.js** (Test Data)
- 6 diverse user scenarios
- 30 messages per scenario
- Sample queries for testing
- Realistic conversation patterns

## 🧠 How It Works

### Memory Extraction Process

1. **Input**: Array of chat messages with text and timestamps
2. **Analysis**: Claude AI analyzes patterns, preferences, and emotions
3. **Structuring**: JSON output with categorized information
4. **Validation**: Data validation and error handling
5. **Output**: Structured memory object ready for use

### Memory Structure

```javascript
{
  preferences: [
    {
      category: "Work|Lifestyle|Technology|...",
      preference: "Specific preference text",
      confidence: "high|medium|low"
    }
  ],
  emotional_patterns: [
    {
      pattern: "Emotional pattern description",
      triggers: ["trigger1", "trigger2"],
      frequency: "recurring|occasional|common|emerging"
    }
  ],
  facts: [
    {
      category: "Personal|Background|Professional|...",
      fact: "Specific fact",
      importance: "high|medium|low"
    }
  ],
  personality_traits: ["trait1", "trait2", ...],
  communication_style: "Description of style"
}
```

### Personality Transformation Process

1. **Context Building**: Format extracted memory into context string
2. **Prompt Engineering**: Apply personality-specific system prompts
3. **Memory Injection**: Add user context to personalize responses
4. **Generation**: Claude AI generates personality-appropriate response
5. **Comparison**: Display all 5 personalities side-by-side

## 🎨 Design Principles

### Modular Architecture
- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components can be used independently
- **Maintainability**: Clear structure makes updates easy
- **Testability**: Isolated modules are easier to test

### Prompt Engineering
- **System Prompts**: Define personality characteristics and tone
- **Context Injection**: User memory enhances personalization
- **Structured Output**: JSON format ensures parseable responses
- **Fallback Handling**: Graceful degradation when API fails

### User Experience
- **Progressive Loading**: Show responses as they generate
- **Visual Feedback**: Loading states and animations
- **Filtering**: Confidence and importance filters
- **Comparison**: Side-by-side personality differences

## 🔧 Configuration

### API Integration
The application uses the Claude AI API through the browser fetch interface. No API key configuration needed when running on claude.ai.

For local development with your own API key:
```javascript
// In MemoryExtractor.js and PersonalityEngine.js
headers: {
  "Content-Type": "application/json",
  "x-api-key": "your-api-key-here",
  "anthropic-version": "2023-06-01"
}
```

## 📊 Test Cases Details

### 1. Tech Professional (Default)
- 30 messages about work-life balance
- Stress patterns around deadlines
- Technical preferences (Python, remote work)
- Mental health awareness (meditation, therapy)

### 2. College Student
- Academic pressure and social life
- Career uncertainty (Psychology → Neuroscience)
- Part-time work and financial concerns
- Social anxiety and personal growth

### 3. Startup Founder
- High-stress entrepreneurial journey
- Funding, team building, product development
- Work-life balance challenges
- Strategic decision-making pressure

### 4. Creative Professional
- Freelance designer lifestyle
- Income instability concerns
- ADHD management and mental health
- Creative process and social media presence

### 5. Healthcare Worker
- ICU nurse with compassion fatigue
- Family-work balance struggles
- Emotional toll of patient care
- Faith and support systems

### 6. Active Retiree
- Life transition after 35-year career
- New hobbies and learning
- Family relationships (grandchildren)
- Aging and mortality awareness

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### GitHub Pages

```bash
# Add homepage to package.json
"homepage": "https://yourusername.github.io/memory-personality-engine"

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts to package.json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

## 🧪 Testing Scenarios

### Scenario 1: Memory Extraction Quality
1. Load "Tech Professional" test case
2. Click "Extract Memory"
3. Verify all 4 memory categories populated
4. Check confidence/importance distributions
5. Review personality traits accuracy

### Scenario 2: Personality Differentiation
1. Extract memory from any test case
2. Go to "Personality Engine" tab
3. Use sample query "I'm feeling overwhelmed..."
4. Generate all personality responses
5. Compare tone, approach, and language differences

### Scenario 3: Context Personalization
1. Load different test cases (student vs retiree)
2. Extract memory for each
3. Use same query for both
4. Observe how responses differ based on user context

## 📈 Performance Considerations

- **Sequential Generation**: Personalities generate one at a time for visual feedback
- **Memory Caching**: Extracted memory persists across personality generations
- **Error Handling**: Fallback memory extraction when API unavailable
- **Responsive Design**: Works on mobile, tablet, and desktop

## 🔒 Privacy & Security

- **No Data Storage**: All processing happens in-browser
- **No Backend**: Direct API calls from frontend
- **No Tracking**: No analytics or user tracking
- **Temporary Memory**: Resets when page refreshes

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- Additional personality archetypes
- More sophisticated memory extraction
- Memory persistence across sessions
- Advanced filtering and search
- Export/import memory profiles

## 💻 Live Link: https://2001akash.github.io/memory-personality-engine/
