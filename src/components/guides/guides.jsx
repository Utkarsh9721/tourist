import React, { useState, useEffect } from 'react';
import './guides.css';

const Guide = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGuide, setExpandedGuide] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const guideCategories = [
    { id: 'all', name: 'All', icon: '🗺️' },
    { id: 'planning', name: 'Planning', icon: '📋' },
    { id: 'accommodation', name: 'Stays', icon: '🏨' },
    { id: 'transport', name: 'Travel', icon: '🚗' },
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'culture', name: 'Culture', icon: '🎭' },
    { id: 'safety', name: 'Safety', icon: '🛡️' },
  ];

  const guides = [
    {
      title: "Best Time to Visit",
      desc: "October to March offers pleasant weather across most regions. Perfect for sightseeing and outdoor activities.",
      icon: "🌤️",
      category: "planning",
      image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      tips: ["Avoid summer (April-June)", "Monsoon brings lush greenery", "Winter festivals are spectacular"]
    },
    {
      title: "Where to Stay",
      desc: "From luxury hotels to budget-friendly hostels, India offers accommodation for every traveler.",
      icon: "🏨",
      category: "accommodation",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      tips: ["Book in advance during peak season", "Read recent reviews", "Check cancellation policy"]
    },
    {
      title: "Getting Around",
      desc: "Trains for long distances, metro in cities, and auto-rickshaws for local travel.",
      icon: "🚆",
      category: "transport",
      image: "https://media.istockphoto.com/id/1416033340/photo/candid-portrait-of-young-motor-coach-driver-with-microphone.jpg?s=612x612&w=0&k=20&c=s8zlYhrRGRRPvBf-rc6knbWTgBM3ITD4Tnrg586VJQU=",
      tips: ["Book train tickets early", "Use ride-sharing apps", "Negotiate auto fares"]
    },
    {
      title: "Must-Try Foods",
      desc: "Experience diverse flavors from butter chicken to masala dosa, and everything in between.",
      icon: "🍛",
      category: "food",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      tips: ["Try street food in clean places", "Stay hydrated", "Ask for local recommendations"]
    },
    {
      title: "Local Customs",
      desc: "Learn about Indian culture, traditions, and etiquette for a respectful travel experience.",
      icon: "🙏",
      category: "culture",
      image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      tips: ["Remove shoes at temples", "Dress modestly", "Use right hand for eating"]
    },
    {
      title: "Safety First",
      desc: "Essential safety tips for a worry-free journey across India.",
      icon: "🛡️",
      category: "safety",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      tips: ["Keep valuables secure", "Drink bottled water", "Save emergency numbers"]
    }
  ];

  const travelTips = [
    { icon: "💳", tip: "Carry multiple payment options" },
    { icon: "📱", tip: "Download offline maps" },
    { icon: "💊", tip: "Pack basic medicines" },
    { icon: "🌐", tip: "Get local SIM card" },
    { icon: "💧", tip: "Drink bottled water" },
    { icon: "📞", tip: "Save emergency numbers" }
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = activeCategory === 'all' || guide.category === activeCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleGuide = (index) => {
    setExpandedGuide(expandedGuide === index ? null : index);
  };

  return (
    <div className="guides-page" id='guides'>
      {/* Hero Section */}
      <div className="guide-hero">
        <div className="hero-content">
          <h1 className="guide-main-title">
            <span className="title-icon">🇮🇳</span>
            India Travel Guide
          </h1>
          <p className="guide-hero-subtitle">
            Your complete companion for exploring Incredible India
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">28</span>
              <span className="stat-label">States</span>
            </div>
            <div className="stat">
              <span className="stat-number">40+</span>
              <span className="stat-label">UNESCO Sites</span>
            </div>
            <div className="stat">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Years Old</span>
            </div>
          </div>
        </div>
      </div>

      <div className="guide-container">
        {/* Search and Filter Section */}
        <div className="filter-section">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>

          <div className="categories-list">
            {guideCategories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="btn-icon">{category.icon}</span>
                <span className="btn-text">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="guides-section">
          <div className="section-header">
            <h2 className="section-title">Travel Guides</h2>
            <span className="guide-count">{filteredGuides.length} guides</span>
          </div>
          
          <div className="guide-cards-grid">
            {filteredGuides.map((guide, index) => (
              <div key={index} className="guide-card">
                <div className="card-image-container">
                  <img 
                    src={guide.image} 
                    alt={guide.title}
                    className="guide-image"
                    loading="lazy"
                  />
                  <div className="card-category">{guide.category}</div>
                </div>
                
                <div className="card-content">
                  <div className="card-header">
                    <h3 className="card-title">{guide.title}</h3>
                    <span className="guide-icon">{guide.icon}</span>
                  </div>
                  
                  <p className="card-desc">{guide.desc}</p>
                  
                  <button 
                    className="view-details-btn"
                    onClick={() => toggleGuide(index)}
                  >
                    {expandedGuide === index ? 'Show Less ↑' : 'Show Tips ↓'}
                  </button>

                  {expandedGuide === index && (
                    <div className="tips-list">
                      {guide.tips.map((tip, i) => (
                        <div key={i} className="tip-item-mini">
                          <span className="tip-bullet">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <p>No guides found matching your search</p>
              <button onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }} className="reset-btn">
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Quick Tips Section */}
        <div className="tips-section">
          <h2 className="section-title">Quick Tips</h2>
          <div className="tips-grid">
            {travelTips.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-icon">{tip.icon}</span>
                <p className="tip-text">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Info */}
        <div className="emergency-section">
          <h2 className="section-title">Emergency Contacts</h2>
          <div className="emergency-cards">
            <div className="emergency-card">
              <div className="emergency-icon">👮</div>
              <h3>Police</h3>
              <div className="emergency-number">100</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">🚑</div>
              <h3>Ambulance</h3>
              <div className="emergency-number">102</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">🚒</div>
              <h3>Fire</h3>
              <div className="emergency-number">101</div>
            </div>
            <div className="emergency-card">
              <div className="emergency-icon">🏛️</div>
              <h3>Tourism Helpline</h3>
              <div className="emergency-number">1800-11-1363</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;