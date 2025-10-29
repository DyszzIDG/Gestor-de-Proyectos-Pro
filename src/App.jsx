import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, CheckCircle2, Circle, Clock, Edit2, Trash2, X, MessageSquare, Download, Moon, Sun, BarChart3, List, Columns, ChevronLeft, ChevronRight, Bell, CheckSquare } from 'lucide-react';

const ProjectTaskManager = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [editingProject, setEditingProject] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const demo = [{
      id: Date.now(),
      name: 'Proyecto Demo',
      description: 'Ejemplo de proyecto',
      color: '#3b82f6',
      tasks: [
        { 
          id: 1, 
          title: 'Configurar proyecto', 
          description: 'Setup inicial', 
          status: 'done', 
          priority: 'high', 
          dueDate: '2025-10-25',
          tags: ['setup'],
          comments: [],
          subtasks: []
        },
        { 
          id: 2, 
          title: 'Diseñar interfaz', 
          description: 'Crear mockups', 
          status: 'inProgress', 
          priority: 'medium', 
          dueDate: '2025-11-05',
          tags: ['diseño'],
          comments: [],
          subtasks: []
        }
      ]
    }];
    setProjects(demo);
    setSelectedProject(demo[0].id);
    checkNotifications(demo);
  }, []);

  const checkNotifications = (projectsList) => {
    const now = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const notifs = [];
    
    projectsList.forEach(project => {
      project.tasks.forEach(task => {
        if (task.dueDate && task.status !== 'done') {
          const dueDate = new Date(task.dueDate);
          const diff = dueDate - now;
          
          if (diff < 0) {
            notifs.push({
              id: `${project.id}-${task.id}`,
              type: 'overdue',
              message: `"${task.title}" está vencida`,
              project: project.name
            });
          } else if (diff < threeDays) {
            notifs.push({
              id: `${project.id}-${task.id}`,
              type: 'upcoming',
              message: `"${task.title}" vence pronto`,
              project: project.name
            });
          }
        }
      });
    });
    
    setNotifications(notifs);
  };

  useEffect(() => {
    checkNotifications(projects);
  }, [projects]);

  const addProject = (projectData) => {
    const newProject = { id: Date.now(), ...projectData, tasks: [] };
    const updated = [...projects, newProject];
    setProjects(updated);
    setSelectedProject(newProject.id);
    setShowProjectForm(false);
  };

  const updateProject = (projectData) => {
    const updated = projects.map(p => p.id === editingProject.id ? { ...p, ...projectData } : p);
    setProjects(updated);
    setEditingProject(null);
    setShowProjectForm(false);
  };

  const deleteProject = (id) => {
    if (window.confirm('¿Eliminar proyecto?')) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      if (selectedProject === id) {
        setSelectedProject(projects[0]?.id || null);
      }
    }
  };

  const addTask = (taskData) => {
    const updated = projects.map(p => {
      if (p.id === selectedProject) {
        return { ...p, tasks: [...p.tasks, { id: Date.now(), ...taskData, comments: [], subtasks: [] }] };
      }
      return p;
    });
    setProjects(updated);
    setShowTaskForm(false);
  };

  const updateTask = (taskData) => {
    const updated = projects.map(p => {
      if (p.id === selectedProject) {
        return { ...p, tasks: p.tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t) };
      }
      return p;
    });
    setProjects(updated);
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const deleteTask = (taskId) => {
    const updated = projects.map(p => {
      if (p.id === selectedProject) {
        return { ...p, tasks: p.tasks.filter(t => t.id !== taskId) };
      }
      return p;
    });
    setProjects(updated);
  };

  const toggleTaskStatus = (taskId) => {
    const updated = projects.map(p => {
      if (p.id === selectedProject) {
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              const statuses = ['todo', 'inProgress', 'done'];
              const currentIndex = statuses.indexOf(t.status);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              return { ...t, status: nextStatus };
            }
            return t;
          })
        };
      }
      return p;
    });
    setProjects(updated);
  };

  const addComment = (taskId, comment) => {
    const updated = projects.map(p => {
      if (p.id === selectedProject) {
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              return {
                ...t,
                comments: [...(t.comments || []), { id: Date.now(), text: comment, date: new Date().toISOString().split('T')[0], author: 'Tú' }]
              };
            }
            return t;
          })
        };
      }
      return p;
    });
    setProjects(updated);
  };

  const addSubtask = (taskId, subtaskTitle) => {
    const updated = projects.map(p => {
      if (p.id === selectedProject) {
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              return { ...t, subtasks: [...(t.subtasks || []), { id: Date.now(), title: subtaskTitle, completed: false }] };
            }
            return t;
          })
        };
      }
      return p;
    });
    setProjects(updated);
  };

  const toggleSubtask = (taskId, subtaskId) => {
    const updated = projects.map(p => {
      if (p.id === selectedProject) {
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              return { ...t, subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st) };
            }
            return t;
          })
        };
      }
      return p;
    });
    setProjects(updated);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `proyectos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const currentProject = projects.find(p => p.id === selectedProject);
  const allTags = [...new Set(projects.flatMap(p => p.tasks.flatMap(t => t.tags || [])))];
  
  const filteredTasks = currentProject?.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesTag = filterTag === 'all' || (task.tags || []).includes(filterTag);
    return matchesSearch && matchesStatus && matchesPriority && matchesTag;
  }) || [];

  const getProgress = (project) => {
    if (!project.tasks.length) return 0;
    const completed = project.tasks.filter(t => t.status === 'done').length;
    return Math.round((completed / project.tasks.length) * 100);
  };

  const getPriorityColor = (priority) => {
    if (darkMode) {
      return { low: 'bg-blue-900 text-blue-200', medium: 'bg-yellow-900 text-yellow-200', high: 'bg-orange-900 text-orange-200', urgent: 'bg-red-900 text-red-200' }[priority];
    }
    return { low: 'bg-blue-100 text-blue-800', medium: 'bg-yellow-100 text-yellow-800', high: 'bg-orange-100 text-orange-800', urgent: 'bg-red-100 text-red-800' }[priority];
  };

  const getStatusIcon = (status) => {
    if (status === 'done') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'inProgress') return <Clock className="w-5 h-5 text-blue-600" />;
    return <Circle className="w-5 h-5 text-gray-400" />;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTasksForDate = (date) => {
    return currentProject?.tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() && taskDate.getMonth() === date.getMonth() && taskDate.getFullYear() === date.getFullYear();
    }) || [];
  };

  const bg = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const txt = darkMode ? 'text-gray-100' : 'text-gray-900';
  const txtSec = darkMode ? 'text-gray-400' : 'text-gray-600';
  const brd = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hvr = darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100';

  const renderCalendarView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const tasksForDay = getTasksForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      
      days.push(
        <div key={day} className={`h-24 border ${brd} p-2 ${isToday ? 'bg-blue-50 dark:bg-blue-900' : cardBg}`}>
          <div className={`font-semibold text-sm ${txt}`}>{day}</div>
          <div className="mt-1 space-y-1">
            {tasksForDay.slice(0, 2).map(task => (
              <div key={task.id} className={`text-xs p-1 rounded ${getPriorityColor(task.priority)} truncate`}>
                {task.title}
              </div>
            ))}
            {tasksForDay.length > 2 && <div className={`text-xs ${txtSec}`}>+{tasksForDay.length - 2} más</div>}
          </div>
        </div>
      );
    }

    return (
      <div className={`${cardBg} rounded-lg shadow-sm p-6 border ${brd}`}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className={`p-2 rounded ${hvr}`}>
            <ChevronLeft className={txt} />
          </button>
          <h3 className={`text-lg font-bold ${txt}`}>{monthNames[month]} {year}</h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className={`p-2 rounded ${hvr}`}>
            <ChevronRight className={txt} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className={`text-center font-semibold text-sm ${txtSec}`}>{day}</div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderKanbanView = () => {
    const columns = {
      todo: { title: 'Por Hacer', tasks: [] },
      inProgress: { title: 'En Progreso', tasks: [] },
      done: { title: 'Completadas', tasks: [] }
    };

    filteredTasks.forEach(task => {
      columns[task.status].tasks.push(task);
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, column]) => (
          <div key={status} className={`${cardBg} rounded-lg shadow-sm p-4 border ${brd}`}>
            <h3 className={`font-semibold ${txt} mb-4 flex items-center justify-between`}>
              {column.title}
              <span className={`text-sm ${txtSec}`}>{column.tasks.length}</span>
            </h3>
            <div className="space-y-3">
              {column.tasks.map(task => (
                <div key={task.id} className={`p-3 rounded-lg border ${brd} ${hvr} cursor-pointer`} onClick={() => setSelectedTask(task)}>
                  <h4 className={`font-medium text-sm ${txt}`}>{task.title}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'low' && 'Baja'}
                      {task.priority === 'medium' && 'Media'}
                      {task.priority === 'high' && 'Alta'}
                      {task.priority === 'urgent' && 'Urgente'}
                    </span>
                    {task.dueDate && <span className={`text-xs ${txtSec}`}>{new Date(task.dueDate).toLocaleDateString('es-ES')}</span>}
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {task.tags.map(tag => (
                        <span key={tag} className={`text-xs px-2 py-0.5 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${txtSec}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${bg}`}>
      <header className={`${cardBg} shadow-sm border-b ${brd}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className={`text-2xl font-bold ${txt}`}>📋 Gestor de Proyectos Pro</h1>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowNotifications(!showNotifications)} className={`relative p-2 rounded-lg ${hvr}`}>
                <Bell className={`w-5 h-5 ${txt}`} />
                {notifications.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${hvr}`}>
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className={`w-5 h-5 ${txt}`} />}
              </button>
              <button onClick={exportData} className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg ${hvr}`}>
                <Download className={`w-5 h-5 ${txt}`} />
                <span className={txt}>Exportar</span>
              </button>
              <button onClick={() => { setEditingProject(null); setShowProjectForm(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nuevo</span>
              </button>
            </div>
          </div>
        </div>

        {showNotifications && notifications.length > 0 && (
          <div className={`absolute right-4 top-16 ${cardBg} rounded-lg shadow-xl border ${brd} p-4 w-80 z-50`}>
            <h3 className={`font-semibold ${txt} mb-3`}>Notificaciones</h3>
            <div className="space-y-2">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-3 rounded-lg ${notif.type === 'overdue' ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900'}`}>
                  <p className={`text-sm font-medium ${txt}`}>{notif.message}</p>
                  <p className={`text-xs ${txtSec}`}>{notif.project}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className={`${cardBg} rounded-lg shadow-sm p-4 border ${brd}`}>
              <h2 className={`font-semibold ${txt} mb-3`}>Proyectos</h2>
              <div className="space-y-2">
                {projects.map(project => (
                  <div key={project.id} className={`p-3 rounded-lg cursor-pointer transition ${selectedProject === project.id ? 'bg-blue-50 dark:bg-blue-900 border-2 border-blue-500' : `${hvr} border ${brd}`}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1" onClick={() => setSelectedProject(project.id)}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                          <h3 className={`font-medium text-sm ${txt}`}>{project.name}</h3>
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${txtSec}`}>
                          <span>{project.tasks.length} tareas</span>
                          <span>•</span>
                          <span>{getProgress(project)}%</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setEditingProject(project); setShowProjectForm(true); }} className={`p-1 ${hvr} rounded`}>
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }} className={`p-1 ${hvr} rounded`}>
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className={`mt-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-1.5`}>
                      <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${getProgress(project)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${cardBg} rounded-lg shadow-sm p-4 border ${brd}`}>
              <h3 className={`font-semibold ${txt} mb-3`}>Resumen</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className={txtSec}>Proyectos</span>
                  <span className={`font-semibold ${txt}`}>{projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className={txtSec}>Tareas</span>
                  <span className={`font-semibold ${txt}`}>{projects.reduce((acc, p) => acc + p.tasks.length, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={txtSec}>Completadas</span>
                  <span className="font-semibold text-green-600">{projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'done').length, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={txtSec}>En Progreso</span>
                  <span className="font-semibold text-blue-600">{projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'inProgress').length, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={txtSec}>Pendientes</span>
                  <span className="font-semibold text-orange-600">{projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === 'todo').length, 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {currentProject ? (
              <div className="space-y-4">
                <div className={`${cardBg} rounded-lg shadow-sm p-6 border ${brd}`}>
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <h2 className={`text-xl font-bold ${txt}`}>{currentProject.name}</h2>
                      <p className={`${txtSec} text-sm mt-1`}>{currentProject.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}>
                          <List className={`w-4 h-4 ${txt}`} />
                        </button>
                        <button onClick={() => setViewMode('kanban')} className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}>
                          <Columns className={`w-4 h-4 ${txt}`} />
                        </button>
                        <button onClick={() => setViewMode('calendar')} className={`p-2 rounded ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}>
                          <Calendar className={`w-4 h-4 ${txt}`} />
                        </button>
                      </div>
                      <button onClick={() => { setEditingTask(null); setShowTaskForm(true); }} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Nueva</span>
                      </button>
                    </div>
                  </div>

                  {viewMode !== 'calendar' && (
                    <div className="flex flex-wrap gap-3">
                      <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${txtSec}`} />
                          <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-2 border ${brd} rounded-lg ${cardBg} ${txt}`} />
                        </div>
                      </div>
                      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`px-3 py-2 border ${brd} rounded-lg ${cardBg} ${txt}`}>
                        <option value="all">Estados</option>
                        <option value="todo">Por hacer</option>
                        <option value="inProgress">En progreso</option>
                        <option value="done">Completadas</option>
                      </select>
                      <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className={`px-3 py-2 border ${brd} rounded-lg ${cardBg} ${txt}`}>
                        <option value="all">Prioridad</option>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                        <option value="urgent">Urgente</option>
                      </select>
                    </div>
                  )}
                </div>

                {viewMode === 'calendar' && renderCalendarView()}
                {viewMode === 'kanban' && renderKanbanView()}
                
                {viewMode === 'list' && (
                  <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                      <div className={`${cardBg} rounded-lg shadow-sm p-12 text-center border ${brd}`}>
                        <p className={txtSec}>No hay tareas. ¡Crea una nueva!</p>
                      </div>
                    ) : (
                      filteredTasks.map(task => (
                        <div key={task.id} className={`${cardBg} rounded-lg shadow-sm p-4 hover:shadow-md border ${brd}`}>
                          <div className="flex items-start gap-4">
                            <button onClick={() => toggleTaskStatus(task.id)} className="mt-1">{getStatusIcon(task.status)}</button>
                            <div className="flex-1">
                              <div className="flex items-start justify-between flex-wrap gap-2">
                                <div className="flex-1">
                                  <h3 className={`font-medium ${txt} ${task.status === 'done' ? 'line-through opacity-60' : ''}`}>{task.title}</h3>
                                  <p className={`text-sm ${txtSec} mt-1`}>{task.description}</p>
                                  {task.subtasks && task.subtasks.length > 0 && (
                                    <div className="mt-2 space-y-1">
                                      {task.subtasks.map(st => (
                                        <div key={st.id} className="flex items-center gap-2">
                                          <button onClick={() => toggleSubtask(task.id, st.id)}>
                                            <CheckSquare className={`w-4 h-4 ${st.completed ? 'text-green-600' : 'text-gray-400'}`} />
                                          </button>
                                          <span className={`text-sm ${st.completed ? 'line-through opacity-60' : ''} ${txtSec}`}>{st.title}</span>
