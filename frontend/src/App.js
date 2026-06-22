import React, { useState, useEffect } from 'react';
import './App.css';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch all projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    setLoading(false);
  };

  const handleProjectAdded = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  const handleProjectDeleted = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bar Bending Schedule (BBS)</h1>
        <p>Construction Project Management</p>
      </header>
      
      <div className="app-container">
        <div className="sidebar">
          <ProjectForm onProjectAdded={handleProjectAdded} />
        </div>
        
        <div className="main-content">
          {loading ? (
            <p>Loading projects...</p>
          ) : (
            <ProjectList 
              projects={projects} 
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              onProjectDeleted={handleProjectDeleted}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
