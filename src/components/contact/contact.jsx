import React, { useState } from 'react';
import './contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactInfo = {
    email: 'support@transxs.com',
    phone: '+91 98765 43210',
    address: 'New Delhi, India',
    socialMedia: [
      { name: 'Facebook', icon: '🌐', url: 'https://www.facebook.com/utkarsh.rai.986' },
      { name: 'Instagram', icon: '📸', url: 'https://www.instagram.com/r_utkarsh_29?igsh=NXUybWVvYzZwYWp2' },
      { name: 'Twitter', icon: '🐦', url: '#' },
      { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/utkarsh-rai-9009b932b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' }
    ],
    businessHours: [
      { day: 'Mon - Fri', hours: '9:00 AM - 6:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
      { day: 'Sunday', hours: 'Closed' }
    ]
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);
  setSubmitStatus(null);

  try {
    const API_URL = import.meta.env.VITE_API_URL;
    console.log("API URL:", API_URL); // debug

    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      result = { message: "Server error" };
    }

    if (!response.ok) {
      throw new Error(result.message || "Request failed");
    }

    setSubmitStatus("success");
    setFormData({ name: "", email: "", message: "" });

  } catch (error) {
    console.error("❌ Error:", error.message);
    setSubmitStatus("error");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSocialClick = (platform, e) => {
    e.preventDefault();
    alert(`Redirecting to our ${platform} page!`);
    // In a real app, you would use: window.open(url, '_blank');
  };

  return (
    <section className="contact-page" id="contact">
      <div className="contact-hero">
        <h1>📩 Contact Us</h1>
        <p className="subtitle">
          We'd love to hear from you! Whether you have questions, feedback, or travel inquiries — reach out to us anytime.
        </p>
      </div>

      <div className="contact-container">
        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message *</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Tell us about your travel plans or questions..."
              className={errors.message ? 'error' : ''}
            />
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <button 
            type="submit" 
            className={`btn-submit ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>

          {submitStatus === 'success' && (
            <div className="status-message success">
              ✅ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="status-message error">
              ❌ Sorry, there was an error sending your message. Please try again or contact us directly.
            </div>
          )}
        </form>

        {/* Contact Info */}
        <div className="contact-info">
          <div className="info-card">
            <h2>Get in Touch</h2>
            
            <div className="contact-detail">
              <span className="icon">📧</span>
              <div>
                <strong>Email</strong>
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </div>
            </div>

            <div className="contact-detail">
              <span className="icon">📞</span>
              <div>
                <strong>Phone</strong>
                <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
              </div>
            </div>

            <div className="contact-detail">
              <span className="icon">📍</span>
              <div>
                <strong>Address</strong>
                <span>{contactInfo.address}</span>
              </div>
            </div>

            <div className="business-hours">
              <h3>Business Hours</h3>
              {contactInfo.businessHours.map((schedule, index) => (
                <div key={index} className="hours-item">
                  <span>{schedule.day}</span>
                  <span>{schedule.hours}</span>
                </div>
              ))}
            </div>

            <div className="social-links">
              <h3>Follow Us</h3>
              <div className="social-grid">
                {contactInfo.socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="social-link"
                    onClick={(e) => handleSocialClick(social.name, e)}
                  >
                    <span className="social-icon">{social.icon}</span>
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Help</h2>
        <div className="action-buttons">
          <button 
            className="action-btn"
            onClick={() => setFormData(prev => ({
              ...prev,
              message: "I'd like to book a tour package. Can you send me more information about your offerings?"
            }))}
          >
            📋 Tour Inquiry
          </button>
          <button 
            className="action-btn"
            onClick={() => setFormData(prev => ({
              ...prev,
              message: "I need help with my existing booking. Here are the details:"
            }))}
          >
            🔧 Booking Help
          </button>
          <button 
            className="action-btn"
            onClick={() => setFormData(prev => ({
              ...prev,
              message: "I have a question about your travel services:"
            }))}
          >
            ❓ General Question
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
