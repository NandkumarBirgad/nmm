import React, { useState } from 'react';
import { Send, AlertTriangle, Clock, User, ArrowLeft, Loader } from 'lucide-react';

interface SymptomCheckerProps {
  onNavigate: (view: string) => void;
}

interface SymptomAnalysis {
  conditions: Array<{
    name: string;
    probability: number;
    description: string;
  }>;
  specialist: string;
  urgency: 'low' | 'medium' | 'high';
  advice: string[];
  disclaimer: string;
}

const SymptomChecker: React.FC<SymptomCheckerProps> = ({ onNavigate }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);

  const mockAnalyzeSymptoms = (symptomText: string): SymptomAnalysis => {
    const lowerSymptoms = symptomText.toLowerCase();
    
    // Mock AI analysis based on keywords
    if (lowerSymptoms.includes('fever') || lowerSymptoms.includes('headache') || lowerSymptoms.includes('fatigue')) {
      return {
        conditions: [
          { name: 'Viral Upper Respiratory Infection', probability: 75, description: 'Common cold or flu-like illness' },
          { name: 'Bacterial Infection', probability: 20, description: 'Possible bacterial infection requiring antibiotics' },
          { name: 'Stress/Fatigue', probability: 15, description: 'Physical or mental exhaustion' }
        ],
        specialist: 'Internal Medicine',
        urgency: 'medium',
        advice: [
          'Get plenty of rest and stay hydrated',
          'Monitor your temperature regularly',
          'Consider over-the-counter pain relievers if needed',
          'Seek medical attention if symptoms worsen or persist beyond 7 days'
        ],
        disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice.'
      };
    } else if (lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('shortness of breath')) {
      return {
        conditions: [
          { name: 'Anxiety/Panic Attack', probability: 45, description: 'Stress-related chest discomfort' },
          { name: 'Cardiac Concern', probability: 35, description: 'Potential heart-related issue' },
          { name: 'Respiratory Issue', probability: 25, description: 'Lung or breathing-related problem' }
        ],
        specialist: 'Cardiology',
        urgency: 'high',
        advice: [
          'Seek immediate medical attention for chest pain',
          'Do not ignore persistent chest discomfort',
          'Call emergency services if symptoms are severe',
          'Avoid strenuous activity until evaluated'
        ],
        disclaimer: 'Chest pain can be serious. Please seek immediate medical evaluation.'
      };
    } else {
      return {
        conditions: [
          { name: 'General Health Concern', probability: 60, description: 'Various possible causes' },
          { name: 'Lifestyle Factors', probability: 30, description: 'Diet, exercise, or sleep related' },
          { name: 'Stress-Related', probability: 25, description: 'Physical manifestation of stress' }
        ],
        specialist: 'Internal Medicine',
        urgency: 'low',
        advice: [
          'Monitor symptoms and note any changes',
          'Maintain a healthy lifestyle with proper diet and exercise',
          'Consider stress management techniques',
          'Schedule a routine check-up with your doctor'
        ],
        disclaimer: 'General symptoms can have many causes. Consult with a healthcare provider for proper evaluation.'
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const result = mockAnalyzeSymptoms(symptoms);
      setAnalysis(result);
      setIsLoading(false);
    }, 2000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'medium': return <Clock className="h-5 w-5" />;
      case 'low': return <Clock className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Symptom Checker</h1>
        <p className="text-gray-600">
          Describe your symptoms in natural language and get AI-powered health insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Describe Your Symptoms</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What symptoms are you experiencing?
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Example: I have been feeling tired for the past 3 days with a mild headache and slight fever..."
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !symptoms.trim()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Analyze Symptoms</span>
                </>
              )}
            </button>
          </form>

          {/* Example Symptoms */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Example Descriptions:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• "I have a persistent cough and sore throat for 2 days"</li>
              <li>• "Experiencing dizziness and mild nausea since morning"</li>
              <li>• "Sharp pain in lower back when sitting for long periods"</li>
            </ul>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {isLoading && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Analyzing your symptoms with AI...</p>
            </div>
          )}

          {analysis && !isLoading && (
            <>
              {/* Urgency Level */}
              <div className={`rounded-xl p-4 ${getUrgencyColor(analysis.urgency)}`}>
                <div className="flex items-center space-x-2">
                  {getUrgencyIcon(analysis.urgency)}
                  <span className="font-semibold capitalize">
                    {analysis.urgency} Priority
                  </span>
                </div>
              </div>

              {/* Possible Conditions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Possible Conditions</h3>
                <div className="space-y-3">
                  {analysis.conditions.map((condition, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{condition.name}</h4>
                        <span className="text-sm text-blue-600 font-medium">
                          {condition.probability}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{condition.description}</p>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${condition.probability}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Specialist */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Specialist</h3>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{analysis.specialist}</p>
                    <p className="text-sm text-gray-600">Best suited for your symptoms</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Book Appointment
                </button>
              </div>

              {/* Advice */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.advice.map((advice, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{advice}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Disclaimer:</strong> {analysis.disclaimer}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;