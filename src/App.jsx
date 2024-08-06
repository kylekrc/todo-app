import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [todo, setTodo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [timeDue, setTimeDue] = useState('');
  const [description, setDescription] = useState('');
  const [taskDetails, setTaskDetails] = useState(null);
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showDoneAllModal, setShowDoneAllModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error("Failed to parse todos from localStorage:", error);
        localStorage.removeItem('todos');
      }
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      try {
        localStorage.setItem('todos', JSON.stringify(todos));
      } catch (error) {
        console.error("Failed to save todos to localStorage:", error);
      }
    } else {
      localStorage.removeItem('todos');
    }
  }, [todos]);

  const handleChange = (e) => {
  const value = e.target.value;
  if (value.length <= 50) {
    setTodo(value);
  }
  };

  const handleEditTextChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setEditText(value);
    }
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
  };

  const handleTimeDueChange = (e) => {
    setTimeDue(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const updatedTodos = todos.map((t) =>
        t.id === editId ? { ...t, todo: editText, dueDate, timeDue } : t
      );
      setTodos(updatedTodos);
      setEditId(null);
      setEditText('');
      setDueDate('');
      setTimeDue('');
      setDescription('');
      setShowEditModal(false);
      setActionInProgress(false);
      return;
    }

    if (todo.trim() !== '') {
      setTodos([
        ...todos,
        { 
          id: `${todo}-${Date.now()}`, 
          todo, 
          done: false, 
          dateCreated: new Date().toLocaleString(),
          dueDate,
          timeDue,
          description
        }
      ]);
      setTodo('');
      setDueDate('');
      setTimeDue('');
      setDescription('');
      setShowAddModal(false); // Close modal after adding
    }
  };

  const handleDoneAll = () => {
    setTodos(todos.map((t) => ({ ...t, done: true })));
    setShowDoneAllModal(false);
  };

  const handleDeleteAll = () => {
    setTodos([]);
    setShowDeleteAllModal(false);
  };

  const deleteHandler = (id) => {
    setTaskToDelete(id);
    setShowModal(true);
    setActionInProgress(true);
  };

  const confirmDelete = () => {
    const updatedTodos = todos.filter((t) => t.id !== taskToDelete);
    setTodos(updatedTodos);
    setShowModal(false);
    setTaskToDelete(null);
    setActionInProgress(false);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setTaskToDelete(null);
    setActionInProgress(false);
  };

  const editHandler = (id) => {
    const editTodo = todos.find((i) => i.id === id);
    setTaskToEdit(editTodo);
    setEditText(editTodo.todo);
    setEditDescription(editTodo.description);
    setDueDate(editTodo.dueDate);
    setTimeDue(editTodo.timeDue);
    setShowEditModal(true);
    setActionInProgress(true);
  };

  const saveEdit = () => {
    if (editText.trim() === '') {
      alert('Task cannot be empty.');
      return;
    }
    const updatedTodos = todos.map((t) =>
      t.id === taskToEdit.id ? { ...t, todo: editText, dueDate, timeDue, description: editDescription } : t
    );
    setTodos(updatedTodos);
    setShowEditModal(false);
    setTaskToEdit(null);
    setEditText('');
    setEditDescription('');
    setDueDate('');
    setTimeDue('');
    setActionInProgress(false);
  };

  const cancelEdit = () => {
    setShowEditModal(false);
    setTaskToEdit(null);
    setEditText('');
    setEditDescription('');
    setDueDate('');
    setTimeDue('');
    setActionInProgress(false);
  };

  const resetAddTaskInputs = () => {
    setTodo('');
    setDescription('');
    setDueDate('');
    setTimeDue('');
  };

  const toggleDone = (id) => {
    const updatedTodos = todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return !todo.done;
    if (filter === 'Completed') return todo.done;
  });

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : '';
  };

  const formatTime = (time) => {
    return time ? new Date(`1970-01-01T${time}:00`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
  };

  const formatDueDateTime = (dueDate, timeDue) => {
    if (dueDate && timeDue) {
      return `Due: ${formatDate(dueDate)} ${formatTime(timeDue)}`;
    } else if (dueDate) {
      return `Due: ${formatDate(dueDate)}`;
    } else if (timeDue) {
      const today = new Date();
      const formattedDate = today.toLocaleDateString();
      return `Due: ${formattedDate} ${formatTime(timeDue)}`;
    }
    return 'Due: None';
  };

  const showDetailsHandler = (task) => {
    setTaskDetails(task);
    setShowDetailsModal(true);
  };
  
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setTaskDetails(null);
  };



  return (
    <div className="main-container">
      <div className="container bg-light text-center p-3">
        <h1 className="top-text text-white">LexMeet</h1>
        <p className='par-lex'>Manage your tasks with the To Do App</p>
        <div className="filter-buttons">
          <button className="btn btn-secondary" onClick={() => setFilter('All')}>All</button>
          <button className="btn btn-secondary" onClick={() => setFilter('Pending')}>Pending</button>
          <button className="btn btn-secondary" onClick={() => setFilter('Completed')}>Completed</button>
          <button className="btn btn-primary ms-2 add-task-btn" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-circle"></i>
          </button>
        </div>
      </div>
      <div className="task-container container mt-4">
        {filteredTodos.length === 0 ? (
          <p className="no-tasks">There are no tasks</p>
        ) : (
          filteredTodos.map((t) => (
            <div
              className="task-item d-flex justify-content-between align-items-center bg-light p-2 my-2"
              key={t.id}
              onClick={(e) => {
                if (e.currentTarget === e.target) {
                showDetailsHandler(t);
              }}}
            >
              <div className="d-flex align-items-center">
                <input
                  type="checkbox"
                  className="checkbox-hidden form-check-input me-2"
                  checked={t.done}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleDone(t.id);
                  }}
                />
                <span className={`task-text ${t.done ? 'text-decoration-line-through' : ''}`}>
                  {t.todo}
                </span>
              </div>
              <div className="task-date">
                {formatDueDateTime(t.dueDate, t.timeDue)}
              </div>
              <div className="task-actions d-flex align-items-center">
                <button
                  className="btn btn-primary-edit me-2"
                  onClick={(e) => {
                    editHandler(t.id);
                    e.stopPropagation(e);
                  }}
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler(t.id);
                  }}
                  className="btn btn-danger-task"
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              </div>
              <div className="task-date">
                {formatDueDateTime(t.dueDate, t.timeDue)}
              </div>
            </div>
          ))
        )}

        <div className="task-controls mt-3 d-flex justify-content-end">
          <button
            className="btn btn-success me-2"
            onClick={() => setShowDoneAllModal(true)}
          >
            Done All
          </button>
          <button
            className="btn btn-danger-delAll"
            onClick={() => setShowDeleteAllModal(true)}
          >
            Delete All
          </button>
        </div>
      </div>

      {/* Done All Confirmation Modal */}
      {showDoneAllModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title-confirm">Confirm Done All</h5>
              <button type="button" className="btn-close" onClick={() => setShowDoneAllModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to mark all tasks as done?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary-cancel" onClick={() => setShowDoneAllModal(false)}>Cancel</button>
              <button type="button" className="btn btn-success" onClick={handleDoneAll}>Done All</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title-confirm">Confirm Delete All</h5>
              <button type="button" className="btn-close" onClick={() => setShowDeleteAllModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete all tasks?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary-cancel" onClick={() => setShowDeleteAllModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger-del" onClick={handleDeleteAll}>Delete All</button>
            </div>
          </div>
        </div>
      )}


      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title-confirm">Confirm Deletion</h5>
              <button type="button" className="btn-close" onClick={cancelDelete}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this task?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary-cancel" onClick={cancelDelete}>Cancel</button>
              <button type="button" className="btn btn-danger-del" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Task</h5>
              <button type="button" 
              className="btn-close" 
              onClick={() => {
              setShowAddModal(false);
              resetAddTaskInputs();
              }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form className="modal-body" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="todo" className="form-label-task">Task</label>
                <input
                  type="text"
                  className="form-control"
                  id="todo"
                  value={todo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label vertical-resize">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="dueDate"
                  value={dueDate}
                  onChange={handleDueDateChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="timeDue" className="form-label">Time Due</label>
                <input
                  type="time"
                  className="form-control"
                  id="timeDue"
                  value={timeDue}
                  onChange={handleTimeDueChange}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary-cancel" onClick={() => {
                setShowAddModal(false);
                resetAddTaskInputs();
                }}>Close</button>
                <button type="submit" className="btn btn-primary-add">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Task</h5>
              <button type="button" className="btn-close" onClick={cancelEdit}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="editTodo" className="form-label-task">Task</label>
                <input
                  type="text"
                  className="form-control"
                  id="editTodo"
                  value={editText}
                  onChange={handleEditTextChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editDescription" className="form-label vertical-resize">Description</label>
                <textarea
                  className="form-control"
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="editDueDate" className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="editDueDate"
                  value={dueDate}
                  onChange={handleDueDateChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editTimeDue" className="form-label">Time Due</label>
                <input
                  type="time"
                  className="form-control"
                  id="editTimeDue"
                  value={timeDue}
                  onChange={handleTimeDueChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary-cancel" onClick={cancelEdit}>Cancel</button>
              <button type="button" className="btn btn-primary-save" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Task Details Modal */}
      {showDetailsModal && taskDetails && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Task Details</h5>
              <button type="button" className="btn-close" onClick={closeDetailsModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body">
              <p className='details-info'><strong>Task:</strong> {taskDetails.todo}</p>
              <p className='details-info'><strong>Description:</strong> <br />{taskDetails.description}</p>
              <p className='details-info'><strong>Date Created:</strong> {taskDetails.dateCreated}</p>
              <p className='details-info'><strong>Due Date:</strong> {taskDetails.dueDate}</p>
              <p className='details-info'><strong>Time Due:</strong> {taskDetails.timeDue}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary-cancel" onClick={closeDetailsModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
