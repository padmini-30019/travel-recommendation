import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, MapPin, IndianRupee, Hotel, Plane as PlaneIcon, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', isRich: false, text: 'Hi! I am your AI. Ask me to plan a trip like "Plan a 5-day Goa trip under ₹20,000".' }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSend = () => {
    if(!input.trim()) return;
    setMessages([...messages, { sender: 'user', isRich: false, text: input }]);
    const currentInput = input.toLowerCase();
    setInput('');
    setTimeout(() => {
      if(currentInput.includes('plan') || currentInput.includes('goa') || currentInput.includes('trip')) {
        setMessages(prev => [...prev, { 
           sender: 'ai', isRich: true,
           data: {
              destination: 'Goa, India', budget: '₹20,000',
              hotel: '3-Star Beach Resort (North Goa)', flight: 'Roundtrip via IndiGo',
              plan: 'Day 1: Arrival & Baga Beach\nDay 2: Water sports\nDay 3: Old Goa Tour\nDay 4: Dudhsagar Trek\nDay 5: Departure'
           }
        }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', isRich: false, text: "I can help with that! However, I am most optimized to build structured itineraries for you right here in the chat." }]);
      }
    }, 1200);
  };

  return (
    <>
      <div className="chatbot-fab" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </div>
      
      {isOpen && (
        <div className="glass animate-fade-in chatbot-window" style={{
          position: 'fixed', bottom: '7rem', right: '2rem', width: '400px', height: '600px',
          display: 'flex', flexDirection: 'column', zIndex: 1000, overflow: 'hidden',
          borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{ padding: '1.2rem', background: 'rgba(14, 165, 233, 0.1)', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}><Sparkles size={20}/></div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>AI Assistant</h4>
              <small style={{ color: 'var(--accent)', fontWeight: 600 }}>Online</small>
            </div>
          </div>
          
          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: m.isRich ? '100%' : '85%' }}>
                {m.isRich ? (
                   <div style={{ background: 'var(--surface-color)', border: '1px solid var(--glass-border)', borderRadius: '15px', padding: '1.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                      <h4 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>✨ AI Suggested Itinerary</h4>
                      <p style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', marginBottom: '0.5rem' }}><MapPin size={16} color="var(--accent)"/> <strong>Destination:</strong> {m.data.destination}</p>
                      <p style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', marginBottom: '0.5rem' }}><IndianRupee size={16} color="var(--accent)"/> <strong>Budget:</strong> {m.data.budget}</p>
                      <p style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', marginBottom: '0.5rem' }}><Hotel size={16} color="var(--accent)"/> <strong>Hotel:</strong> {m.data.hotel}</p>
                      <p style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem', marginBottom: '0.5rem' }}><PlaneIcon size={16} color="var(--accent)"/> <strong>Flights:</strong> {m.data.flight}</p>
                      <hr style={{ borderColor: 'var(--glass-border)', margin: '1rem 0' }}/>
                      <pre style={{ fontFamily: 'inherit', fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>{m.data.plan}</pre>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                         <button className="btn-primary" onClick={() => navigate('/plan')} style={{ padding: '0.5rem', fontSize: '0.8rem', flex: 1 }}>Apply Plan</button>
                         <button className="btn-secondary" style={{ padding: '0.5rem', fontSize: '0.8rem', flex: 1 }}>Modify</button>
                      </div>
                   </div>
                ) : (
                   <div style={{ 
                     background: m.sender === 'user' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)', 
                     color: 'white', border: m.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                     padding: '1rem', borderRadius: '18px', borderBottomRightRadius: m.sender === 'user' ? '0' : '18px', borderBottomLeftRadius: m.sender === 'ai' ? '0' : '18px',
                     fontSize: '0.95rem', lineHeight: '1.5'
                   }}>
                     {m.text}
                   </div>
                )}
              </div>
            ))}
          </div>
          
          <div style={{ padding: '1.2rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.8rem' }}>
            <input 
              type="text" 
              placeholder="Message AI..." 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="form-control" style={{ padding: '0.8rem 1.2rem', borderRadius: '25px', flex: 1, background: 'rgba(255,255,255,0.05)' }}
            />
            <button onClick={handleSend} style={{ background: 'var(--primary)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', color: 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
