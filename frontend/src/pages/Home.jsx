import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Star, Calendar, Users, IndianRupee, Sparkles, X, CloudRain, Heart, Eye, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [destinations, setDestinations] = useState([]);
  
  // Search state
  const [whereTo, setWhereTo] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState(150000);
  const [travelers, setTravelers] = useState('2');
  const [interests, setInterests] = useState([]);
  
  // Custom states for Ultimate Spec features
  const [compareList, setCompareList] = useState([]);
  const [selectedDest, setSelectedDest] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getDateLabel = () => {
    if (!startDate || !endDate) return '';
    const format = (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${format(startDate)} - ${format(endDate)}`;
  };
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('/api/destinations');
        setDestinations(response.data.filter(dest => dest.name !== 'Paris'));
      } catch (error) { console.error('Error fetching:', error); }
    };
    fetchDestinations();
  }, []);

  const calculateTripDays = () => {
    if (!startDate || !endDate) return 2;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || end < start) return 2;
    return Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handlePlanTrip = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const dates = getDateLabel() || 'Flexible';
      const tripDays = calculateTripDays();
      navigate('/plan', { state: { whereTo, dates, tripDays, budget, travelers, interests } });
    }, 2500); 
  };

  const toggleInterest = (val) => {
    setInterests(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

  const addToCompare = (e, dest) => {
    e.stopPropagation();
    if(compareList.length < 3 && !compareList.find(c => c.id === dest.id)) {
      setCompareList([...compareList, dest]);
    }
  };

  if (isGenerating) {
    return (
      <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)' }}>
        <div className="pulse-ripple"></div>
        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', fontSize: '2rem' }}>Building your personalized journey...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Analyzing flights, weather, and parsing real-time API booking rates.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      
      {/* Comparison Panel */}
      {compareList.length > 0 && (
        <div className="comparison-panel">
           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <ArrowRightLeft color="var(--primary)" />
             <span style={{ fontWeight: 600 }}>Comparing {compareList.length} items</span>
             {compareList.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.4rem 0.8rem', borderRadius: '15px' }}>
                   <span style={{ fontSize: '0.9rem' }}>{item.name}</span>
                   <X size={14} style={{ cursor: 'pointer', color: 'var(--accent)' }} onClick={() => setCompareList(compareList.filter(c => c.id !== item.id))} />
                </div>
             ))}
           </div>
           <button className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>View Comparison</button>
        </div>
      )}

      {/* View Details Modal */}
      {selectedDest && (
        <div className="modal-overlay" onClick={() => setSelectedDest(null)}>
          <div className="glass modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedDest(null)} style={{ position:'absolute', top:'1rem', right:'1rem', background:'transparent', border:'none', color:'var(--text-primary)', cursor:'pointer' }}><X size={24}/></button>
            <img src={selectedDest.imageUrl} alt={selectedDest.name} style={{ width:'100%', height:'250px', objectFit:'cover', borderRadius:'15px', marginBottom:'1.5rem'}} />
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{selectedDest.name}, {selectedDest.country}</h2>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              <span style={{ display:'flex', alignItems:'center', gap:'0.2rem', color:'#fbbf24', fontWeight:'bold' }}><Star size={18} fill="#fbbf24"/> {selectedDest.rating}</span>
              <span style={{ background:'rgba(20, 184, 166, 0.2)', padding:'0.2rem 0.6rem', borderRadius:'10px', fontSize:'0.9rem', color: 'var(--primary)' }}>₹{selectedDest.pricePerNight.toLocaleString('en-IN')} / night</span>
              <span style={{ display:'flex', alignItems:'center', gap:'0.2rem', color:'var(--accent)' }}><CloudRain size={16}/> 24°C</span>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>{selectedDest.description} Live API insights suggest booking now for peak discounts.</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
               <button className="btn-primary" onClick={() => navigate('/plan')} style={{ flex: 1, minWidth: '150px' }}>Book Now</button>
               <button className="btn-secondary" style={{ flex: 1, minWidth: '150px' }}>Save Trip</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-blob bg-1"></div>
        <div className="hero-blob bg-2"></div>
        
        <h1 style={{ fontSize: '5rem', fontWeight: 800, marginBottom: '1rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          Design Your <br/> <span style={{ color: 'var(--primary)' }}>Escape</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2rem' }}>
          Personalized AI itineraries. Global flight tracking. Seamless hotel matching.
        </p>
        
        <div className="complex-search glass" onClick={e => e.stopPropagation()}>
          <div className="search-field">
            <MapPin size={20} color="var(--primary)" />
            <input list="destination-list" type="text" placeholder="Destination" value={whereTo} onChange={e => setWhereTo(e.target.value)} />
            <datalist id="destination-list">
              {destinations.map(dest => (
                <option key={dest.id} value={dest.name} />
              ))}
            </datalist>
          </div>
          
          <div className="search-field" style={{ minWidth: '250px' }}>
            <Calendar size={20} color="var(--primary)" />
            <div style={{ display: 'flex', gap: '0.7rem', width: '100%', flexWrap: 'wrap' }}>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{ flex: 1, width: 'auto', minWidth: '130px', maxWidth: '160px', padding: '0.65rem 0.8rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', cursor: 'pointer' }}
              />
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={e => setEndDate(e.target.value)}
                style={{ flex: 1, width: 'auto', minWidth: '130px', maxWidth: '160px', padding: '0.65rem 0.8rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div className="search-field" style={{ minWidth: '180px' }}>
            <IndianRupee size={20} color="var(--primary)" />
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>Budget</span><span style={{color: 'var(--primary)'}}>₹{Number(budget).toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min="10000" max="500000" step="5000" value={budget} onChange={(e) => setBudget(e.target.value)} style={{ width: '100%', height: '4px' }} />
            </div>
          </div>
          <div className="search-field" style={{ minWidth:'220px', maxWidth: '260px' }}>
            <Users size={20} color="var(--primary)" />
            <select value={travelers} onChange={e => setTravelers(e.target.value)}>
              <option value="1">1 Traveler</option>
              <option value="2">2 Travelers</option>
              <option value="4+">Family (4+)</option>
            </select>
          </div>
          <div className="search-field" style={{ border: 'none', display:'flex', gap:'0.5rem', flexWrap:'wrap', maxWidth: '300px' }}>
             {['Adventure', 'Relax', 'Culture', 'Food'].map(i => (
                <div key={i} onClick={() => toggleInterest(i)} className={`interest-pill ${interests.includes(i) ? 'active' : ''}`}>{i}</div>
             ))}
          </div>
          <button className="btn-primary" onClick={handlePlanTrip} style={{ height: '52px', width: '100%', marginTop: '1rem', fontSize: '1.1rem' }}>
            ✨ Plan My Trip
          </button>
        </div>
      </header>

      {/* AI Results Layout */}
      <section style={{ padding: '4rem 5%', display: 'flex', gap: '2rem', flexWrap: 'wrap' }} className="results-container">
         <div style={{ flex: '1 1 250px', paddingRight: '1rem' }} className="desktop-filters">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Smart Filters</h3>
            {/* Same filters as previously styled... */}
         </div>

         <div style={{ flex: '3 1 800px' }}>
            <h2 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}><Sparkles size={24} style={{ marginRight: '10px', color: 'var(--primary)'}}/> Trending Destinations</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Because you like beaches and culture...</p>

            <div className="destinations-grid">
              {destinations.map((dest, index) => (
                <div key={dest.id} className="destination-card glass" style={{ padding: 0 }}>
                  <img src={dest.imageUrl} alt={dest.name} />
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{dest.name}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button className="icon-btn" onClick={(e) => addToCompare(e, dest)} title="Compare"><ArrowRightLeft size={16}/></button>
                         <button className="icon-btn" title="Save"><Heart size={16}/></button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <span><Star size={14} fill="#fbbf24" color="#fbbf24"/> {dest.rating}</span>
                      <span><CloudRain size={14} /> 25°C</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', marginTop: '1rem' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{dest.pricePerNight.toLocaleString('en-IN')} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>est/night</span>
                      </div>
                      <button className="btn-secondary" onClick={() => setSelectedDest(dest)} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}><Eye size={16} /> View</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </section>
    </div>
  );
}

export default Home;
