// src/components/History.js
import React, { useEffect, useState } from 'react';
import './history.css';

const History = () => {
  const [selectedCity, setSelectedCity] = useState(null);

  // City tourism data
  const citiesData = {
    tajMahal: {
      name: "Taj Mahal, Agra",
      location: "Agra, Uttar Pradesh",
      history: "Built by Mughal Emperor Shah Jahan between 1631-1653 in memory of his beloved wife Mumtaz Mahal. This white marble mausoleum is considered the jewel of Muslim art in India and one of the universally admired masterpieces of world heritage.",
      significance: "Symbol of eternal love, UNESCO World Heritage Site, One of the Seven Wonders of the World",
      bestTime: "October to March",
      highlights: ["Dawn View", "Full Moon Night", "Mehtab Bagh", "Agra Fort"]
    },
    varanasi: {
      name: "Varanasi",
      location: "Uttar Pradesh",
      history: "One of the world's oldest continuously inhabited cities, dating back to 11th century BCE. Known as the spiritual capital of India, it's a major pilgrimage site for Hindus who believe dying here brings salvation (moksha).",
      significance: "Spiritual capital, Ganga Aarti, 88 ghats, Kashi Vishwanath Temple",
      bestTime: "November to February",
      highlights: ["Ganga Aarti", "Boat Ride at Sunrise", "Sarnath", "Old City Walk"]
    },
    delhi: {
      name: "Delhi",
      location: "National Capital Territory",
      history: "Inhabited since 6th century BCE, Delhi has been the capital of several empires including the Delhi Sultanate, Mughal Empire, and British Raj. It's a city of contrasts where ancient history meets modern development.",
      significance: "Political capital, Historical monuments, Street food paradise",
      bestTime: "October to March",
      highlights: ["Red Fort", "Qutub Minar", "India Gate", "Humayun's Tomb", "Chandni Chowk"]
    },
    mumbai: {
      name: "Mumbai",
      location: "Maharashtra",
      history: "Originally seven islands, Mumbai became the commercial capital of India under British rule. The city grew from a fishing village to India's financial powerhouse and Bollywood hub.",
      significance: "Financial capital, Bollywood, Gateway of India, Marine Drive",
      bestTime: "October to February",
      highlights: ["Gateway of India", "Marine Drive", "Elephanta Caves", "Juhu Beach", "Colaba Causeway"]
    },
    kerala: {
      name: "Kerala",
      location: "South India",
      history: "Known as 'God's Own Country', Kerala has a unique history of trade with Romans, Arabs, Chinese, and Europeans. It's famous for its backwaters, ayurveda, and highest literacy rate in India.",
      significance: "Backwaters, Ayurveda, Beaches, Hill stations, Cuisine",
      bestTime: "September to March",
      highlights: ["Alleppey Backwaters", "Munnar Tea Gardens", "Kovalam Beach", "Fort Kochi", "Periyar Wildlife"]
    },
    jaipur: {
      name: "Jaipur",
      location: "Rajasthan",
      history: "Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is the first planned city of India. Known as the Pink City, it's a treasure trove of Rajput architecture and culture.",
      significance: "Pink City, Rajput architecture, Heritage hotels, Jewelry and textiles",
      bestTime: "November to February",
      highlights: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Jal Mahal"]
    },
    goa: {
      name: "Goa",
      location: "Western Coast",
      history: "A Portuguese colony for over 450 years (1510-1961), Goa developed a unique Indo-Portuguese culture. It's famous for its beaches, churches, and vibrant nightlife.",
      significance: "Beaches, Portuguese architecture, Nightlife, Seafood",
      bestTime: "November to February",
      highlights: ["Baga Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Old Goa", "Anjuna Flea Market"]
    },
    ladakh: {
      name: "Ladakh",
      location: "Jammu & Kashmir",
      history: "Known as 'Little Tibet', Ladakh has a rich Buddhist heritage dating back to 10th century. It opened to tourism only in 1974 and is famous for its stark landscape and high-altitude deserts.",
      significance: "Buddhist monasteries, Adventure sports, Unique landscape",
      bestTime: "June to September",
      highlights: ["Pangong Lake", "Nubra Valley", "Magnetic Hill", "Khardung La", "Leh Palace"]
    }
  };

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.history-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className='history-component'>
      {/* Hero Section */}
      <div className="history-hero">
        <div className="hero-overlay">
          <h1 className="hero-title">History of Indian Tourism 🇮🇳</h1>
          <p className="hero-subtitle">A Journey Through 5000 Years of Cultural Heritage</p>
        </div>
      </div>

      <div className="history-container">
        {/* Introduction Section */}
        <section className="history-section intro-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📜</span>
              The Eternal Land of Wanderers
            </h2>
          </div>
          
          <div className="section-content">
            <div className="text-content">
              <p className="section-text">
                India's tryst with tourism began over 5000 years ago when pilgrims, scholars, and traders 
                first set foot on its sacred soil. From the ancient universities of Takshashila and Nalanda 
                to the modern marvels of today, India has always been a beacon for travelers seeking 
                knowledge, spirituality, and adventure.
              </p>
              <p className="section-text">
                The Sanskrit saying "<strong>Atithi Devo Bhava</strong>" (Guest is God) perfectly captures 
                India's timeless hospitality tradition that has welcomed millions of visitors through the ages.
              </p>
              
              <div className="highlight-box">
                <h4>🌟 Did You Know?</h4>
                <p>India receives over 10 million foreign tourists annually and generates over $30 billion 
                in tourism revenue, making it one of the fastest-growing tourism destinations in the world.</p>
              </div>
            </div>
            
            <div className="image-content">
              <img 
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Indian Tourism"
                className="section-image"
              />
              <div className="image-caption">Modern India Welcoming Tourists</div>
            </div>
          </div>
        </section>

        {/* Iconic Destinations Section */}
        <section className="history-section destinations-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🏛️</span>
              Iconic Destinations & Their Stories
            </h2>
          </div>
          
          <div className="city-grid">
            {/* Taj Mahal */}
            <div className="city-card" onClick={() => setSelectedCity('tajMahal')}>
              <div className="city-image">
                <img src="https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Taj Mahal" />
              </div>
              <div className="city-info">
                <h3>Taj Mahal, Agra</h3>
                <p className="city-description">Symbol of eternal love and one of the Seven Wonders of the World</p>
                <div className="city-highlights">
                  <span className="city-highlight">UNESCO Site</span>
                  <span className="city-highlight">Mughal Architecture</span>
                  <span className="city-highlight">World Wonder</span>
                </div>
              </div>
            </div>

            {/* Varanasi */}
            <div className="city-card" onClick={() => setSelectedCity('varanasi')}>
              <div className="city-image">
                <img src="https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Varanasi" />
              </div>
              <div className="city-info">
                <h3>Varanasi</h3>
                <p className="city-description">The spiritual capital of India, one of the world's oldest living cities</p>
                <div className="city-highlights">
                  <span className="city-highlight">Ganga Aarti</span>
                  <span className="city-highlight">88 Ghats</span>
                  <span className="city-highlight">Spiritual Hub</span>
                </div>
              </div>
            </div>

            {/* Delhi */}
            <div className="city-card" onClick={() => setSelectedCity('delhi')}>
              <div className="city-image">
                <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Delhi" />
              </div>
              <div className="city-info">
                <h3>Delhi</h3>
                <p className="city-description">Where ancient history meets modern metropolis</p>
                <div className="city-highlights">
                  <span className="city-highlight">Capital City</span>
                  <span className="city-highlight">Historical Monuments</span>
                  <span className="city-highlight">Street Food</span>
                </div>
              </div>
            </div>

            {/* Mumbai */}
            <div className="city-card" onClick={() => setSelectedCity('mumbai')}>
              <div className="city-image">
                <img src="https://images.unsplash.com/photo-1570168007204-cefbce422cfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mumbai" />
              </div>
              <div className="city-info">
                <h3>Mumbai</h3>
                <p className="city-description">The city of dreams, Bollywood, and colonial heritage</p>
                <div className="city-highlights">
                  <span className="city-highlight">Gateway of India</span>
                  <span className="city-highlight">Bollywood</span>
                  <span className="city-highlight">Marine Drive</span>
                </div>
              </div>
            </div>

            {/* Kerala */}
            <div className="city-card" onClick={() => setSelectedCity('kerala')}>
              <div className="city-image">
                <img src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kerala" />
              </div>
              <div className="city-info">
                <h3>Kerala</h3>
                <p className="city-description">God's Own Country - Backwaters, Ayurveda, and serene beaches</p>
                <div className="city-highlights">
                  <span className="city-highlight">Backwaters</span>
                  <span className="city-highlight">Ayurveda</span>
                  <span className="city-highlight">Houseboats</span>
                </div>
              </div>
            </div>

            {/* Jaipur */}
            <div className="city-card" onClick={() => setSelectedCity('jaipur')}>
              <div className="city-image">
                <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Jaipur" />
              </div>
              <div className="city-info">
                <h3>Jaipur</h3>
                <p className="city-description">The Pink City - Royal heritage and Rajput architecture</p>
                <div className="city-highlights">
                  <span className="city-highlight">Amber Fort</span>
                  <span className="city-highlight">Hawa Mahal</span>
                  <span className="city-highlight">Pink City</span>
                </div>
              </div>
            </div>

            {/* Goa */}
            <div className="city-card" onClick={() => setSelectedCity('goa')}>
              <div className="city-image">
                <img src="https://images.unsplash.com/photo-1512343879784-960f40e4a1f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Goa" />
              </div>
              <div className="city-info">
                <h3>Goa</h3>
                <p className="city-description">Beaches, Portuguese heritage, and vibrant nightlife</p>
                <div className="city-highlights">
                  <span className="city-highlight">Beaches</span>
                  <span className="city-highlight">Portuguese Architecture</span>
                  <span className="city-highlight">Nightlife</span>
                </div>
              </div>
            </div>

            {/* Ladakh */}
            <div className="city-card" onClick={() => setSelectedCity('ladakh')}>
              <div className="city-image">
                <img src="https://images.unsplash.com/photo-1516172792-bf2250f5ec71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Ladakh" />
              </div>
              <div className="city-info">
                <h3>Ladakh</h3>
                <p className="city-description">Land of high passes - Adventure and Buddhist monasteries</p>
                <div className="city-highlights">
                  <span className="city-highlight">Adventure</span>
                  <span className="city-highlight">Monasteries</span>
                  <span className="city-highlight">Landscape</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Selected City Modal */}
        {selectedCity && (
          <div className="city-modal" onClick={() => setSelectedCity(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedCity(null)}>×</button>
              <h2>{citiesData[selectedCity].name}</h2>
              <p className="modal-location">📍 {citiesData[selectedCity].location}</p>
              <div className="modal-section">
                <h3>📖 History</h3>
                <p>{citiesData[selectedCity].history}</p>
              </div>
              <div className="modal-section">
                <h3>✨ Significance</h3>
                <p>{citiesData[selectedCity].significance}</p>
              </div>
              <div className="modal-section">
                <h3>📅 Best Time to Visit</h3>
                <p>{citiesData[selectedCity].bestTime}</p>
              </div>
              <div className="modal-section">
                <h3>⭐ Highlights</h3>
                <ul>
                  {citiesData[selectedCity].highlights.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Ancient Period */}
        <section className="history-section ancient-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🏛️</span>
              Ancient Period (3000 BCE - 1200 CE)
            </h2>
            <div className="timeline-marker">3000 BCE - 1200 CE</div>
          </div>
          
          <div className="section-content">
            <div className="text-content">
              <h3 className="subsection-title">Birth of Spiritual & Educational Tourism</h3>
              <p className="section-text">
                India's tourism heritage began with religious pilgrimages to sacred sites like 
                <strong> Varanasi, Ayodhya, Mathura, Dwarka, Puri, and Rameswaram</strong>. These 
                journey traditions, known as 'Tirtha Yatra', have continued unbroken for over 3000 years.
              </p>
              
              <div className="highlight-box">
                <h4>🎓 Ancient Learning Centers</h4>
                <p><strong>Takshashila (6th century BCE)</strong> - World's first international university attracted students from Babylon, Greece, Syria, and China.<br/>
                <strong>Nalanda University (5th century CE)</strong> - Housing over 10,000 students and 2,000 teachers from across Asia.</p>
              </div>
              
              <div className="facts-grid">
                <div className="fact-card">
                  <div className="fact-icon">📜</div>
                  <div className="fact-text">Rigveda mentions pilgrimage traditions</div>
                </div>
                <div className="fact-card">
                  <div className="fact-icon">🛣️</div>
                  <div className="fact-text">Grand Trunk Road established</div>
                </div>
                <div className="fact-card">
                  <div className="fact-icon">🕌</div>
                  <div className="fact-text">Char Dham pilgrimage established</div>
                </div>
              </div>
            </div>
            
            <div className="image-content">
              <img 
                src="https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Ancient Nalanda University"
                className="section-image"
              />
              <div className="image-caption">Nalanda University Ruins - Ancient Learning Hub</div>
            </div>
          </div>
        </section>

        {/* Medieval Period */}
        <section className="history-section medieval-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🏰</span>
              Medieval Period (1200 CE - 1800 CE)
            </h2>
            <div className="timeline-marker">1200 CE - 1800 CE</div>
          </div>
          
          <div className="section-content reversed">
            <div className="image-content">
              <img 
                src="https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Medieval Architecture"
                className="section-image"
              />
              <div className="image-caption">Mughal Architectural Marvels</div>
            </div>
            
            <div className="text-content">
              <h3 className="subsection-title">Era of Architectural Wonders</h3>
              <p className="section-text">
                The medieval period saw the construction of India's most iconic monuments that 
                continue to attract millions of tourists today.
              </p>
              
              <div className="monuments-grid">
                <div className="monument-card">
                  <div className="monument-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"}}></div>
                  <div className="monument-info">
                    <h4>Taj Mahal</h4>
                    <p>Agra (1632-1653)</p>
                  </div>
                </div>
                <div className="monument-card">
                  <div className="monument-image" style={{backgroundImage: "url('https://images.unsplash.com/photo-1601046988915-693d2f71a89f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0')"}}></div>
                  <div className="monument-info">
                    <h4>Qutub Minar</h4>
                    <p>Delhi (1193)</p>
                  </div>
                </div>
                <div className="monument-card">
                  <div className="monument-image" style={{backgroundImage: "url('https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7?w=600&auto=format&fit=crop&q=60')"}}></div>
                  <div className="monument-info">
                    <h4>Red Fort</h4>
                    <p>Delhi (1639-1648)</p>
                  </div>
                </div>
              </div>
              
              <div className="quote-box">
                <p className="quote-text">
                  "If there is a paradise on earth, it is this, it is this, it is this!"
                </p>
                <p className="quote-author">— Emperor Shah Jahan on Kashmir</p>
              </div>
            </div>
          </div>
        </section>

        {/* Colonial Period */}
        <section className="history-section colonial-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⚓</span>
              Colonial Period (1800 CE - 1947 CE)
            </h2>
            <div className="timeline-marker">1800 CE - 1947 CE</div>
          </div>
          
          <div className="section-content">
            <div className="text-content">
              <h3 className="subsection-title">The British Era & Modern Tourism</h3>
              <p className="section-text">
                The British colonial period introduced organized tourism to India, including:
              </p>
              
              <ul className="feature-list">
                <li>
                  <span className="list-icon">🏔️</span>
                  <strong>Hill Stations:</strong> Shimla, Darjeeling, Ooty, Munnar developed as summer retreats
                </li>
                <li>
                  <span className="list-icon">🚂</span>
                  <strong>Railway Network:</strong> Extensive train routes made travel accessible
                </li>
                <li>
                  <span className="list-icon">🏨</span>
                  <strong>Heritage Hotels:</strong> Palaces and havelis converted into luxury accommodations
                </li>
                <li>
                  <span className="list-icon">🦁</span>
                  <strong>Wildlife Tourism:</strong> Jim Corbett National Park established (1936)
                </li>
              </ul>
              
              <div className="quote-box">
                <p className="quote-text">
                  "India is the cradle of the human race, the birthplace of human speech, 
                  the mother of history, the grandmother of legend, and the great-grandmother of tradition."
                </p>
                <p className="quote-author">— Mark Twain</p>
              </div>
            </div>
            
            <div className="image-content">
              <img 
                src="https://images.unsplash.com/photo-1593693399746-4d8ccd0b8e33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Colonial Architecture"
                className="section-image"
              />
              <div className="image-caption">Colonial Heritage - Victoria Memorial, Kolkata</div>
            </div>
          </div>
        </section>

        {/* Modern Period */}
        <section className="history-section modern-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">🚀</span>
              Modern Period (1947 CE - Present)
            </h2>
            <div className="timeline-marker">1947 CE - Present</div>
          </div>
          
          <div className="section-content reversed">
            <div className="image-content">
              <img 
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Modern India"
                className="section-image"
              />
              <div className="image-caption">Modern Tourism Infrastructure</div>
            </div>
            
            <div className="text-content">
              <h3 className="subsection-title">Post-Independence Tourism Boom</h3>
              
              <div className="milestones">
                <div className="milestone">
                  <div className="milestone-year">1949</div>
                  <div className="milestone-content">
                    <h4>First Tourism Policy</h4>
                    <p>Tourism recognized as an economic activity</p>
                  </div>
                </div>
                
                <div className="milestone">
                  <div className="milestone-year">1966</div>
                  <div className="milestone-content">
                    <h4>ITDC Established</h4>
                    <p>India Tourism Development Corporation formed</p>
                  </div>
                </div>
                
                <div className="milestone">
                  <div className="milestone-year">2002</div>
                  <div className="milestone-content">
                    <h4>"Incredible India" Campaign</h4>
                    <p>Global marketing initiative launched</p>
                  </div>
                </div>
                
                <div className="milestone">
                  <div className="milestone-year">2020</div>
                  <div className="milestone-content">
                    <h4>Dekho Apna Desh</h4>
                    <p>Promoting domestic tourism</p>
                  </div>
                </div>
              </div>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">10.9M+</div>
                  <div className="stat-label">Foreign Tourists (2019)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">2.1B+</div>
                  <div className="stat-label">Domestic Visits (2019)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">40+</div>
                  <div className="stat-label">UNESCO World Heritage Sites</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">$30B+</div>
                  <div className="stat-label">Annual Tourism Revenue</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section className="history-section future-section">
          <div className="future-content">
            <h2 className="future-title">The Future of Indian Tourism 🌟</h2>
            <p className="future-text">
              India is embracing sustainable tourism, digital innovation, and experiential travel 
              while preserving its rich heritage for future generations.
            </p>
            
            <div className="future-trends">
              <div className="trend-card">
                <div className="trend-icon">🌿</div>
                <h3>Sustainable Tourism</h3>
                <p>Eco-resorts, responsible travel, and conservation initiatives</p>
              </div>
              <div className="trend-card">
                <div className="trend-icon">📱</div>
                <h3>Digital Experience</h3>
                <p>Virtual tours, AR/VR experiences, and smart destinations</p>
              </div>
              <div className="trend-card">
                <div className="trend-icon">🎭</div>
                <h3>Experiential Travel</h3>
                <p>Homestays, village tours, and cultural immersion programs</p>
              </div>
              <div className="trend-card">
                <div className="trend-icon">🩺</div>
                <h3>Medical & Wellness</h3>
                <p>World-class healthcare, Ayurveda, and wellness retreats</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="conclusion-section">
          <div className="conclusion-content">
            <h2 className="conclusion-title">A Timeless Journey Continues...</h2>
            <p className="conclusion-text">
              From ancient pilgrims seeking enlightenment to modern travelers exploring diverse landscapes, 
              India's tourism story is one of continuous evolution, adaptation, and enduring appeal.
            </p>
            <div className="conclusion-quote">
              <p>"India will teach us the tolerance and gentleness of mature mind, 
              understanding spirit and a unifying, pacifying love for all human beings."</p>
              <p className="quote-author">— Will Durant</p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .city-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
          background: white;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          padding: 2rem;
          border-radius: 16px;
          position: relative;
          animation: slideUp 0.3s ease;
        }
        
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
          transition: all 0.3s ease;
        }
        
        .modal-close:hover {
          color: #000;
          transform: rotate(90deg);
        }
        
        .modal-location {
          color: #666;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .modal-section {
          margin-bottom: 1.5rem;
        }
        
        .modal-section h3 {
          color: #6366f1;
          margin-bottom: 0.5rem;
        }
        
        .modal-section ul {
          padding-left: 1.5rem;
        }
        
        .modal-section li {
          margin: 0.5rem 0;
          color: #666;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .modal-content {
            padding: 1.5rem;
            max-height: 90vh;
          }
          
          .modal-section h3 {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default History;
