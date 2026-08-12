import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNavbar from '../components/BottomNavbar';
import '../styles/design-system.css'; // ensure design system is applied

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm your Piff AI assistant. How can I help you manage your budget today?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting to the server." }]);
    }
  };

  return (
    <div className="page-container" style={{ paddingBottom: '80px' }}>
      <Navbar />
      <div style={{ padding: '20px', paddingTop: 'calc(64px + 20px)', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
        <h2 className="text-gradient" style={{ marginBottom: '20px' }}>AI Assistant</h2>
        
        <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
              padding: '10px 15px',
              borderRadius: '16px',
              maxWidth: '80%',
              borderBottomRightRadius: msg.sender === 'user' ? '0' : '16px',
              borderBottomLeftRadius: msg.sender === 'ai' ? '0' : '16px',
            }}>
              {msg.text}
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Ask about your budget..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="glass-button" onClick={handleSend}>Send</button>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default AIAssistant;
