import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles/App.css';
import LoadingScene from './scenes/LoadingScene';
import MainMenu from './components/MainMenu';
import IntroStory from './scenes/IntroStory'; // 새로 추가
import GamePlay from './scenes/GamePlay';
import EndingScene from './scenes/EndingScene';

function App() {
  const [scene, setScene] = useState('LOADING');
  const [gameData, setGameData] = useState({
    day: 1,
    period: 'MORNING',
    money: 250000,
    energy: 2,
  });

  const resetGame = () => {
    setGameData({ day: 1, period: 'MORNING', money: 250000, energy: 2 });
    setScene('MAIN');
  };

  return (
    <div className="game-container">
      <AnimatePresence mode="wait">
        {scene === 'LOADING' && (
          <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <LoadingScene onComplete={() => setScene('MAIN')} />
          </motion.div>
        )}
        
        {scene === 'MAIN' && (
          <motion.div key="main" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            {/* 시작하기 누르면 INTRO로 이동 */}
            <MainMenu onStart={() => setScene('INTRO')} />
          </motion.div>
        )}

        {scene === 'INTRO' && (
          <motion.div key="intro" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <IntroStory onComplete={() => setScene('PLAY')} />
          </motion.div>
        )}

        {scene === 'PLAY' && (
          <motion.div key="play" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <GamePlay 
              data={gameData} 
              onAction={() => {
                setGameData(prev => {
                  if (prev.period === 'MORNING') return { ...prev, period: 'AFTERNOON' };
                  if (prev.day >= 10) { setScene('ENDING'); return prev; }
                  return { ...prev, day: prev.day + 1, period: 'MORNING' };
                });
              }} 
              onGoMain={() => setScene('MAIN')} 
            />
          </motion.div>
        )}

        {scene === 'ENDING' && (
          <motion.div key="ending" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="scene-wrapper">
            <EndingScene onRestart={resetGame} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;