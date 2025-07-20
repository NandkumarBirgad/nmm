import React from 'react';
import { Activity, Calendar, FileText, MessageSquare, Upload, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments } from '../../contexts/AppointmentContext';

interface PatientDashboardProps {
  onNavigate: (view: string) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { getAppointmentsByType } = useAppointments();
  
  const appointments = getAppointmentsByType('patient', user?.name || '');
  const upcomingAppointments = appointments.filter(apt => apt.status === 'pending' || apt.status === 'confirmed');

  const quickActions = [
    {
      title: 'Symptom Checker',
      description: 'Check your symptoms with AI assistance',
      icon: FileText,
      action: () => onNavigate('symptoms'),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'AI Assistant',
      description: 'Chat with our medical AI assistant',
      icon: MessageSquare,
      action: () => onNavigate('chat'),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule with healthcare providers',
      icon: Calendar,
      action: () => onNavigate('booking'),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Upload Files',
      description: 'Upload medical reports and documents',
      icon: Upload,
      action: () => onNavigate('files'),
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  const healthTips = [
    "Drink at least 8 glasses of water daily",
    "Get 7-9 hours of quality sleep each night",
    "Exercise for at least 30 minutes daily",
    "Eat a balanced diet with fruits and vegetables"
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-16 w-16 rounded-full border-4 border-white/20"
          />
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mt-1">How are you feeling today?</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} ${action.hoverColor} text-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200`}
              >
                <Icon className="h-8 w-8 mb-3" />
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    appointment.urgency === 'high' ? 'bg-red-500' :
                    appointment.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-600">{appointment.specialization}</p>
                    <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {appointment.status === 'pending' ? (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming appointments</p>
              <button
                onClick={() => onNavigate('booking')}
                className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Book your first appointment
              </button>
            </div>
          )}
        </div>

        {/* Health Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Daily Health Tips</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {healthTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <div>
            <h3 className="font-semibold text-red-900">Emergency Contact</h3>
            <p className="text-red-700 text-sm">
              For medical emergencies, call 911 immediately or visit your nearest emergency room.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;