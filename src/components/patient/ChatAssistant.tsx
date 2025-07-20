import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Loader } from 'lucide-react';

interface ChatAssistantProps {
  onNavigate: (view: string) => void;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI health assistant. I can help answer questions about general health, medications, symptoms, and wellness. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return "For fever management: Monitor your temperature regularly, stay hydrated with plenty of fluids, get adequate rest, and consider over-the-counter fever reducers like acetaminophen or ibuprofen as directed. If fever persists above 101.3°F (38.5°C) for more than 3 days or reaches 103°F (39.4°C), please consult a healthcare provider immediately.";
    }
    
    if (lowerMessage.includes('headache') || lowerMessage.includes('migraine')) {
      return "For headache relief: Try resting in a quiet, dark room, apply a cold or warm compress to your head or neck, stay hydrated, and consider gentle neck stretches. Over-the-counter pain relievers can help, but avoid overuse. If headaches are severe, frequent, or accompanied by other symptoms like vision changes or neck stiffness, please seek medical attention.";
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia')) {
      return "For better sleep hygiene: Maintain a consistent sleep schedule, create a comfortable sleep environment (cool, dark, quiet), avoid caffeine and screens before bedtime, establish a relaxing bedtime routine, and get regular exercise (but not close to bedtime). If sleep problems persist, consider speaking with a healthcare provider about potential underlying causes.";
    }
    
    if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition') || lowerMessage.includes('weight')) {
      return "For healthy nutrition: Focus on a balanced diet with plenty of fruits, vegetables, whole grains, and lean proteins. Stay hydrated with water, limit processed foods and added sugars, practice portion control, and consider meal planning. For specific dietary needs or weight management goals, consulting with a registered dietitian can provide personalized guidance.";
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('fitness')) {
      return "For fitness and exercise: Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity per week, plus muscle-strengthening activities twice a week. Start slowly if you're new to exercise, choose activities you enjoy, and listen to your body. Consult your doctor before starting any new exercise program, especially if you have health conditions.";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      return "For stress management: Practice deep breathing exercises, try meditation or mindfulness, maintain regular physical activity, ensure adequate sleep, connect with supportive friends and family, and consider limiting news/social media if it increases stress. If stress feels overwhelming or persists, speaking with a mental health professional can be very helpful.";
    }
    
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
      return "Regarding medications: Always take medications as prescribed by your healthcare provider, never stop or change dosages without consulting them, be aware of potential side effects, keep an updated list of all medications and supplements, and inform all healthcare providers about everything you're taking. For specific medication questions, consult your pharmacist or doctor.";
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return "For medical emergencies: Call 911 immediately for life-threatening situations such as chest pain, difficulty breathing, severe bleeding, loss of consciousness, or signs of stroke (face drooping, arm weakness, speech difficulty). For urgent but non-emergency situations, contact your healthcare provider or consider an urgent care center.";
    }
    
    // Default response
    return "Thank you for your question. While I can provide general health information, I recommend discussing specific symptoms or concerns with a qualified healthcare provider who can give you personalized medical advice. They can properly evaluate your individual situation and provide appropriate care. Is there any general health topic I can help explain?";
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const quickQuestions = [
    "How can I manage stress?",
    "What are signs of dehydration?",
    "How much sleep do I need?",
    "When should I see a doctor?",
    "How to improve immunity?",
    "What's a healthy diet?"
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Health Assistant</h1>
        <p className="text-gray-600">
          Get instant answers to your health questions from our AI assistant
        </p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                
                <div className={`rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin text-gray-600" />
                    <p className="text-sm text-gray-600">AI is typing...</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="p-6 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about health and wellness..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-2">
            This AI assistant provides general health information only and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;