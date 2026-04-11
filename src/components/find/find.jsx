// src/components/TourismMap.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './find.css';

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
const hotelIcon = createCustomIcon('orange');
const attractionIcon = createCustomIcon('green');
const museumIcon = createCustomIcon('purple');
const guestHouseIcon = createCustomIcon('brown');

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
  const [mapCenter, setMapCenter] = useState([25.3176, 82.9739]);
  const [mapZoom, setMapZoom] = useState(12);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [states, setStates] = useState(['all']);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, byType: {} });
  const [geoLocationSupported, setGeoLocationSupported] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isAutoLoading, setIsAutoLoading] = useState(true);
  const [isAutoPageLoading, setIsAutoPageLoading] = useState(true); // Auto page loading every 2 seconds
  const [autoLoadTimer, setAutoLoadTimer] = useState(null);
  
  const mapRef = useRef(null);
  const sidebarRef = useRef(null);
  const observerRef = useRef(null);
  const ITEMS_PER_PAGE = 20;

  // Use hosted backend URL
  const API_URL = 'https://places-api-ahrd.onrender.com/api';

  const availableTypes = [
    'all', 'hotel', 'attraction', 'guest_house', 'museum', 
    'restaurant', 'temple', 'park', 'monument', 'fort'
  ];

  // Check mobile and geolocation support
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) setShowSidebar(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    if (!navigator.geolocation) {
      setGeoLocationSupported(false);
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Extract unique states and cities from places data
  const extractFiltersFromData = (places) => {
    const uniqueStates = new Set();
    const citiesMap = new Map();
    
    places.forEach(place => {
      if (place.state && place.state !== 'N/A' && place.state !== 'undefined') {
        uniqueStates.add(place.state);
      }
      
      if (place.city && place.city !== 'N/A' && place.city !== 'undefined' && 
          place.state && place.state !== 'N/A' && place.state !== 'undefined') {
        const key = `${place.city}|${place.state}`;
        if (!citiesMap.has(key)) {
          citiesMap.set(key, { city: place.city, state: place.state, count: 1 });
        } else {
          const existing = citiesMap.get(key);
          existing.count++;
          citiesMap.set(key, existing);
        }
      }
    });
    
    setStates(['all', ...Array.from(uniqueStates).sort()]);
    setCities(Array.from(citiesMap.values()).sort((a, b) => a.city.localeCompare(b.city)));
  };

  // Load data with pagination
  const loadData = async (page = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setInitialLoading(true);
    }
    
    try {
      let url = `${API_URL}/places?page=${page}&limit=${ITEMS_PER_PAGE}`;
      
      if (selectedType && selectedType !== 'all') {
        url += `&type=${encodeURIComponent(selectedType)}`;
      }
      if (selectedState && selectedState !== 'all') {
        url += `&state=${encodeURIComponent(selectedState)}`;
      }
      if (selectedCity) {
        url += `&city=${encodeURIComponent(selectedCity)}`;
      }
      
      console.log('Fetching from hosted API:', url);
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data.success) {
        const newPlaces = response.data.places || [];
        
        if (append) {
          setTourismPlaces(prev => {
            const updated = [...prev, ...newPlaces];
            console.log(`Total places after append: ${updated.length}`);
            return updated;
          });
        } else {
          setTourismPlaces(newPlaces);
          extractFiltersFromData(newPlaces);
        }
        
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
          setTotalItems(response.data.pagination.totalItems);
          setHasMore(response.data.pagination.hasNextPage);
          console.log('Pagination:', {
            currentPage: response.data.pagination.currentPage,
            totalPages: response.data.pagination.totalPages,
            totalItems: response.data.pagination.totalItems,
            hasNextPage: response.data.pagination.hasNextPage
          });
        }
        
        const allCurrentPlaces = append ? [...tourismPlaces, ...newPlaces] : newPlaces;
        const byType = {};
        allCurrentPlaces.forEach(place => {
          const type = place.tags?.tourism || place.category || 'other';
          byType[type] = (byType[type] || 0) + 1;
        });
        
        setStats({
          total: response.data.pagination?.totalItems || newPlaces.length,
          byType
        });
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(`Failed to load data: ${err.message}`);
      
      if (err.code === 'ECONNABORTED') {
        setError('Connection timeout. Please check your internet connection and try again.');
      } else if (err.response?.status === 404) {
        setError('API endpoint not found. Please check if the backend is deployed correctly.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setInitialLoading(false);
    }
  };

  // Auto load next page every 2 seconds
  const startAutoPageLoading = useCallback(() => {
    if (autoLoadTimer) {
      clearInterval(autoLoadTimer);
    }
    
    if (!isAutoPageLoading || !hasMore || loadingMore || loading) {
      return;
    }
    
    const timer = setInterval(() => {
      if (hasMore && !loadingMore && !loading && isAutoPageLoading && currentPage < totalPages) {
        console.log('Auto loading next page after 2 seconds...');
        const nextPage = currentPage + 1;
        if (nextPage <= totalPages) {
          loadData(nextPage, true);
          
          // Auto scroll to bottom to see new content
          setTimeout(() => {
            if (sidebarRef.current) {
              sidebarRef.current.scrollTo({
                top: sidebarRef.current.scrollHeight,
                behavior: 'smooth'
              });
            }
          }, 500);
        }
      }
    }, 2000); // 2 seconds interval
    
    setAutoLoadTimer(timer);
  }, [isAutoPageLoading, hasMore, loadingMore, loading, currentPage, totalPages]);

  // Stop auto page loading
  const stopAutoPageLoading = () => {
    if (autoLoadTimer) {
      clearInterval(autoLoadTimer);
      setAutoLoadTimer(null);
    }
  };

  // Toggle auto page loading
  const toggleAutoPageLoading = () => {
    setIsAutoPageLoading(!isAutoPageLoading);
    if (!isAutoPageLoading) {
      startAutoPageLoading();
    } else {
      stopAutoPageLoading();
    }
  };

  // Load next page manually
  const loadNextPage = () => {
    if (hasMore && !loadingMore && !loading) {
      const nextPage = currentPage + 1;
      if (nextPage <= totalPages) {
        loadData(nextPage, true);
      }
    }
  };

  // Clear all filters and reset
  const clearAllFilters = () => {
    stopAutoPageLoading();
    setSelectedType('all');
    setSelectedState('all');
    setSelectedCity('');
    setSearchQuery('');
    setSearchResults([]);
    setCurrentPage(1);
    setHasMore(true);
    setTourismPlaces([]);
    loadData(1, false).then(() => {
      if (isAutoPageLoading) {
        setTimeout(() => startAutoPageLoading(), 1000);
      }
    });
    
    const message = document.createElement('div');
    message.className = 'toast-message';
    message.textContent = '✨ All filters cleared! Showing all places ✨';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
  };

  // Setup intersection observer for infinite scroll
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!isAutoLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore && !loading && tourismPlaces.length > 0) {
          console.log('IntersectionObserver triggered - loading more pages');
          loadNextPage();
        }
      },
      {
        root: sidebarRef.current,
        rootMargin: '0px 0px 100px 0px',
        threshold: 0.1
      }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
      observerRef.current = observer;
    }
  }, [hasMore, loadingMore, loading, tourismPlaces.length, isAutoLoading]);

  // Re-setup observer when dependencies change
  useEffect(() => {
    if (!initialLoading && sidebarRef.current) {
      setTimeout(setupObserver, 100);
    }
  }, [setupObserver, initialLoading, tourismPlaces.length, hasMore, isAutoLoading]);

  // Cleanup observer and timer
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (autoLoadTimer) {
        clearInterval(autoLoadTimer);
      }
    };
  }, [autoLoadTimer]);

  // Start auto page loading when data is loaded
  useEffect(() => {
    if (!initialLoading && hasMore && isAutoPageLoading && totalPages > currentPage) {
      startAutoPageLoading();
    }
    return () => stopAutoPageLoading();
  }, [initialLoading, hasMore, isAutoPageLoading, totalPages, currentPage]);

  // Reset and reload when filters change
  useEffect(() => {
    if (!initialLoading) {
      stopAutoPageLoading();
      setCurrentPage(1);
      setHasMore(true);
      setTourismPlaces([]);
      loadData(1, false).then(() => {
        if (isAutoPageLoading) {
          setTimeout(() => startAutoPageLoading(), 1000);
        }
      });
      
      if (sidebarRef.current) {
        sidebarRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [selectedType, selectedState, selectedCity]);

  // Handle type selection
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSelectedState('all');
    setSelectedCity('');
  };

  // Filter by state
  const filterByState = (state) => {
    setSelectedState(state);
    setSelectedCity('');
  };

  // Filter by city
  const filterByCity = (cityName) => {
    if (!cityName) {
      setSelectedCity('');
      setSelectedState('all');
      return;
    }
    
    setSelectedCity(cityName);
    const cityObj = cities.find(c => c.city === cityName);
    if (cityObj) {
      setSelectedState(cityObj.state);
    }
  };

  // Search location using Nominatim
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
    stopAutoPageLoading();
    const coords = [parseFloat(location.lat), parseFloat(location.lon)];
    setSelectedLocation({
      name: location.display_name,
      coordinates: coords
    });
    setMapCenter(coords);
    setMapZoom(13);
    setSearchResults([]);
    setSearchQuery(location.display_name);
    
    try {
      const response = await axios.get(`${API_URL}/nearby`, {
        params: { 
          lat: coords[0], 
          lng: coords[1], 
          maxDistance: 5000,
          page: 1,
          limit: ITEMS_PER_PAGE
        },
        timeout: 10000
      });
      
      if (response.data.success) {
        setTourismPlaces(response.data.places || []);
        if (response.data.pagination) {
          setCurrentPage(response.data.pagination.currentPage);
          setTotalPages(response.data.pagination.totalPages);
          setTotalItems(response.data.pagination.totalItems);
          setHasMore(response.data.pagination.hasNextPage);
        }
        extractFiltersFromData(response.data.places || []);
        
        setSelectedState('all');
        setSelectedCity('');
        setSelectedType('all');
        
        if (isAutoPageLoading) {
          setTimeout(() => startAutoPageLoading(), 1000);
        }
      }
    } catch (err) {
      console.error('Error finding nearby places:', err);
      setError('Failed to find nearby places. Please try again.');
    }
  };

  // Show all places
  const showAllPlaces = () => {
    clearAllFilters();
    setMapCenter([25.3176, 82.9739]);
    setMapZoom(12);
    setSelectedLocation(null);
  };

  // Get user location
  const getUserLocation = () => {
    if (!geoLocationSupported) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        stopAutoPageLoading();
        const coords = [position.coords.latitude, position.coords.longitude];
        setSelectedLocation({
          name: "Your Current Location",
          coordinates: coords
        });
        setMapCenter(coords);
        setMapZoom(13);
        
        try {
          const response = await axios.get(`${API_URL}/nearby`, {
            params: { 
              lat: coords[0], 
              lng: coords[1], 
              maxDistance: 5000,
              page: 1,
              limit: ITEMS_PER_PAGE
            },
            timeout: 10000
          });
          
          if (response.data.success && response.data.places && response.data.places.length > 0) {
            setTourismPlaces(response.data.places);
            if (response.data.pagination) {
              setCurrentPage(response.data.pagination.currentPage);
              setTotalPages(response.data.pagination.totalPages);
              setTotalItems(response.data.pagination.totalItems);
              setHasMore(response.data.pagination.hasNextPage);
            }
            extractFiltersFromData(response.data.places);
            
            setSelectedState('all');
            setSelectedCity('');
            setSelectedType('all');
            
            if (isAutoPageLoading) {
              setTimeout(() => startAutoPageLoading(), 1000);
            }
          } else {
            alert("No tourist places found near your location. Showing all places instead.");
            loadData(1, false);
          }
        } catch (err) {
          console.error('Error finding nearby places:', err);
          loadData(1, false);
        }
        
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to get your location. Please check your browser permissions.");
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Get icon based on type
  const getIconForPlace = (place) => {
    const type = place.tags?.tourism || place.category;
    
    switch (type) {
      case 'hotel': return hotelIcon;
      case 'attraction': return attractionIcon;
      case 'guest_house': return guestHouseIcon;
      case 'museum': return museumIcon;
      case 'historical': return historicalIcon;
      case 'nature': return natureIcon;
      case 'religious': return religiousIcon;
      case 'cultural': return culturalIcon;
      case 'accommodation': return accommodationIcon;
      default: return tourismIcon;
    }
  };

  // Scroll to top of sidebar
  const scrollToTop = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Initial load
  useEffect(() => {
    loadData(1, false);
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

  if (initialLoading) {
    return (
      <div className="tourism-map-container loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading India Tourism Map...</p>
          <p className="loading-subtitle">Connecting to hosted backend...</p>
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
            <button onClick={clearAllFilters} className="clear-filters-button">
              🧹 Clear Filters
            </button>
            <button onClick={() => setIsSatelliteView(!isSatelliteView)} className="satellite-button">
              {isSatelliteView ? '🗺️ Map' : '🛰️ Satellite'}
            </button>
            <button onClick={() => setIsAutoLoading(!isAutoLoading)} className={`auto-load-button ${isAutoLoading ? 'active' : ''}`}>
              {isAutoLoading ? '🔁 Auto' : '⏸️ Manual'}
            </button>
            <button onClick={toggleAutoPageLoading} className={`auto-page-button ${isAutoPageLoading ? 'active' : ''}`}>
              {isAutoPageLoading ? '⏰ Auto Page (2s)' : '⏸️ Stop Auto'}
            </button>
            {isMobile && (
              <button onClick={() => setShowSidebar(!showSidebar)} className="sidebar-toggle">
                {showSidebar ? '📋 Hide' : '📋 Show'}
              </button>
            )}
          </div>

          {totalItems > 0 && (
            <div className="stats-bar">
              <span>📍 Total: <strong>{totalItems}</strong> places</span>
              <span>📄 Page: <strong>{currentPage}</strong> of {totalPages}</span>
              <span>📋 Showing: <strong>{tourismPlaces.length}</strong> places</span>
              <span>📊 Loaded: <strong>{Math.round((tourismPlaces.length / totalItems) * 100)}%</strong></span>
              {isAutoPageLoading && hasMore && (
                <span className="auto-status">⏰ Auto loading every 2s</span>
              )}
              {Object.entries(stats.byType).slice(0, 3).map(([type, count]) => (
                <span key={type} className={`stat-type ${type}`}>
                  {type}: {count}
                </span>
              ))}
            </div>
          )}

          {cities.length > 0 && (
            <div className="city-selector-section">
              <select 
                value={selectedCity} 
                onChange={(e) => filterByCity(e.target.value)}
                className="city-select"
              >
                <option value="">-- Select a City to Explore --</option>
                {cities.map(city => (
                  <option key={`${city.city}-${city.state}`} value={city.city}>
                    {city.city} ({city.state}) - {city.count} places
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-section">
            <select value={selectedState} onChange={(e) => filterByState(e.target.value)}>
              {states.map(state => (
                <option key={state} value={state}>
                  {state === 'all' ? 'All States' : state}
                </option>
              ))}
            </select>
            
            <select value={selectedType} onChange={(e) => handleTypeChange(e.target.value)}>
              {availableTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
              <button onClick={() => loadData(1, false)}>Retry</button>
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
            <div 
              className={`places-sidebar ${isMobile ? 'mobile-sidebar' : ''}`}
              ref={sidebarRef}
              style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
            >
              <div className="sidebar-header">
                <h3>
                  {selectedCity || (selectedState !== 'all' ? selectedState : 'India')}
                  <span className="places-count"> ({totalItems} places)</span>
                </h3>
                <div className="sidebar-controls">
                  <button onClick={scrollToTop} className="scroll-top-button" title="Scroll to top">
                    ⬆️
                  </button>
                  {isMobile && (
                    <button className="close-sidebar" onClick={() => setShowSidebar(false)}>×</button>
                  )}
                </div>
              </div>
              
              {loading && tourismPlaces.length === 0 ? (
                <div className="loading-places">
                  <div className="spinner-small"></div>
                  <p>Loading places...</p>
                </div>
              ) : tourismPlaces.length === 0 ? (
                <div className="no-places">
                  <p>No tourist places found</p>
                  <button onClick={() => loadData(1, false)}>Retry</button>
                </div>
              ) : (
                <>
                  <div className="places-list">
                    {tourismPlaces.map((place, index) => (
                      <div 
                        key={`${place._id}-${index}`} 
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
                        <p className="place-location">{place.city || 'N/A'}, {place.state || 'N/A'}</p>
                        <div className="place-meta">
                          <span className={`place-type ${place.tags?.tourism || place.category || 'tourist'}`}>
                            {place.tags?.tourism || place.category || 'tourist'}
                          </span>
                          {place.rating && place.rating > 0 && (
                            <span className="place-rating">⭐ {place.rating}</span>
                          )}
                        </div>
                        {place.description && (
                          <p className="place-description">{place.description.substring(0, 100)}...</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="pagination-controls">
                    {currentPage > 1 && (
                      <button onClick={scrollToTop} className="pagination-button">
                        ⬆️ Scroll to Top
                      </button>
                    )}
                    {hasMore && !loadingMore && (
                      <button onClick={loadNextPage} className="pagination-button load-more-btn">
                        📥 Load More ({currentPage}/{totalPages})
                      </button>
                    )}
                    {isAutoPageLoading && hasMore && (
                      <div className="auto-loading-indicator">
                        🤖 Auto loading next page in 2s...
                      </div>
                    )}
                  </div>
                  
                  {/* Sentinel element for IntersectionObserver */}
                  <div id="scroll-sentinel" style={{ height: '20px', margin: '10px 0' }}></div>
                  
                  {loadingMore && (
                    <div className="loading-more">
                      <div className="spinner-small"></div>
                      <p>Loading more places...</p>
                    </div>
                  )}
                  
                  {!hasMore && totalItems > ITEMS_PER_PAGE && tourismPlaces.length === totalItems && (
                    <div className="end-of-list">
                      <p>✨ You've seen all {totalItems} places! ✨</p>
                      <button onClick={scrollToTop} className="scroll-top-bottom-btn">
                        ⬆️ Scroll to Top
                      </button>
                    </div>
                  )}
                  
                  {hasMore && !loadingMore && tourismPlaces.length > 0 && isAutoLoading && (
                    <div className="scroll-hint">
                      <p>↓ Scroll down to load more places ↓</p>
                    </div>
                  )}
                  
                  {hasMore && !isAutoLoading && (
                    <div className="manual-load-hint">
                      <p>🔘 Auto-scroll is OFF. Click "Load More" to get more places.</p>
                    </div>
                  )}
                </>
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
                    icon={getIconForPlace(place)}
                  >
                    <Popup>
                      <div className="popup-content">
                        <h4>{place.name}</h4>
                        <p><strong>📍 {place.city || 'N/A'}, {place.state || 'N/A'}</strong></p>
                        <p>🏷️ Type: {place.tags?.tourism || place.category || 'tourist'}</p>
                        {place.description && <p>{place.description.substring(0, 150)}</p>}
                        {place.rating && place.rating > 0 && <p>⭐ Rating: {place.rating}</p>}
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
