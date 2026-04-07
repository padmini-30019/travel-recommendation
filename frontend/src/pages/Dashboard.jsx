import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Plane, Calendar, MapPin, Brain, Star, Trash2 } from 'lucide-react';

function Dashboard({ authUser }) {
  const [savedTrips, setSavedTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const trips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      setSavedTrips(trips);
    } catch(e) {
      console.log('No saved trips found');
    }
  }, []);

  const handleDeleteTrip = (idx) => {
    const updatedTrips = savedTrips.filter((_, i) => i !== idx);
    setSavedTrips(updatedTrips);
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
  };

  const handleOpenItinerary = (trip) => {
    navigate('/plan', { 
      state: { 
        whereTo: trip.destination || 'Unknown', 
        dates: trip.dates, 
        budget: trip.budget, 
        travelers: trip.travelers,
        itinerary: trip.itinerary
      } 
    });
  };

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="animate-fade-in" style={{ padding: '100px 5% 4rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', justifyItems: 'baseline', marginBottom: '2rem' }}>
         <h1 className="section-title" style={{ margin: 0 }}>Welcome, {authUser.name}</h1>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Main Dashboard Content */}
        <div style={{ flex: '3 1 600px' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}><Plane color="var(--primary)" /> Your Saved Trips</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {savedTrips.length === 0 ? (
              <div className="glass" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                 You haven't saved any trips yet! Head over to the home page to start planning.
                 <br/><br/>
                 <button className="btn-primary" onClick={() => navigate('/')} style={{ margin: '0 auto' }}>Plan a new trip</button>
              </div>
            ) : (
              savedTrips.map((trip, idx) => (
                <div key={idx} className="glass destination-card" style={{ padding: '1.5rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.4rem' }}>{trip.destination || 'Unknown'}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ background: 'var(--accent)', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600 }}>Saved</span>
                      <button
                        onClick={() => handleDeleteTrip(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.color = '#ef4444'}
                        title="Delete trip"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Calendar size={16} color="var(--secondary)" /> {trip.dates}
                  </p>
                  
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Star size={16} color="#eab308" /> {trip.travelers} Travelers
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Cost</div>
                      <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>₹{Number(trip.totalCost).toLocaleString('en-IN')}</div>
                    </div>
                    <button 
                      className="btn-secondary" 
                      onClick={() => handleOpenItinerary(trip)}
                      style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
                    >
                      Open Itinerary
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div style={{ flex: '1 1 300px' }}>
          <div className="glass" style={{ padding: '2rem', background: 'linear-gradient(180deg, rgba(15,23,42,0.8) 0%, rgba(139,92,246,0.15) 100%)', borderTop: '4px solid var(--secondary)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              <Brain size={24} color="var(--secondary)" /> AI System Insights
            </h3>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Based on your most recent saved itineraries, our neuro-engine suggests you'd love a cultural escape to <strong>Kyoto, Japan</strong> or an exclusive retreat in <strong>Switzerland</strong>.
            </p>
            <div style={{ padding: '1rem', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent)', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
               Flight predictions indicate a 12% price decrease to Tokyo next Tuesday!
            </div>

            <button className="btn-primary" onClick={() => navigate('/explore')} style={{ width: '100%', justifyContent: 'center' }}>
              <MapPin size={18} /> Explore Recommendations
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
