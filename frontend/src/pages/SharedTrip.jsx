import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Share2, Clock, Users, MapPin, DollarSign } from 'lucide-react';
import './PlanTrip.css';

export default function SharedTrip() {
  const { shareCode } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState('');

  useEffect(() => {
    fetchSharedTrip();
  }, [shareCode]);

  const fetchSharedTrip = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/shared-trips/${shareCode}`);
      if (!response.ok) {
        throw new Error('Trip not found or has expired');
      }
      const data = await response.json();
      setTrip(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load shared trip');
      setTrip(null);
    } finally {
      setLoading(false);
    }
  };

  const shareTrip = async () => {
    const message = `Check out my itinerary for ${trip.destination}: ${trip.startDate} to ${trip.endDate}. ${trip.travelers} Travelers.`;
    const shareUrl = window.location.href;
    
    const fallbackCopy = (text) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      let success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    };

    try {
      if (navigator.share) {
        await navigator.share({ title: `Itinerary for ${trip.destination}`, text: message, url: shareUrl });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        fallbackCopy(shareUrl);
      }
      setShowToast('Share link copied to clipboard!');
      setTimeout(() => setShowToast(''), 3000);
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const exportPDF = async () => {
    try {
      const element = document.getElementById('trip-content');
      if (!element) return;

      const { jsPDF } = window.jspdf;
      const html2canvas = window.html2canvas;

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`trip-${trip.destination}.pdf`);
      setShowToast('PDF downloaded successfully!');
      setTimeout(() => setShowToast(''), 3000);
    } catch (error) {
      console.error('PDF export failed:', error);
      setShowToast('Failed to export PDF');
    }
  };

  if (loading) {
    return <div className="loading-container"><p>Loading shared trip...</p></div>;
  }

  if (error) {
    return (
      <div className="error-container" style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Unable to Load Trip</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!trip) {
    return <div className="error-container"><p>Trip not found</p></div>;
  }

  const itinerary = trip.itineraryData ? JSON.parse(trip.itineraryData) : [];

  return (
    <div className="plan-trip-container">
      <div className="plan-trip-header">
        <h1>Shared Trip Itinerary</h1>
        {showToast && <div className="toast">{showToast}</div>}
      </div>

      <div className="trip-info-bar" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f4ff', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#2563eb" />
            <span><strong>{trip.destination}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="#2563eb" />
            <span>{trip.days} days</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#2563eb" />
            <span>{trip.travelers} Travelers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={20} color="#2563eb" />
            <span>Budget: ${trip.budget}</span>
          </div>
        </div>
      </div>

      <div className="action-buttons" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={shareTrip} className="action-btn" style={{ backgroundColor: '#2563eb', color: 'white' }}>
          <Share2 size={18} /> Share
        </button>
        <button onClick={exportPDF} className="action-btn" style={{ backgroundColor: '#059669', color: 'white' }}>
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div id="trip-content">
        {itinerary.map((day, index) => (
          <div key={index} className="day-card" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '10px' }}>{day.title || `Day ${index + 1}`}</h3>
            <div className="activities-list">
              {day.activities && day.activities.map((activity, i) => (
                <div key={i} className="activity-item" style={{ marginBottom: '10px', paddingLeft: '15px', borderLeft: '3px solid #2563eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{activity.name}</strong>
                    <span>${activity.cost}</span>
                  </div>
                  <p style={{ margin: '5px 0', color: '#666' }}>{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
