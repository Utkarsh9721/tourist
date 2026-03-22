// src/components/TourismMap.js
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import '../find/find.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom tourism icons
const createCustomIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const tourismIcon = createCustomIcon('green');
const historicalIcon = createCustomIcon('red');
const natureIcon = createCustomIcon('blue');
const religiousIcon = createCustomIcon('gold');
const culturalIcon = createCustomIcon('violet');
const accommodationIcon = createCustomIcon('orange');

// Custom location icon
const locationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Map controller component
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Map resize component
function MapResize() {
  const map = useMap();
  
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [map]);
  
  return null;
}

// Tile layer controller for satellite view
function TileLayerController({ isSatelliteView }) {
  return isSatelliteView ? (
    <>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
        maxZoom={19}
      />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        opacity={0.3}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
    </>
  ) : (
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      maxZoom={19}
    />
  );
}

const TourismMap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tourismPlaces, setTourismPlaces] = useState([]);
  const [mapCenter, setMapCenter] = useState([25.3176, 82.9739]); // Varanasi center
  const [mapZoom, setMapZoom] = useState(12);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [states, setStates] = useState(['all']);
  const [categories, setCategories] = useState(['all']);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, byCategory: {} });
  const [geoLocationSupported, setGeoLocationSupported] = useState(true);
  const mapRef = useRef(null);

  const API_URL = 'http://localhost:5000/api';

  // Check mobile and geolocation support
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) setShowSidebar(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setGeoLocationSupported(false);
      console.log('Geolocation is not supported by this browser');
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load all data
  const loadAllData = async () => {
    setInitialLoading(true);
    setError(null);
    
    try {
      // Load places
      const placesRes = await axios.get(`${API_URL}/places?limit=500`);
      if (placesRes.data.success) {
        setTourismPlaces(placesRes.data.data);
        setStats({
          total: placesRes.data.pagination.total,
          byCategory: placesRes.data.data.reduce((acc, place) => {
            const cat = place.category || 'other';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
          }, {})
        });
        console.log(`Loaded ${placesRes.data.data.length} places`);
      }
      
      // Load states
      const statesRes = await axios.get(`${API_URL}/places/states/list`);
      if (statesRes.data.success && statesRes.data.data.length > 0) {
        setStates(['all', ...statesRes.data.data.map(s => s.state).filter(s => s)]);
      }
      
      // Load categories
      const categoriesRes = await axios.get(`${API_URL}/places/categories/list`);
      if (categoriesRes.data.success && categoriesRes.data.data.length > 0) {
        setCategories(['all', ...categoriesRes.data.data.map(c => c.category).filter(c => c)]);
      }
      
      // Load cities
      const citiesRes = await axios.get(`${API_URL}/places/cities/list`);
      if (citiesRes.data.success && citiesRes.data.data.length > 0) {
        setCities(citiesRes.data.data);
      }
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load tourism data. Please check if backend is running on port 5000');
    } finally {
      setInitialLoading(false);
    }
  };

  // Load filtered data
  const loadFilteredData = async (filters = {}) => {
    setLoading(true);
    
    try {
      let url = `${API_URL}/places?limit=500`;
      if (filters.state && filters.state !== 'all') url += `&state=${encodeURIComponent(filters.state)}`;
      if (filters.city) url += `&city=${encodeURIComponent(filters.city)}`;
      if (filters.category && filters.category !== 'all') url += `&category=${encodeURIComponent(filters.category)}`;
      
      const response = await axios.get(url);
      
      if (response.data.success) {
        setTourismPlaces(response.data.data);
        
        // Center map on first place if city selected
        if (filters.city && response.data.data.length > 0) {
          const place = response.data.data[0];
          if (place.location?.coordinates) {
            setMapCenter([place.location.coordinates[1], place.location.coordinates[0]]);
            setMapZoom(13);
          }
        }
      }
    } catch (err) {
      console.error('Error loading filtered data:', err);
      setError('Failed to load filtered data');
    } finally {
      setLoading(false);
    }
  };

  // Handle city selection
  const handleCitySelect = async (cityName) => {
    if (!cityName) {
      setSelectedCity('');
      await loadAllData();
      setMapCenter([25.3176, 82.9739]);
      setMapZoom(12);
      return;
    }
    
    setSelectedCity(cityName);
    await loadFilteredData({ 
      city: cityName,
      category: selectedType !== 'all' ? selectedType : undefined,
      state: selectedState !== 'all' ? selectedState : undefined
    });
  };

  // Search location
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', India')}&limit=5`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    }
    setLoading(false);
  };

  // Handle location selection from search
  const handleLocationSelect = async (location) => {
    const coords = [parseFloat(location.lat), parseFloat(location.lon)];
    setSelectedLocation({
      name: location.display_name,
      coordinates: coords
    });
    setMapCenter(coords);
    setMapZoom(13);
    setSearchResults([]);
    setSearchQuery(location.display_name);
    
    // Try to find nearby places
    try {
      const response = await axios.get(`${API_URL}/places/nearby/${coords[1]}/${coords[0]}`, {
        params: { radius: 30 }
      });
      if (response.data.success && response.data.data.length > 0) {
        setTourismPlaces(response.data.data);
      }
    } catch (err) {
      console.error('Error finding nearby places:', err);
    }
  };

  // Show all places
  const showAllPlaces = async () => {
    setSelectedCity('');
    setSelectedState('all');
    setSelectedType('all');
    await loadAllData();
    setMapCenter([25.3176, 82.9739]);
    setMapZoom(12);
    setSelectedLocation(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  // Get user location with better error handling
  const getUserLocation = () => {
    if (!geoLocationSupported) {
      alert("Geolocation is not supported by your browser. Please search for a city instead.");
      return;
    }
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please search for a city instead.");
      return;
    }
    
    setLoading(true);
    
    // Check if we're in a secure context (HTTPS or localhost)
    const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (!isSecure) {
      console.warn('Geolocation works best with HTTPS. You may need to allow location access manually.');
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setSelectedLocation({
          name: "Your Current Location",
          coordinates: coords
        });
        setMapCenter(coords);
        setMapZoom(13);
        
        // Find nearby places
        try {
          const response = await axios.get(`${API_URL}/places/nearby/${coords[1]}/${coords[0]}`, {
            params: { radius: 30 }
          });
          if (response.data.success && response.data.data.length > 0) {
            setTourismPlaces(response.data.data);
          } else {
            alert("No tourist places found near your location. Showing all places instead.");
            await loadAllData();
          }
        } catch (err) {
          console.error('Error finding nearby places:', err);
          await loadAllData();
        }
        
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow location access in your browser settings, or search for a city manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please search for a city manually.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or search for a city.";
            break;
          default:
            errorMessage = "Unable to get your location. Please search for a city instead.";
        }
        
        alert(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Handle filters
  const handleStateChange = async (state) => {
    setSelectedState(state);
    if (state === 'all') {
      await loadFilteredData({ 
        category: selectedType !== 'all' ? selectedType : undefined,
        city: selectedCity || undefined
      });
    } else {
      await loadFilteredData({ 
        state,
        category: selectedType !== 'all' ? selectedType : undefined,
        city: selectedCity || undefined
      });
    }
  };

  const handleTypeChange = async (type) => {
    setSelectedType(type);
    await loadFilteredData({ 
      category: type !== 'all' ? type : undefined,
      state: selectedState !== 'all' ? selectedState : undefined,
      city: selectedCity || undefined
    });
  };

  // Get icon by category
  const getIconForCategory = (category) => {
    switch (category) {
      case 'historical': return historicalIcon;
      case 'nature': return natureIcon;
      case 'religious': return religiousIcon;
      case 'cultural': return culturalIcon;
      case 'accommodation': return accommodationIcon;
      default: return tourismIcon;
    }
  };

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchLocation(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Loading state
  if (initialLoading) {
    return (
      <div className="tourism-map-container loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading India Tourism Map...</p>
          <p className="loading-subtitle">Fetching data from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tourism-map-container">
      <div className="map-content">
        <div className="search-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search for any city, town, or location in India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation(searchQuery)}
                className="search-input"
              />
              {loading && <div className="search-loader"></div>}
            </div>
            <button onClick={() => searchLocation(searchQuery)} className="search-button">
              🔍 Search
            </button>
            <button onClick={getUserLocation} className="location-button" disabled={loading}>
              📍 My Location
            </button>
            <button onClick={showAllPlaces} className="all-india-button">
              🗺️ All India
            </button>
            <button onClick={() => setIsSatelliteView(!isSatelliteView)} className="satellite-button">
              {isSatelliteView ? '🗺️ Map' : '🛰️ Satellite'}
            </button>
            {isMobile && (
              <button onClick={() => setShowSidebar(!showSidebar)} className="sidebar-toggle">
                {showSidebar ? '📋 Hide' : '📋 Show'}
              </button>
            )}
          </div>

          {/* Stats Bar */}
          {stats.total > 0 && (
            <div className="stats-bar">
              <span>📍 Total: <strong>{stats.total}</strong> places</span>
              {Object.entries(stats.byCategory).slice(0, 5).map(([cat, count]) => (
                <span key={cat} className={`stat-category ${cat}`}>
                  {cat}: {count}
                </span>
              ))}
            </div>
          )}

          {/* City Selector */}
          <div className="city-selector-section">
            <select 
              value={selectedCity} 
              onChange={(e) => handleCitySelect(e.target.value)}
              className="city-select"
            >
              <option value="">-- Select a City to Explore --</option>
              {cities.map(city => (
                <option key={city.city} value={city.city}>
                  {city.city} ({city.state}) - {city.count} places
                </option>
              ))}
            </select>
          </div>

          {/* Filters */}
          <div className="filter-section">
            <select value={selectedState} onChange={(e) => handleStateChange(e.target.value)}>
              {states.map(state => (
                <option key={state} value={state}>
                  {state === 'all' ? 'All States' : state}
                </option>
              ))}
            </select>
            
            <select value={selectedType} onChange={(e) => handleTypeChange(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Types' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <button onClick={loadAllData}>Retry</button>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result, i) => (
                <div key={i} className="search-result-item" onClick={() => handleLocationSelect(result)}>
                  <div className="result-name">{result.display_name}</div>
                  <div className="result-type">{result.type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="map-layout">
          {(showSidebar || !isMobile) && (
            <div className={`places-sidebar ${isMobile ? 'mobile-sidebar' : ''}`}>
              <div className="sidebar-header">
                <h3>
                  {selectedCity || (selectedState !== 'all' ? selectedState : 'India')}
                  <span className="places-count"> ({tourismPlaces.length} places)</span>
                </h3>
                {isMobile && (
                  <button className="close-sidebar" onClick={() => setShowSidebar(false)}>×</button>
                )}
              </div>
              
              {loading ? (
                <div className="loading-places">
                  <div className="spinner-small"></div>
                  <p>Loading places...</p>
                </div>
              ) : tourismPlaces.length === 0 ? (
                <div className="no-places">
                  <p>No tourist places found</p>
                  <button onClick={showAllPlaces}>Show All Places</button>
                </div>
              ) : (
                <div className="places-list">
                  {tourismPlaces.map(place => (
                    <div 
                      key={place._id} 
                      className="place-card"
                      onClick={() => {
                        if (place.location?.coordinates) {
                          setMapCenter([place.location.coordinates[1], place.location.coordinates[0]]);
                          setMapZoom(15);
                          if (isMobile) setShowSidebar(false);
                        }
                      }}
                    >
                      <h4>{place.name}</h4>
                      <p className="place-location">{place.city || 'Varanasi'}, {place.state || 'Uttar Pradesh'}</p>
                      <div className="place-meta">
                        <span className={`place-type ${place.category || 'other'}`}>
                          {place.category || 'tourist'}
                        </span>
                        {place.type && (
                          <span className="place-category">{place.type}</span>
                        )}
                        {place.rating > 0 && (
                          <span className="place-rating">⭐ {place.rating}</span>
                        )}
                      </div>
                      {place.description && (
                        <p className="place-description">{place.description.substring(0, 100)}...</p>
                      )}
                      {place.phone && (
                        <p className="place-contact">📞 {place.phone}</p>
                      )}
                      {place.website && (
                        <a href={place.website} target="_blank" rel="noopener noreferrer" className="place-website">
                          🔗 Visit Website
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={`map-container ${!showSidebar && isMobile ? 'full-map' : ''}`}>
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
              whenCreated={(map) => {
                mapRef.current = map;
                setTimeout(() => {
                  map.invalidateSize();
                }, 200);
              }}
            >
              <MapController center={mapCenter} zoom={mapZoom} />
              <MapResize />
              <TileLayerController isSatelliteView={isSatelliteView} />
              
              {selectedLocation && selectedLocation.coordinates && (
                <Marker position={selectedLocation.coordinates} icon={locationIcon}>
                  <Popup>{selectedLocation.name}</Popup>
                </Marker>
              )}
              
              {tourismPlaces.map(place => {
                if (!place.location?.coordinates) return null;
                return (
                  <Marker 
                    key={place._id} 
                    position={[place.location.coordinates[1], place.location.coordinates[0]]}
                    icon={getIconForCategory(place.category)}
                  >
                    <Popup>
                      <div className="popup-content">
                        <h4>{place.name}</h4>
                        <p><strong>📍 {place.city || 'Varanasi'}, {place.state || 'Uttar Pradesh'}</strong></p>
                        {place.type && <p>🏷️ {place.type}</p>}
                        {place.category && <p>🎯 {place.category}</p>}
                        {place.description && <p>{place.description.substring(0, 150)}</p>}
                        {place.phone && <p>📞 {place.phone}</p>}
                        {place.website && (
                          <a href={place.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourismMap;