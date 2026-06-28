import React, { useState, useEffect } from 'react';

// Адрес бэкенда (при запуске через Docker браузер обращается к localhost:8000)
const API_BASE = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [message, setMessage] = useState('');

  // Загрузка списка при старте
  useEffect(() => {
    fetchItems();
    // Заодно проверим корневой эндпоинт
    fetch(API_BASE + '/')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  const fetchItems = async () => {
    const res = await fetch(API_BASE + '/items');
    const data = await res.json();
    setItems(data);
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const res = await fetch(API_BASE + '/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItemName })
    });
    const newItem = await res.json();
    setItems([...items, newItem]);
    setNewItemName('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>FastAPI + React Demo</h1>
      <p>Сообщение от бэка: <strong>{message}</strong></p>

      <h2>Список предметов</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.id}: {item.name}</li>
        ))}
      </ul>

      <h2>Добавить предмет</h2>
      <form onSubmit={addItem}>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Название"
        />
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
}

export default App;
