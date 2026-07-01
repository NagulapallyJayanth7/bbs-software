import React, { useState } from 'react';

function ProjectForm({ onProjectAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://bbs-software-w9co.vercel.app/api';

  console.log('ProjectForm API_URL:', API_URL);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Submitting project', { apiUrl: API_URL, formData });
    try {
      const requestBody = JSON.stringify(formData);
      console.log('Project request body', requestBody);
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      });
      console.log('Project response status', response.status, response.statusText);
      
      if (response.ok) {
        const newProject = await response.json();
        onProjectAdded(newProject);
        setFormData({ name: '', description: '', location: '' });
        alert('Project created successfully!');
      } else {
        const errorText = await response.text();
        console.error('Project creation failed', response.status, response.statusText, errorText);
        alert(`Error creating project: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating project');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>New Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter project name"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter project description"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter project location"
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
