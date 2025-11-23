import React, { useEffect, useState } from 'react';

// --- Web Preview Version (Interactive UI) ---
// Uses standard HTML/CSS/LocalStorage to run in this browser preview.

const STORAGE_KEY = 'todo_app_data';

interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
}

// Simple Inline Icons
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default function Index() {
  const [task, setTask] = useState<string>('');
  const [taskItems, setTaskItems] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load Data
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTaskItems(JSON.parse(storedTasks));
      }
    } catch (e) {
      console.error('Failed to load tasks', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save Data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(taskItems));
    }
  }, [taskItems, isLoaded]);

  const handleAddTask = () => {
    if (!task.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: task,
      isCompleted: false,
    };
    setTaskItems([...taskItems, newTask]);
    setTask('');
  };

  const toggleComplete = (id: string) => {
    setTaskItems(taskItems.map((item) => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const deleteTask = (id: string) => {
    setTaskItems(taskItems.filter((item) => item.id !== id));
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const remaining = taskItems.filter(t => !t.isCompleted).length;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mobileContainer}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.dateText}>{today}</div>
          <h1 style={styles.title}>My Tasks</h1>
          <p style={styles.subtitle}>{remaining} tasks pending</p>
        </div>

        {/* List */}
        <div style={styles.listContainer}>
          {taskItems.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📝</div>
              <p style={{ color: '#94a3b8' }}>No tasks yet. Add one below!</p>
            </div>
          ) : (
            taskItems.map((item) => (
              <div key={item.id} style={item.isCompleted ? styles.cardCompleted : styles.card}>
                {/* Checkbox */}
                <button 
                  onClick={() => toggleComplete(item.id)}
                  style={item.isCompleted ? styles.checkboxActive : styles.checkbox}
                >
                  {item.isCompleted && <CheckIcon />}
                </button>

                {/* Text */}
                <span style={item.isCompleted ? styles.textCompleted : styles.text}>
                  {item.text}
                </span>

                {/* Delete */}
                <button 
                  onClick={() => deleteTask(item.id)}
                  style={styles.deleteBtn}
                  title="Delete"
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div style={styles.inputWrapper}>
          <input
            style={styles.input}
            placeholder="Add a new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button onClick={handleAddTask} style={styles.addBtn}>
            <PlusIcon />
          </button>
        </div>

      </div>
    </div>
  );
}

// --- CSS Styles (Updated for better fit) ---
const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    height: '100vh', // Full viewport height
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', // Centers the app vertically
    backgroundColor: '#f1f5f9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    overflow: 'hidden', // Prevents double scrollbars
  },
  mobileContainer: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    // Change: Use 90vh so it fits even with the top header bar
    height: '90vh', 
    maxHeight: '800px', 
    borderRadius: '20px', // Rounded corners for "App" feel
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    position: 'relative',
    overflow: 'hidden', // Ensures content stays inside rounded corners
  },
  header: {
    padding: '30px 24px 20px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f1f5f9',
    flexShrink: 0, // Prevents header from squishing
  },
  dateText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  title: {
    margin: '0',
    fontSize: '32px',
    fontWeight: '800',
    color: '#1e293b',
  },
  subtitle: {
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#94a3b8',
  },
  listContainer: {
    flex: 1, // Takes up all remaining space
    overflowY: 'auto', // Enables scrolling specifically for the list
    padding: '24px',
    paddingBottom: '100px', // Extra space so last item isn't hidden behind input
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    opacity: 0.5,
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    backgroundColor: '#f1f5f9',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '16px',
    marginBottom: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #f1f5f9',
    transition: 'all 0.2s ease',
  },
  cardCompleted: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '16px',
    marginBottom: '12px',
    border: '1px solid #f1f5f9',
    opacity: 0.8,
  },
  checkbox: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid #cbd5e1',
    backgroundColor: 'transparent',
    marginRight: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  checkboxActive: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '2px solid #3b82f6',
    backgroundColor: '#3b82f6',
    marginRight: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: '16px',
    color: '#334155',
    fontWeight: '500',
  },
  textCompleted: {
    flex: 1,
    fontSize: '16px',
    color: '#94a3b8',
    textDecoration: 'line-through',
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    padding: '20px',
    background: 'linear-gradient(to top, #ffffff 80%, rgba(255,255,255,0))',
    display: 'flex',
    gap: '12px',
    boxSizing: 'border-box',
  },
  input: {
    flex: 1,
    padding: '16px 24px',
    borderRadius: '30px',
    border: 'none',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontSize: '16px',
    outline: 'none',
  },
  addBtn: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
    cursor: 'pointer',
    transition: 'transform 0.1s',
    flexShrink: 0,
  },
};