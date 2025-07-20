import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  symptoms: string[];
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high';
  notes?: string;
  files?: string[];
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  getAppointmentsByType: (type: 'patient' | 'doctor', userName: string) => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Internal Medicine',
      date: '2025-01-20',
      time: '10:00 AM',
      symptoms: ['fever', 'headache', 'fatigue'],
      status: 'pending',
      urgency: 'medium',
      notes: 'Patient reports symptoms for 3 days'
    }
  ]);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9)
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
    );
  };

  const getAppointmentsByType = (type: 'patient' | 'doctor', userName: string) => {
    return appointments.filter(apt => 
      type === 'patient' ? apt.patientName === userName : apt.doctorName === userName
    );
  };

  return (
    <AppointmentContext.Provider value={{
      appointments,
      addAppointment,
      updateAppointment,
      getAppointmentsByType
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};