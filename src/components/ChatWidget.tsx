'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Merhaba! Size nasıl yardımcı olabilirim?', sender: 'received' },
    { id: 2, text: 'Ders 3\'teki ritimde takıldım, yardımcı olur musunuz?', sender: 'sent' },
    { id: 3, text: 'Tabii ki. Lütfen sorunuzu detaylandırın, ilgili eğitmen en kısa sürede dönecektir.', sender: 'received' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now(), text: message, sender: 'sent' }]);
    setMessage('');
    
    // Mock auto-reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Mesajınız alındı, en kısa sürede döneceğiz!', sender: 'received' }]);
    }, 1500);
  };

  return (
    <div className={styles.chatContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>Canlı Destek / Eğitmen Soruları</h3>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className={styles.chatBody}>
            {messages.map(msg => (
              <div key={msg.id} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className={styles.chatFooter}>
            <input 
              type="text" 
              className={styles.chatInput} 
              placeholder="Bir mesaj yazın..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className={styles.sendBtn} onClick={handleSend}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      <button className={styles.chatToggleBtn} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
