import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowLeft, CheckCircle, MapPin } from 'lucide-react';
import { useAppointments } from '../../contexts/AppointmentContext';
import { useAuth } from '../../hooks/useAuth';

interface AppointmentBookingProps {
  onNavigate: (view: string) => void;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  experience: string;
  location: string;
  avatar: string;
  availableSlots: string[];
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ onNavigate }) => {
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [step, setStep] = useState(1);
  const [isBooked, setIsBooked] = useState(false);
  
  const { addAppointment } = useAppointments();
  const { user } = useAuth();

  const specializations = [
    'Internal Medicine',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Psychiatry',
    'Ophthalmology'
  ];

  const mockDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Internal Medicine',
      rating: 4.9,
      experience: '12 years',
      location: 'Downtown Medical Center',
      avatar: 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availableSlots: ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM']
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Cardiology',
      rating: 4.8,
      experience: '15 years',
      location: 'Heart Care Clinic',
      avatar: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availableSlots: ['11:00 AM', '1:00 PM', '4:00 PM']
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Dermatology',
      rating: 4.7,
      experience: '8 years',
      location: 'Skin Health Institute',
      avatar: 'https://images.pexels.com/photos/5998475/pexels-photo-5998475.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      availableSlots: ['9:30 AM', '11:30 AM', '2:30 PM', '4:30 PM']
    }
  ];

  const filteredDoctors = selectedSpecialization 
    ? mockDoctors.filter(doctor => doctor.specialization === selectedSpecialization)
    : mockDoctors;

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Skip Sundays
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !user) return;

    const appointment = {
      patientName: user.name,
      doctorName: selectedDoctor.name,
      specialization: selectedDoctor.specialization,
      date: selectedDate,
      time: selectedTime,
      symptoms: symptoms.split(',').map(s => s.trim()).filter(s => s),
      status: 'pending' as const,
      urgency: 'medium' as const,
      notes: symptoms
    };

    addAppointment(appointment);
    setIsBooked(true);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-16 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  if (isBooked) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Booked Successfully!</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
            <div className="space-y-2 text-left">
              <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
              <p><strong>Specialization:</strong> {selectedDoctor?.specialization}</p>
              <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Location:</strong> {selectedDoctor?.location}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            You will receive a confirmation email shortly. The doctor's office may contact you to confirm the appointment.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
        <p className="text-gray-600">Schedule a consultation with our healthcare providers</p>
      </div>

      {renderStepIndicator()}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Step 1: Select Specialization */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select Specialization</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {specializations.map((spec) => (
                <button
                  key={spec}
                  onClick={() => {
                    setSelectedSpecialization(spec);
                    setStep(2);
                  }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                >
                  <p className="font-medium text-gray-900">{spec}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Doctor */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Select Doctor - {selectedSpecialization}
              </h2>
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-700"
              >
                Change Specialization
              </button>
            </div>
            
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`border border-gray-200 rounded-lg p-6 cursor-pointer transition-colors ${
                    selectedDoctor?.id === doctor.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setStep(3);
                  }}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                      <p className="text-blue-600">{doctor.specialization}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>⭐ {doctor.rating}</span>
                        <span>{doctor.experience} experience</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{doctor.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Date & Time */}
        {step === 3 && selectedDoctor && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Select Date & Time
              </h2>
              <button
                onClick={() => setStep(2)}
                className="text-blue-600 hover:text-blue-700"
              >
                Change Doctor
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Date Selection */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Available Dates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`p-3 border border-gray-200 rounded-lg text-sm transition-colors ${
                        selectedDate === date
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'hover:border-gray-300'
                      }`}
                    >
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Available Times</h3>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoctor.availableSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 border border-gray-200 rounded-lg text-sm transition-colors ${
                          selectedTime === time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'hover:border-gray-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Please select a date first</p>
                )}
              </div>
            </div>

            {selectedDate && selectedTime && (
              <button
                onClick={() => setStep(4)}
                className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {/* Step 4: Additional Information */}
        {step === 4 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              <button
                onClick={() => setStep(3)}
                className="text-blue-600 hover:text-blue-700"
              >
                Back
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for visit / Symptoms (Optional)
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Briefly describe your symptoms or reason for the visit..."
                />
              </div>

              {/* Appointment Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Appointment Summary</h3>
                <div className="space-y-2">
                  <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
                  <p><strong>Specialization:</strong> {selectedDoctor?.specialization}</p>
                  <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                  <p><strong>Location:</strong> {selectedDoctor?.location}</p>
                </div>
              </div>

              <button
                onClick={handleBookAppointment}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Confirm Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;