import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// --- БАЗА СЛОВ ---
const DICTIONARY = {
  "❤️ ХОТ": ["Свидание", "Поцелуй", "Романтика", "Страсть", "Флирт", "Сердце", "Ужин"],
  "🥳 ПАТИ": ["Танцы", "Караоке", "Коктейль", "Музыка", "Друзья", "Вечеринка", "Смех"],
  "🧠 УМ": ["Интеллект", "Логика", "Философия", "Космос", "Наука", "Квант", "Теория"]
};

export default function App() {
  // --- СОСТОЯНИЯ (STATE) ---
  const [screen, setScreen] = useState('setup'); // setup, ready, game, results
  const [teams, setTeams] = useState([
    { name: 'Команда 1', score: 0 },
    { name: 'Команда 2', score: 0 }
  ]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [category, setCategory] = useState("❤️ ХОТ");
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [currentWord, setCurrentWord] = useState('');
  const [wordsLog, setWordsLog] = useState([]); // Для экрана итогов раунда

  // --- ЛОГИКА ТАЙМЕРА ---
  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setScreen('results');
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // --- ФУНКЦИИ ---

  // Выбор нового слова
  const nextWord = useCallback(() => {
    const list = DICTIONARY[category];
    const word = list[Math.floor(Math.random() * list.length)];
    setCurrentWord(word);
  }, [category]);

  // Старт подготовки
  const prepareRound = (cat) => {
    setCategory(cat);
    setTimer(60);
    setWordsLog([]);
    setScreen('ready');
  };

  // Старт раунда
  const startRound = () => {
    setScreen('game');
    setIsActive(true);
    nextWord();
  };

  // Кнопка "Угадано"
  const handleScore = (isCorrect) => {
    const entry = { word: currentWord, correct: isCorrect };
    setWordsLog([entry, ...wordsLog]);
    
    // Обновляем общий счет команды сразу
    const newTeams = [...teams];
    newTeams[currentTeamIdx].score += isCorrect ? 1 : -1;
    setTeams(newTeams);
    
    nextWord();
  };

  // Переключение команды и выход в лобби
  const finishTurn = () => {
    setCurrentTeamIdx(currentTeamIdx === 0 ? 1 : 0);
    setScreen('setup');
  };

  return (
    <div className="app-shell">
      
      {/* HEADER (Показывается в игре) */}
      <header className={`pop-header ${screen === 'game' ? 'visible' : ''}`}>
        <div className="timer-bubble">⏱ {timer}s</div>
        <div className="score-pill">🏆 {teams[currentTeamIdx].score}</div>
      </header>

      <AnimatePresence mode="wait">
        
        {/* ЭКРАН 1: SETUP */}
        {screen === 'setup' && (
          <motion.div key="setup" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="pop-screen active">
            <h1 className="pop-title">ALIAS<span>POP</span></h1>
            
            <div className="section-label">Выберите категорию</div>
            <div className="chips-group">
              {Object.keys(DICTIONARY).map(cat => (
                <button 
                  key={cat} 
                  className={`pop-chip ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="summary-box">
              Ход: {teams[currentTeamIdx].name}<br/>
              Общий счет: {teams[currentTeamIdx].score}
            </div>

            <button className="btn-pop-main" onClick={() => prepareRound(category)}>
              К ИГРЕ
            </button>
          </motion.div>
        )}

        {/* ЭКРАН 2: READY */}
        {screen === 'ready' && (
          <motion.div key="ready" initial={{scale:0.9}} animate={{scale:1}} className="pop-screen active">
            <div className="team-ready-box">
              <div className="section-label">Приготовьтесь</div>
              <h3>{teams[currentTeamIdx].name}</h3>
              <p style={{marginTop: '10px', fontWeight: 800}}>Категория: {category}</p>
            </div>
            <button className="btn-pop-main" onClick={startRound}>Я ГОТОВ(А)!</button>
          </motion.div>
        )}

        {/* ЭКРАН 3: GAME */}
        {screen === 'game' && (
          <motion.div key="game" initial={{y:100}} animate={{y:0}} className="pop-screen active">
            <div className="card-container">
              <div className="word-card">
                <div id="word-display">{currentWord}</div>
              </div>
            </div>
            <div className="swipe-hint">Угадайте как можно больше!</div>
            <div className="game-actions">
              <button className="btn-pop-main btn-skip" onClick={() => handleScore(false)}>ПРОПУСК</button>
              <button className="btn-pop-main btn-check" onClick={() => handleScore(true)}>УГАДАНО</button>
            </div>
          </motion.div>
        )}

        {/* ЭКРАН 4: RESULTS (ИТОГИ РАУНДА) */}
        {screen === 'results' && (
          <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}} className="pop-screen active">
            <h2 className="pop-title" style={{fontSize: '2rem'}}>ИТОГИ</h2>
            <div className="pop-list">
              {wordsLog.map((item, i) => (
                <div key={i} className="word-row">
                  <span>{item.word}</span>
                  <div className={`status-icon ${item.correct ? 'status-ok' : 'status-err'}`}>
                    {item.correct ? '✔' : '✘'}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-pop-main" onClick={finishTurn}>ПЕРЕДАТЬ ХОД</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
