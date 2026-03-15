import React from 'react';
import { HELP_DATA } from '../../data/helpData';

const HelpSidebar = ({ currentIndex, setCurrentIndex }) => {
  return (
    <div className="retro-scrollbar" style={{ flex: '1 1 30%', backgroundColor: '#1a1a2e', border: '3px solid #2f3640', borderRadius: '8px', overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ color: '#FFD700', fontSize: '14px', textAlign: 'center', marginBottom: '10px', fontWeight: 'bold' }}>- 도움말 목차 -</div>
      
      {HELP_DATA.map((item, index) => (
        <button
          key={item.id}
          onClick={() => setCurrentIndex(index)}
          style={{
            padding: '12px 10px', textAlign: 'left', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', borderRadius: '6px',
            backgroundColor: currentIndex === index ? '#4a69bd' : '#222',
            color: currentIndex === index ? '#fff' : '#aaa',
            border: currentIndex === index ? '2px solid #fff' : '2px solid #444',
            transition: 'all 0.1s'
          }}
        >
          {index + 1}. {item.title}
        </button>
      ))}
    </div>
  );
};

export default HelpSidebar;