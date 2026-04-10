// src/components/Book.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./book.css";

const Book = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    vehicle: "",
    guide: "none",
    accommodation: "",
    date: "",
    travelers: 1,
    duration: 1,
    phone: "",
    specialRequests: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

  // For Vite - get API URL from environment or use default
  const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api";

  // Calculate estimated cost based on selections
  useEffect(() => {
    const calculateCost = () => {
      const basePrice = {
        Delhi: 5000,
        Mumbai: 5500,
        Bangalore: 4800,
        Goa: 6500,
        Jaipur: 4500,
        Varanasi: 4200,
        Kerala: 6000,
        Ladakh: 8000
      };
      
      const vehiclePrice = {
        car: 2000,
        suv: 3500,
        bus: 5000
      };
      
      const guidePrice = {
        none: 0,
        basic: 1000,
        premium: 2000
      };
      
      const accommodationPrice = {
        budget: 1500,
        standard: 3000,
        luxury: 8000
      };
      
      const cityCost = basePrice[formData.city] || 5000;
      const vehicleCost = vehiclePrice[formData.vehicle] || 0;
      const guideCost = guidePrice[formData.guide] || 0;
      const accommodationCost = (accommodationPrice[formData.accommodation] || 0) * formData.duration;
      const travelersCost = (formData.travelers - 1) * 2000;
      
      const total = (cityCost + vehicleCost + guideCost + travelersCost) * formData.duration + accommodationCost;
      setEstimatedCost(total);
    };
    
    calculateCost();
  }, [formData.city, formData.vehicle, formData.guide, formData.travelers, formData.duration, formData.accommodation]);

  // Handle form submission with backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.city || !formData.date) {
        throw new Error("Please fill in all required fields");
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }
      
      // Validate phone number
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
        throw new Error("Please enter a valid 10-digit phone number");
      }
      
      // Prepare data for backend
      const bookingData = {
        ...formData,
        estimatedCost,
        bookingDate: new Date().toISOString(),
        status: "pending"
      };
      
      // Send to backend API
      const response = await axios.post(`${API_URL}/bookings`, bookingData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      // Get booking ID from response
      const newBookingId = response.data.bookingId || response.data._id || `IND${Date.now().toString().slice(-6)}`;
      setBookingId(newBookingId);
      
      // Show success message
      setShowConfirmation(true);
      
    } catch (err) {
      console.error("Booking submission error:", err);
      if (err.response?.status === 409) {
        setError("A booking with these details already exists. Please check your email for confirmation.");
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || "Invalid booking details. Please check your information.");
      } else if (err.code === 'ECONNABORTED') {
        setError("Connection timeout. Please check your internet connection and try again.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to submit booking. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      city: "",
      vehicle: "",
      guide: "none",
      accommodation: "",
      date: "",
      travelers: 1,
      duration: 1,
      phone: "",
      specialRequests: ""
    });
    setShowConfirmation(false);
    setCurrentStep(1);
    setError("");
    setEstimatedCost(0);
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError("Please fill in all personal details");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.city || !formData.date || !formData.travelers || !formData.duration) {
        setError("Please fill in all trip details");
        return;
      }
    }
    setError("");
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError("");
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  // Confirmation Page
  if (showConfirmation) {
    return (
      <div className="book-container">
        <div className="book-card">
          <div className="confirmation-container">
            <div className="confirmation-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17L4 12" />
              </svg>
            </div>
            <h1 className="confirmation-title">Booking Confirmed! 🎉</h1>
            <p>Your adventure is almost here! We've received your booking.</p>
            
            <div className="booking-details">
              <div className="review-item">
                <span className="review-label">Booking ID:</span>
                <span className="booking-id">{bookingId}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Total Amount:</span>
                <span className="review-value" style={{color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem'}}>
                  ₹{estimatedCost.toLocaleString()}
                </span>
              </div>
              <div className="review-item">
                <span className="review-label">Destination:</span>
                <span className="review-value">{formData.city}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Travel Date:</span>
                <span className="review-value">{formData.date}</span>
              </div>
              <div className="review-item">
                <span className="review-label">Travelers:</span>
                <span className="review-value">{formData.travelers}</span>
              </div>
            </div>
            
            <p style={{ marginTop: '1rem', color: '#666' }}>
              We'll send confirmation details to <strong>{formData.email}</strong> within 24 hours.
            </p>
            
            <button onClick={resetForm} className="btn btn-primary" style={{ marginTop: '2rem' }}>
              Plan Another Trip ✈️
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Booking Form
  return (
    <div className="book-container">
      <div className="book-card">
        <h1>Book Your Adventure</h1>
        
        {/* Step Indicator */}
        <div className="step-indicator">
          <div className="steps">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                <div className="step-circle">
                  {currentStep > step ? '✓' : step}
                </div>
                <div className="step-label">
                  {step === 1 && 'Personal'}
                  {step === 2 && 'Trip'}
                  {step === 3 && 'Add-ons'}
                  {step === 4 && 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="book-form" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Step 1 - Personal Information */}
          {currentStep === 1 && (
            <div className="form-section">
              <h2>Personal Information</h2>
              <div className="form-group">
                <label className="required">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="required">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="required">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="9876543210"
                  required
                />
                <small style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                  Enter 10-digit mobile number
                </small>
              </div>
            </div>
          )}

          {/* Step 2 - Trip Details */}
          {currentStep === 2 && (
            <div className="form-section">
              <h2>Trip Details</h2>
              <div className="form-group">
                <label className="required">Destination City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                >
                  <option value="">Select destination</option>
                  <option value="Delhi">Delhi - The Capital</option>
                  <option value="Mumbai">Mumbai - The City of Dreams</option>
                  <option value="Bangalore">Bangalore - Silicon Valley</option>
                  <option value="Goa">Goa - Beach Paradise</option>
                  <option value="Jaipur">Jaipur - Pink City</option>
                  <option value="Varanasi">Varanasi - Spiritual Capital</option>
                  <option value="Kerala">Kerala - God's Own Country</option>
                  <option value="Ladakh">Ladakh - Land of High Passes</option>
                </select>
              </div>
              <div className="form-group">
                <label className="required">Travel Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required">Number of Travelers</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={(e) => setFormData({...formData, travelers: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3 - Add-ons */}
          {currentStep === 3 && (
            <div className="form-section">
              <h2>Add-ons & Preferences</h2>
              <div className="form-group">
                <label>Vehicle Rental</label>
                <select
                  value={formData.vehicle}
                  onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                >
                  <option value="">No vehicle needed</option>
                  <option value="car">🚗 Car (₹2000/day)</option>
                  <option value="suv">🚙 SUV (₹3500/day)</option>
                  <option value="bus">🚌 Mini Bus (₹5000/day)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tour Guide</label>
                <select
                  value={formData.guide}
                  onChange={(e) => setFormData({...formData, guide: e.target.value})}
                >
                  <option value="none">No guide needed</option>
                  <option value="basic">👤 Basic Guide (₹1000/day)</option>
                  <option value="premium">👥 Premium Guide (₹2000/day)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Accommodation</label>
                <select
                  value={formData.accommodation}
                  onChange={(e) => setFormData({...formData, accommodation: e.target.value})}
                >
                  <option value="">No accommodation needed</option>
                  <option value="budget">🏨 Budget Hotel (₹1500/night)</option>
                  <option value="standard">🏩 Standard Hotel (₹3000/night)</option>
                  <option value="luxury">🏰 Luxury Resort (₹8000/night)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Special Requests</label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  placeholder="Any special requirements, dietary restrictions, or preferences? (e.g., wheelchair access, vegetarian food, etc.)"
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Step 4 - Review */}
          {currentStep === 4 && (
            <div className="form-section">
              <h2>Review Your Booking</h2>
              
              <div className="review-section">
                <h3>Personal Details</h3>
                <div className="review-item">
                  <span className="review-label">Name:</span>
                  <span className="review-value">{formData.name}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Email:</span>
                  <span className="review-value">{formData.email}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Phone:</span>
                  <span className="review-value">{formData.phone}</span>
                </div>
              </div>

              <div className="review-section">
                <h3>Trip Details</h3>
                <div className="review-item">
                  <span className="review-label">Destination:</span>
                  <span className="review-value">{formData.city}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Travel Date:</span>
                  <span className="review-value">{new Date(formData.date).toLocaleDateString('en-IN')}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Travelers:</span>
                  <span className="review-value">{formData.travelers} {formData.travelers === 1 ? 'person' : 'people'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Duration:</span>
                  <span className="review-value">{formData.duration} {formData.duration === 1 ? 'day' : 'days'}</span>
                </div>
              </div>

              <div className="review-section">
                <h3>Add-ons</h3>
                <div className="review-item">
                  <span className="review-label">Vehicle:</span>
                  <span className="review-value">{formData.vehicle ? formData.vehicle.toUpperCase() : 'Not selected'}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Guide:</span>
                  <span className="review-value">{formData.guide === 'none' ? 'No guide' : formData.guide.toUpperCase()}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Accommodation:</span>
                  <span className="review-value">{formData.accommodation ? formData.accommodation.toUpperCase() : 'Not selected'}</span>
                </div>
                {formData.specialRequests && (
                  <div className="review-item">
                    <span className="review-label">Special Requests:</span>
                    <span className="review-value">{formData.specialRequests}</span>
                  </div>
                )}
              </div>

              <div className="cost-breakdown">
                <h3>Cost Breakdown</h3>
                <div className="review-item">
                  <span className="review-label">Base Package:</span>
                  <span className="review-value">₹{Math.round(estimatedCost / formData.duration).toLocaleString()}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Duration:</span>
                  <span className="review-value">{formData.duration} days</span>
                </div>
                {formData.accommodation && (
                  <div className="review-item">
                    <span className="review-label">Accommodation:</span>
                    <span className="review-value">Included</span>
                  </div>
                )}
                <div className="total-cost">
                  Total Amount: ₹{estimatedCost.toLocaleString()}
                </div>
                <small style={{ display: 'block', marginTop: '0.5rem', opacity: 0.8 }}>
                  *Final price may vary based on availability and seasonal changes
                </small>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="button-group">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn btn-secondary">
                ← Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button type="button" onClick={nextStep} className="btn btn-primary">
                Next Step →
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="btn btn-success">
                {isSubmitting ? (
                  <>
                    <span className="spinner-small" style={{ display: 'inline-block', marginRight: '8px' }}></span>
                    Processing...
                  </>
                ) : (
                  `Confirm Booking (₹${estimatedCost.toLocaleString()})`
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Book;
