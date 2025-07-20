import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Phone, Mail, CheckCircle, XCircle, Edit } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAppointments, Appointment } from '../../contexts/AppointmentContext';

interface DoctorDashboardProps {
  onNavigate: (view: string) => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { getAppointmentsByType, updateAppointment } = useAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState('');
  
  const appointments = getAppointmentsByType('doctor', user?.name || '');
  const todaysAppointments = appointments.filter(apt => {
    const today = new Date().toISOString().split('T')[0];
    return apt.date === today;
  });

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'confirmed' && new Date(apt.date) >= new Date()
  );

  const handleAcceptAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'confirmed' });
  };

  const handleRejectAppointment = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: 'cancelled' });
  };

  const handleAddNotes = (appointmentId: string) => {
    if (notes.trim()) {
      updateAppointment(appointmentId, { 
        notes: notes,
        status: 'completed'
      });
      setNotes('');
      setSelectedAppointment(null);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const stats = [
    {
      title: "Today's Appointments",
      value: todaysAppointments.length.toString(),
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Requests',
      value: pendingAppointments.length.toString(),
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'This Week',
      value: appointments.filter(apt => {
        const appointmentDate = new Date(apt.date);
        const today = new Date();
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return appointmentDate >= today && appointmentDate <= weekFromNow;
      }).length.toString(),
      icon: User,
      color: 'bg-green-500'
    },
    {
      title: 'Total Patients',
      value: new Set(appointments.map(apt => apt.patientName)).size.toString(),
      icon: FileText,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-16 w-16 rounded-full border-4 border-white/20"
          />
          <div>
            <h1 className="text-2xl font-bold">Good morning, {user?.name}!</h1>
            <p className="text-green-100 mt-1">{user?.specialization} • Ready to help patients today</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Requests</h2>
          
          {pendingAppointments.length > 0 ? (
            <div className="space-y-4">
              {pendingAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-600">
                        {appointment.date} at {appointment.time}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getUrgencyColor(appointment.urgency)}`}>
                        {appointment.urgency} priority
                      </span>
                    </div>
                  </div>
                  
                  {appointment.symptoms.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Symptoms:</p>
                      <div className="flex flex-wrap gap-1">
                        {appointment.symptoms.map((symptom, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptAppointment(appointment.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleRejectAppointment(appointment.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="h-3 w-3" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No pending requests</p>
            </div>
          )}
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
          
          {todaysAppointments.length > 0 ? (
            <div className="space-y-4">
              {todaysAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                      <p className="text-sm text-gray-600">{appointment.time}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => setSelectedAppointment(appointment)}
                        className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Add Notes</span>
                      </button>
                    )}
                  </div>
                  
                  {appointment.symptoms.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Symptoms:</p>
                      <div className="flex flex-wrap gap-1">
                        {appointment.symptoms.map((symptom, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium mb-1">Notes:</p>
                      <p className="text-sm text-blue-800">{appointment.notes}</p>
                    </div>
                  )}

                  <div className="flex space-x-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>Call patient</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>Send message</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No appointments today</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-blue-900">View All Appointments</p>
              <p className="text-sm text-blue-600">Manage your schedule</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <User className="h-6 w-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-green-900">Patient Records</p>
              <p className="text-sm text-green-600">Access medical histories</p>
            </div>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <FileText className="h-6 w-6 text-purple-600" />
            <div className="text-left">
              <p className="font-medium text-purple-900">Medical Reports</p>
              <p className="text-sm text-purple-600">Review and create reports</p>
            </div>
          </button>
        </div>
      </div>

      {/* Notes Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Notes for {selectedAppointment.patientName}
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
              placeholder="Enter consultation notes, diagnosis, recommendations..."
            />
            <div className="flex space-x-3">
              <button
                onClick={() => handleAddNotes(selectedAppointment.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Notes & Complete
              </button>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;