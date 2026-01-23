import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Heart, MessageCircle, Mic, MicOff, Home, User, Brain, Shield,
  Lightbulb, GraduationCap, Briefcase, Activity, Sprout, Wallet
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { useCredits } from '../context/CreditContext.jsx';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import CreditProgress from './CreditSystem/CreditProgress';
import CreditPopup from './CreditSystem/CreditPopup';

// Simple in-memory TTS queue manager
class TTSQueue {
  constructor(audioElement) {
    this.audioElement = audioElement;
    this.queue = [];
    this.running = false;
    this.lastPlayed = null;
  }

  enqueue(text, fetchAudioFn) {
    if (!text || !text.trim()) return;
    if (this.lastPlayed === text) return;
    this.queue.push({ text, fetchAudioFn });
    this._run();
  }

  async _run() {
    if (this.running) return;
    this.running = true;
    while (this.queue.length) {
      const { text, fetchAudioFn } = this.queue.shift();
      try {
        const arrayBuffer = await fetchAudioFn(text);
        if (!arrayBuffer) continue;
        try { if (this.audioElement.src) URL.revokeObjectURL(this.audioElement.src); } catch (e) { }
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        this.audioElement.src = url;
        try { this.audioElement.pause(); this.audioElement.currentTime = 0; } catch (e) { }
        try { await this.audioElement.play(); } catch (err) { console.error('Audio play blocked:', err); }
        await new Promise((resolve) => {
          const clean = () => { this.audioElement.removeEventListener('ended', clean); clearTimeout(timeoutHandle); resolve(); };
          this.audioElement.addEventListener('ended', clean);
          const timeoutHandle = setTimeout(() => { try { this.audioElement.pause(); } catch (e) { } resolve(); }, 60_000);
        });
        this.lastPlayed = text;
        try { URL.revokeObjectURL(url); this.audioElement.removeAttribute('src'); this.audioElement.load(); } catch (e) { }
      } catch (err) { console.error('TTS Queue item failed:', err); }
    }
    this.running = false;
  }
}

const fetchTTSAudioArrayBuffer = async (text) => {
  if (!text || !text.trim()) return null;
  try {
    const resp = await fetch('http://localhost:5000/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!resp.ok) return null;
    return await resp.arrayBuffer();
  } catch (err) { return null; }
};

const ThemeBackground = ({ category }) => {
  const patterns = {
    'Academic / Exam': (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-indigo-400/30"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: '24px',
            }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
    ),
    'Career & Jobs': (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-emerald-400/10"
            style={{
              width: '2px',
              height: '300px',
              left: `${10 + i * 12}%`,
              bottom: '-100px',
              borderRadius: 'full',
            }}
            animate={{
              y: [0, -400, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          />
        ))}
      </div>
    ),
    'Relationship': (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-rose-400/10 blur-3xl"
            style={{
              width: Math.random() * 400 + 200,
              height: Math.random() * 400 + 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: 'full',
            }}
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 50, -50, 0],
              y: [0, -50, 50, 0],
            }}
            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    ),
    'Health & Wellness': (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(3)].map((_, i) => (
          <motion.svg
            key={i}
            className="absolute w-full h-[400px]"
            style={{ top: `${20 + i * 25}%` }}
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0 50 Q 250 10 500 50 T 1000 50"
              fill="none"
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.1"
              animate={{
                d: [
                  "M0 50 Q 250 10 500 50 T 1000 50",
                  "M0 50 Q 250 90 500 50 T 1000 50",
                  "M0 50 Q 250 10 500 50 T 1000 50"
                ]
              }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.svg>
        ))}
      </div>
    ),
    'Personal Growth': (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-lime-400/20"
            style={{
              width: '4px',
              height: '4px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: 'full',
            }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>
    ),
    'Mental Health': (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-purple-400/5 blur-[100px]"
            style={{
              width: '600px',
              height: '600px',
              left: i % 2 === 0 ? '-10%' : '60%',
              top: i < 2 ? '-10%' : '50%',
              borderRadius: 'full',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    ),
    'Financial Stress': (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-amber-400/10"
            style={{
              width: Math.random() * 200 + 50,
              height: '1px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [-100, 100],
              opacity: [0, 1, 0],
            }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>
    )
  };

  return patterns[category] || patterns['Mental Health'];
};

const themeConfigs = {
  'Academic / Exam': {
    gradient: 'from-[#0f172a] via-[#1e1b4b] to-[#0f172a]',
    accent: 'bg-indigo-500',
    lightAccent: 'bg-indigo-100/10 text-indigo-300',
    icon: GraduationCap,
    welcome: "Hello dost! Exam tension ya padhai ki chinta? Don't worry, hum mil kar solution nikalenge. Kya chal raha hai mind mein?"
  },
  'Career & Jobs': {
    gradient: 'from-[#064e3b] via-[#022c22] to-[#064e3b]',
    accent: 'bg-emerald-500',
    lightAccent: 'bg-emerald-100/10 text-emerald-300',
    icon: Briefcase,
    welcome: "Hey! Career ki thodi tension hai kya? Interview ya job search ka stress share karna chahoge? Main sun raha hoon."
  },
  'Relationship': {
    gradient: 'from-[#9d174d] via-[#ec4899] to-[#9d174d]',
    accent: 'bg-rose-500',
    lightAccent: 'bg-rose-100/10 text-rose-200',
    icon: Heart,
    welcome: "Aao dost, baitho. Relationship issues dil pe bahut heavy hoti hain. Jo bhi feel kar rahe ho, khul kar batao, main sun raha hoon."
  },
  'Health & Wellness': {
    gradient: 'from-[#431407] via-[#7c2d12] to-[#431407]',
    accent: 'bg-orange-500',
    lightAccent: 'bg-orange-100/10 text-orange-300',
    icon: Activity,
    welcome: "Namaste! Fitness ya physical health ko le kar thode pareshan ho? Let's discuss how you're feeling today."
  },
  'Personal Growth': {
    gradient: 'from-[#14532d] via-[#064e3b] to-[#14532d]',
    accent: 'bg-lime-500',
    lightAccent: 'bg-lime-100/10 text-lime-300',
    icon: Sprout,
    welcome: "Hi! Khud ko behtar banana ek journey hai. Aaj kis specific habit ya growth area pe baat karein?"
  },
  'Mental Health': {
    gradient: 'from-[#2e1065] via-[#4c1d95] to-[#2e1065]',
    accent: 'bg-purple-500',
    lightAccent: 'bg-purple-100/10 text-purple-300',
    icon: Brain,
    welcome: "Hello. Aapka mental peace sabse precious hai. Anxiety ho ya mood swing, main yahan hoon aapke liye."
  },
  'Financial Stress': {
    gradient: 'from-[#451a03] via-[#78350f] to-[#451a03]',
    accent: 'bg-amber-500',
    lightAccent: 'bg-amber-100/10 text-amber-300',
    icon: Wallet,
    welcome: "Hey dost. Budgeting ya money worries kaafi stress dete hain. Let's break it down together, tension mat lo."
  }
};

const TherapySessionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category = 'Mental Health' } = location.state || {};
  const currentTheme = themeConfigs[category] || themeConfigs['Mental Health'];
  const CategoryIcon = currentTheme.icon;

  const { user, addTherapySession, setSadDetectionCount } = useApp();
  const { credits, consumeCredit, refreshCredits } = useCredits();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionStartTime] = useState(new Date());
  const [isTyping, setIsTyping] = useState(false);
  const [sessionPhase, setSessionPhase] = useState('Introduction');
  const [welcomeMessageSent, setWelcomeMessageSent] = useState(false);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const messagesEndRef = useRef(null);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition();
  const audioElRef = useRef(null);
  const ttsQueueRef = useRef(null);

  useEffect(() => {
    if (!audioElRef.current) {
      let audio = document.getElementById('tts-audio');
      if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'tts-audio';
        audio.style.display = 'none';
        document.body.appendChild(audio);
      }
      audioElRef.current = audio;
    }
    if (!ttsQueueRef.current && audioElRef.current) {
      ttsQueueRef.current = new TTSQueue(audioElRef.current);
    }
  }, []);

  useEffect(() => {
    if (transcript) setInputMessage(transcript);
  }, [transcript]);

  const getTherapeuticResponse = async (userMessage, messageHistory) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/get-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userMessage,
          messageHistory: messageHistory.slice(-6),
          category: category
        }),
      });

      if (response.status === 403) {
        setShowCreditPopup(true);
        return "Your free credits are used up 💛 Please recharge to continue our session.";
      }

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.therapistResponse;
    } catch (error) {
      return "Main thoda connection error face kar raha hoon, but main sun raha hoon. Please continue.";
    }
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }

    if (user && !welcomeMessageSent && ttsQueueRef.current) {
      const welcomeText = currentTheme.welcome;
      const initialMessage = {
        id: Date.now().toString(),
        text: welcomeText,
        sender: 'therapist',
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
      ttsQueueRef.current.enqueue(initialMessage.text, fetchTTSAudioArrayBuffer);
      setWelcomeMessageSent(true);
    }
  }, [user, navigate, welcomeMessageSent, currentTheme]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || credits <= 0) {
      if (credits <= 0) setShowCreditPopup(true);
      return;
    }

    // Deduct credit on server and update UI
    const success = await consumeCredit();
    if (!success) {
      setShowCreditPopup(true);
      return;
    }

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    const therapeuticResponse = await getTherapeuticResponse(inputMessage, [...messages, userMessage]);
    const audioBufferList = await fetchTTSAudioArrayBuffer(therapeuticResponse);

    setIsTyping(false);

    const therapistMessage = {
      id: (Date.now() + 1).toString(),
      text: therapeuticResponse,
      sender: 'therapist',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, therapistMessage]);
    if (audioBufferList) {
      ttsQueueRef.current?.enqueue(therapistMessage.text, async () => audioBufferList);
    }
  };

  const handleEndSession = () => {
    const session = {
      id: Date.now().toString(),
      date: sessionStartTime,
      duration: Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000 / 60),
      messages,
      category: category,
    };
    addTherapySession(session);
    setSadDetectionCount(0);
    navigate('/emotion-detection');
  };

  const toggleVoice = () => {
    if (isListening) stopListening(); else startListening();
  };

  const handleBuyCredits = () => {
    navigate('/buy-credits');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br transition-all duration-1000 ${currentTheme.gradient} relative overflow-hidden`}>
      <ThemeBackground category={category} />
      <audio id="tts-audio" hidden />

      <CreditPopup
        isOpen={showCreditPopup}
        onBuy={handleBuyCredits}
        onSummary={() => { setShowCreditPopup(false); /* Scroll to summary if implemented */ }}
        onEnd={handleEndSession}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-md border-b border-white/10 p-4 shadow-xl relative z-20"
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center ${currentTheme.accent}`}>
              <CategoryIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{category}</h1>
              <p className="text-sm text-blue-200">Personalized Support • Confidential Safe Space</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <CreditProgress />

            <div className="flex items-center space-x-3">
              <motion.button
                onClick={toggleVoice}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-full transition-all duration-300 shadow-lg ${isListening ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </motion.button>

              <motion.button
                onClick={handleEndSession}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-3 bg-white/10 text-white rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <Home className="w-4 h-4 mr-2" />
                End
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto p-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 h-[70vh] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, shadow: "none" }}
                  animate={{ opacity: 1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`px-6 py-4 rounded-2xl shadow-xl max-w-[80%] ${message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-white/10 text-white border border-white/10'
                    }`}>
                    <p className="text-md leading-relaxed">{message.text}</p>
                    <p className={`text-[10px] mt-2 opacity-50`}>
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10">
                    <div className="flex space-x-2">
                      {[0, 0.3, 0.6].map((delay, i) => (
                        <motion.div key={i} animate={{ scale: [1, 1.3, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay }} className="w-2 h-2 bg-blue-400 rounded-full" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 bg-white/5 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-6 py-4 rounded-full border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 bg-white/5 text-white placeholder-gray-400"
              />
              <motion.button
                onClick={handleSendMessage}
                whileHover={credits > 0 ? { scale: 1.05 } : {}}
                whileTap={credits > 0 ? { scale: 0.95 } : {}}
                disabled={!inputMessage.trim() || credits <= 0}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${credits > 0
                  ? `${currentTheme.accent} text-white`
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  } disabled:opacity-50`}
              >
                <Send className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapySessionPage;
