import React from 'react';
import ReactDOM from 'react-dom/client';
// Подключаем наш файл стилей (проверь, чтобы имя файла в папке совпадало!)
import './App.css'; 
// Подключаем основной компонент игры
import App from './App';

// Создаем корень приложения и отрисовываем его на странице
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
