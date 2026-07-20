import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Award, Compass, BookOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-0',
    sender: 'assistant',
    text: "Hello! I am your AI Career Coach. I specialize in designing step-by-step curriculum roadmaps, interview preparation strategies, and resume optimization tips tailored for Indian students and global remote aspirants. How can I guide your career today?",
    timestamp: '12:12 PM'
  }
];

const PRESETS = [
  {
    label: '🗺️ Software Engineer Roadmap',
    prompt: 'Suggest a roadmap to become a Frontend Engineer',
    response: 'To transition into a Frontend Engineer in 2026, focus on building modern interactive products. I have structured a 4-month path centered on high-intent industry practices.',
    type: 'roadmap',
    steps: [
      { title: 'Month 1: Static Mastery & CSS layout', desc: 'Master semantic HTML5, modern flexbox, and CSS grid layout models. Learn Tailwind CSS.', duration: '4 weeks' },
      { title: 'Month 2: TypeScript & Modern JS', desc: 'Transition from JavaScript to TypeScript. Focus on type safety, interfaces, async/await, and APIs.', duration: '4 weeks' },
      { title: 'Month 3: React 19 Core & Router', desc: 'Learn functional state, form actions, server-actions, and performance optimizations with Vite.', duration: '4 weeks' },
      { title: 'Month 4: Real-world Portfolio Projects', desc: 'Build 3 complex apps with APIs. Optimize for fast loading times and host on Vercel.', duration: '4 weeks' },
    ]
  },
  {
    label: '🏦 Government Exams Strategy',
    prompt: 'How do I prepare for Government Bank PO exams?',
    response: 'Banking recruitment (SBI PO, IBPS) requires an intense speed-accuracy balance. Start with a structured daily section split.',
    type: 'roadmap',
    steps: [
      { title: 'Phase 1: Concepts & Formulas', desc: 'Focus on Quantitative Aptitude shortcut formulas (percentages, ratios) and high-scoring logical reasoning topics.', duration: '6 weeks' },
      { title: 'Phase 2: Speed Practice', desc: 'Take daily 20-minute sectional mock tests. Focus on English vocabulary and reading comprehension speed.', duration: '4 weeks' },
      { title: 'Phase 3: Full Length Mocks', desc: 'Attempt full previous year papers. Review weak topics and analyze negative marks diligently.', duration: '4 weeks' },
    ]
  },
  {
    label: '💰 Salary Negotiation Tips',
    prompt: 'Give me tips for salary negotiations in Bengaluru',
    response: 'Negotiation is a conversation of confidence and market data. Use these strategies to raise offers in tech hubs like Bengaluru or Mumbai.',
    type: 'suggestions',
    steps: [
      { title: '1. Establish Market Value', desc: 'Utilize specialized tools like Glassdoor and local peers to find standard compensation levels for your exact experience band.', duration: 'Step 1' },
      { title: '2. Postpone Numbers', desc: 'Let the recruiter name their budget first. Use phrases like: "I am open to competitive compensation based on the scope of the role."', duration: 'Step 2' },
      { title: '3. Anchor to Value', desc: 'When presenting counter-proposals, reiterate your exact technical value, immediate roadmap contributions, and project deliveries.', duration: 'Step 3' },
    ]
  }
];

export default function AICareerCoach() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleSendMessage = (text: string, isPreset = false) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setThinking(true);

    // Simulate AI thinking and generating a customized structured response
    setTimeout(() => {
      setThinking(false);

      // Check if it matches a preset
      const presetMatch = PRESETS.find(p => p.prompt.toLowerCase() === text.toLowerCase() || (isPreset && text.includes(p.label.split(' ').slice(1).join(' '))));

      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        sender: 'assistant',
        text: presetMatch 
          ? presetMatch.response 
          : `That is a great career query! For "${text}", the most critical path involves: 1) Identifying core skills, 2) Building a high-fidelity portfolio, and 3) Consistently engaging in targeted community networking. Let me build a custom actionable milestone map for you below:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: presetMatch ? (presetMatch.type as any) : 'roadmap',
        roadmapSteps: presetMatch ? presetMatch.steps : [
          { title: 'Step 1: Foundational Audit', desc: 'Conduct a personal audit of your current skills against top job listings in this domain.', duration: 'Week 1' },
          { title: 'Step 2: Practical Deliverable', desc: 'Construct a unique, fully documented project that proves your domain capabilities.', duration: 'Weeks 2-4' },
          { title: 'Step 3: Strategic Outreach', desc: 'Reach out to 5 senior engineers or team leaders in your targeted companies with concise, high-intent messages.', duration: 'Ongoing' }
        ]
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
  };

  return (
    <div id="career-coach-section" className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-[600px] overflow-hidden">
      {/* Coach Header */}
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 font-sans">
              JOB Lo Career Coach
            </h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online • AI Mentor v2.1
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white border border-gray-100 px-2 py-1 rounded">
            <Compass className="w-3.5 h-3.5" /> India / Global
          </span>
        </div>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-4xl ${msg.sender === 'user' ? 'justify-end ml-auto' : ''}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-3 max-w-[85%]">
                {/* Bubble content */}
                <div
                  className={`p-4 rounded-xl text-sm leading-relaxed shadow-3xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap font-sans">{msg.text}</p>
                  <span className={`block text-[10px] mt-2 text-right ${msg.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Sub-structures (Timeline roadmaps / suggestion lists) */}
                {msg.sender === 'assistant' && msg.roadmapSteps && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" /> 
                        Custom Actionable Milestones
                      </h4>
                      <span className="text-3xs text-gray-400 font-mono">Bespoke Roadmap</span>
                    </div>

                    <div className="relative border-l-2 border-emerald-100 ml-2.5 pl-5 space-y-5">
                      {msg.roadmapSteps.map((step, idx) => (
                        <div key={idx} className="relative group">
                          {/* Circle node indicator */}
                          <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-white border-2 border-emerald-500 group-hover:bg-emerald-500 transition-colors duration-200" />
                          
                          <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <h5 className="text-sm font-bold text-gray-900">{step.title}</h5>
                              <span className="inline-flex text-3xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full w-fit">
                                {step.duration}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white shrink-0 mt-0.5 font-bold text-xs font-mono">
                  U
                </div>
              )}
            </motion.div>
          ))}

          {thinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 max-w-4xl"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-200/80 rounded-xl rounded-bl-none p-4 shadow-3xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                <span className="text-xs text-gray-500 font-medium font-mono">AI Coach is drafting a tailored action plan...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Preset Chips & Input Bar */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3 shrink-0">
        {/* Chips */}
        {messages.length === 1 && (
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block px-1">
              Ask your Career Coach directly or click a recommendation:
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(preset.prompt, true)}
                  className="text-xs bg-white hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-300 transition-all shadow-3xs flex items-center gap-1 font-medium"
                >
                  {preset.label}
                  <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-emerald-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={thinking}
            placeholder="Type a query (e.g., How can I get into linear or build a stellar SaaS portfolio?)"
            className="flex-1 bg-white text-sm text-gray-900 border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-4 py-2.5 focus:outline-hidden shadow-2xs transition-colors"
          />
          <button
            type="submit"
            disabled={thinking || !inputText.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-lg shadow-xs hover:shadow-sm transition-all flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
