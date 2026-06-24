import ScheduleList from './ScheduleList';

function ProjectList({ projects, selectedProject, onSelectProject, onProjectDeleted }) {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          onProjectDeleted(projectId);
          alert('Project deleted successfully!');
        } else {
          alert('Error deleting project');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error deleting project');
      }
    }
  };

  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <p>No projects yet. Create your first project to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Projects</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.map(project => (
          <div
            key={project.id}
            className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
            onClick={() => onSelectProject(project)}
          >
            <h3>{project.name}</h3>
            {project.location && <p><strong>Location:</strong> {project.location}</p>}
            {project.description && <p><strong>Description:</strong> {project.description}</p>}
            <button
              className="btn btn-danger"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProject(project.id);
              }}
              style={{ marginTop: '10px', width: '100%' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div style={{ marginTop: '30px' }}>
          <h2>Bar Bending Schedule - {selectedProject.name}</h2>
          <ScheduleList projectId={selectedProject.id} />
        </div>
      )}
    </div>
  );
}

export default ProjectList;
