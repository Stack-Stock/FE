import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EndingScene = ({ onRestart }) => {
  const [step, setStep] = useState('RESULT'); // RESULT, CREDIT

  return (
    <div style={{ 
      width: '100%', height: '100%', backgroundColor: '#000', color: '#fff',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    }}>
      {step === 'RESULT' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', color: '#ffd700', marginBottom: '20px' }}>GAME CLEAR!</h1>
          <p style={{ fontSize: '24px', marginBottom: '40px' }}>10일간의 여정이 끝났습니다.</p>
          <button className="pixel-btn" onClick={() => setStep('CREDIT')}>엔딩 크레딧 보기</button>
        </motion.div>
      )}

      {step === 'CREDIT' && (
        <motion.div 
          initial={{ y: 500 }} 
          animate={{ y: -300 }} 
          transition={{ duration: 10, ease: "linear" }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{ marginBottom: '50px' }}>STAFF</h2>
          <p style={{ marginBottom: '20px' }}>Director: [사용자 이름]</p>
          <p style={{ marginBottom: '20px' }}>Team: 나우유씨미;런타임에러</p>
          <p style={{ marginBottom: '20px' }}>Design: SSAFY 14th</p>
          <p style={{ marginBottom: '100px' }}>Powered by React & Spring Boot</p>
          
          <div style={{ height: '300px' }}></div> {/* 여백 */}
          
          {/* 크레딧이 어느 정도 올라가면 버튼을 보여주기 위해 별도로 처리하거나 하단에 고정 */}
          <button className="pixel-btn" onClick={onRestart}>메인으로 돌아가기</button>
        </motion.div>
      )}

      {/* 크레딧이 올라가는 동안 버튼이 너무 아래에 있으면 안되니, 고정 버튼을 원할 경우 */}
      {step === 'CREDIT' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 5 }} // 5초 뒤에 버튼 등장
          style={{ position: 'absolute', bottom: '50px' }}
        >
          <button className="pixel-btn" onClick={onRestart}>메인 화면으로</button>
        </motion.div>
      )}
    </div>
  );
};

export default EndingScene;