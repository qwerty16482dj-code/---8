'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// 1. Настройки базы данных
const supabaseUrl = "https://orkfmagdpscmonjwxqkw.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ya2ZtYWdkcHNjbW9uand4cWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyNzg1NzAsImV4cCI6MjA4MDg1NDU3MH0.evvxjAA0Ixw04bc0iqkh75g7Q7FQLFjpszP0TfP6XOc"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function HabitTracker() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')

  // 2. Загрузка привычек при запуске
  useEffect(() => {
    fetchHabits()
  }, [])

  async function fetchHabits() {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('id', { ascending: true })
    
    if (data) setHabits(data)
    if (error) console.log('Ошибка:', error)
  }

  // 3. Добавление новой привычки
  async function addHabit() {
    if (!newHabit.trim()) return
    
    const { data, error } = await supabase
      .from('habits')
      .insert([{ title: newHabit, difficulty: 'easy', streak: 0 }])
      .select()

    if (data) {
      setHabits([...habits, ...data])
      setNewHabit('') // Очистить поле
    }
  }

  // 4. Удаление привычки (бонус)
  async function deleteHabit(id) {
    await supabase.from('habits').delete().match({ id })
    setHabits(habits.filter(h => h.id !== id))
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🦸‍♂️ Habit Hero</h1>
      
      {/* Форма добавления */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Например: Выпить воды"
          style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={addHabit}
          style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Добавить
        </button>
      </div>

      {/* Список привычек */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {habits.length === 0 && <p style={{color: '#888'}}>Пока нет привычек. Создай первую!</p>}
        
        {habits.map(habit => (
          <div key={habit.id} style={{ 
            padding: '15px', 
            border: '1px solid #eee', 
            borderRadius: '8px', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <div>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{habit.title}</span>
              <div style={{ fontSize: '12px', color: '#666' }}>🔥 Серия: {habit.streak} дней</div>
            </div>
            <button 
              onClick={() => deleteHabit(habit.id)}
              style={{ background: 'red', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}