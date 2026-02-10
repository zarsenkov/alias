import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check, X, RotateCcw } from 'lucide-react';

// --- БАЗА СЛОВ ---
const ALIAS_WORDS = ["Синхрофазотрон", "Оливье", "Гравитация", "Шахматы", "Трамвай", "Звездопад", "Борщ", "Айсберг", "Чебурашка"];

export default function App() {
  const [screen, setScreen] = useState('start'); // start, play, result
  const [word, setWord] = useState('');
  const [score, setScore] = useState(0);

  // --- ПОЛУЧИТЬ СЛОВО ---
  // Берет случайное значение из массива
  const nextWord = () => setWord(ALIAS_WORDS[Math.floor(Math.random() * ALIAS_WORDS.length)]);

  // --- СТАРТ РАУНДА ---
  const startRound = () => {
    setScore(0);
    nextWord();
    setScreen('play');
  };

  return (
    <div style={styles.container}>
      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: СТАРТ */}
        {screen === 'start' && (
          <motion.div key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.content}>
            <h1 style={styles.logo}>ALIAS<span style={{color: '#FF4400'}}>.</span></h1>
            <p style={styles.desc}>Объясняйте слова, не используя однокоренные.</p>
            <button className="swiss-button" style={styles.mainBtn} onClick={startRound}>
              НАЧАТЬ <Play size={20} fill="white" />
            </button>
          </motion.div>
        )}

        {/* ЭКРАН 2: ИГРА */}
        {screen === 'play' && (
          <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.content}>
            <div style={styles.scoreCounter}>{score}</div>
            <motion.h2 key={word} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={styles.wordDisplay}>
              {word}
            </motion.h2>
            
            <div style={styles.controls}>
              <button style={styles.skipBtn} onClick={nextWord}><X size={32} /></button>
              <button style={styles.doneBtn} onClick={() => { setScore(score+1); nextWord(); }}><Check size={32} /></button>
            </div>
            
            <button style={styles.endBtn} onClick={() => setScreen('start')}>ЗАВЕРШИТЬ</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// --- СТИЛИ SWISS ---
const styles = {
  container: { height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' },
  content: { textAlign: 'center', width: '100%', maxWidth: '500px' },
  logo: { fontSize: '64px', fontWeight: '900', letterSpacing: '-3px', margin: '0 0 20px 0' },
  desc: { fontSize: '16px', lineHeight: '1.5', marginBottom: '40px', fontWeight: '400' },
  mainBtn: { width: '100%', padding: '24px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', cursor: 'pointer' },
  wordDisplay: { fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', margin: '60px 0' },
  scoreCounter: { fontSize: '120px', fontWeight: '900', opacity: 0.05, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: -1 },
  controls: { display: 'flex', gap: '20px', marginBottom: '40px' },
  skipBtn: { flex: 1, padding: '30px', background: '#F2F2F2', border: 'none', cursor: 'pointer' },
  doneBtn: { flex: 1, padding: '30px', background: '#FF4400', color: 'white', border: 'none', cursor: 'pointer' },
  endBtn: { background: 'none', border: 'none', textDecoration: 'underline', fontSize: '12px', fontWeight: '900', cursor: 'pointer', opacity: 0.3 }
};
