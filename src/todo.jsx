import React, { useState, useEffect } from 'react';
import './list.css';

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('default');

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (savedTasks) {
            setTasks(savedTasks);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = () => {
        if (taskInput.trim()) {
            setTasks([...tasks, { text: taskInput.trim(), completed: false }]);
            setTaskInput('');
        }
    };

    const handleRemoveTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    const handleToggleCompletion = (index) => {
        const newTasks = tasks.map((task, i) => 
            i === index ? { ...task, completed: !task.completed } : task
        );
        setTasks(newTasks);
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        if (sort === 'alphabetical') {
            return a.text.localeCompare(b.text);
        } else if (sort === 'completed') {
            return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        }
        return 0;
    });

    const filteredTasks = sortedTasks.filter(task => {
        if (filter === 'completed') {
            return task.completed;
        } else if (filter === 'pending') {
            return !task.completed;
        }
        return true;
    });

    return (
        <div className="todo-list">
            <h1>To-Do List</h1>
            <input 
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Enter a task"
            />
            <button onClick={handleAddTask}>Add Task</button>
            <div className="filters">
                <select onChange={handleSortChange} value={sort}>
                    <option value="default">Sort by</option>
                    <option value="alphabetical">Alphabetical</option>
                    <option value="completed">Completion Status</option>
                </select>
                <select onChange={handleFilterChange} value={filter}>
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                </select>
            </div>
            <ul>
                {filteredTasks.map((task, index) => (
                    <li key={index} className={task.completed ? 'completed' : ''}>
                        <span onClick={() => handleToggleCompletion(index)}>
                            {task.text}
                        </span>
                        <button onClick={() => handleRemoveTask(index)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
