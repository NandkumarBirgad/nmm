import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import SymptomChecker from './components/patient/SymptomChecker';
import ChatAssistant from './components/patient/ChatAssistant';
import AppointmentBooking from './components/patient/AppointmentBooking';
import FileUpload from './components/patient/FileUpload';
import { useAuth } from './hooks/useAuth';

function AppContent() {
  const { user, userType } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  const renderPatientView = () => {
    switch (currentView) {
      case 'symptoms':
        return <SymptomChecker onNavigate={setCurrentView} />;
      case 'chat':
        return <ChatAssistant onNavigate={setCurrentView} />;
      case 'booking':
        return <AppointmentBooking onNavigate={setCurrentView} />;
      case 'files':
        return <FileUpload onNavigate={setCurrentView} />;
      default:
        return <PatientDashboard onNavigate={setCurrentView} />;
    }
  };

  const renderDoctorView = () => {
    return <DoctorDashboard onNavigate={setCurrentView} />;
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        userType={userType} 
        currentView={currentView} 
        onNavigate={setCurrentView} 
      />
      <main className="container mx-auto px-4 py-8">
        {userType === 'doctor' ? renderDoctorView() : renderPatientView()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <AppContent />
      </AppointmentProvider>
    </AuthProvider>
  );
}

export default App;