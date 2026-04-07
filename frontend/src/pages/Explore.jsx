import React, { useState } from 'react';
import { Compass, ExternalLink } from 'lucide-react';

function Explore() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="animate-fade-in" style={{ padding: '100px 5% 4rem', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h1 className="section-title" style={{ marginBottom: '0.5rem' }}><Compass size={32} style={{ marginRight: '10px'}}/> Explore Destinations</h1>
          <p style={{ color: 'var(--text-muted)' }}>Interactive 3D Map View powered by OpenStreetMap</p>
        </div>
        <button className="btn-secondary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
           <ExternalLink size={16} /> Open in new tab
        </button>
      </div>
      
      <div className="glass" style={{ flex: 1, borderRadius: '20px', overflow: 'hidden', position: 'relative' }}>
        {loading && <div style={{ position: 'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', color:'var(--primary)' }}>Loading Global Map...</div>}
        <iframe 
          width="100%" 
          height="100%" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight="0" 
          marginWidth="0" 
          src="https://www.openstreetmap.org/export/embed.html?bbox=-180,-70,180,70&layer=mapnik" 
          style={{ border: 'none', filter: 'contrast(1.1) brightness(0.9)', opacity: loading ? 0 : 1, transition: 'opacity 0.5s' }}
          onLoad={() => setLoading(false)}
          title="3D Map View"
        ></iframe>
      </div>
    </div>
  );
}

export default Explore;
