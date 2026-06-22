import React, { useState, useEffect } from 'react';

function ScheduleList({ projectId }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scheduleNumber: '',
    barDiameter: '',
    barType: 'MILD STEEL',
    quantity: '',
    length: '',
    unit: 'meter',
    weight: '',
    remarks: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (projectId) fetchSchedules();
  }, [projectId]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/schedules/project/${projectId}`);
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
    setLoading(false);
  };

  const calculateWeight = (diameter, lengthVal, unitVal) => {
    const diameterNum = parseFloat(diameter);
    const lengthNum = parseFloat(lengthVal);
    if (Number.isNaN(diameterNum) || Number.isNaN(lengthNum) || lengthNum <= 0) {
      return '';
    }
    const lengthMeters = unitVal === 'feet' ? lengthNum * 0.3048 : lengthNum;
    const weight = (diameterNum * diameterNum / 162) * lengthMeters;
    return weight.toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const nextData = {
        ...prev,
        [name]: value
      };
      if (name === 'barDiameter' || name === 'length' || name === 'unit') {
        nextData.weight = calculateWeight(nextData.barDiameter, nextData.length, nextData.unit);
      }
      return nextData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId,
          ...formData,
          barDiameter: parseFloat(formData.barDiameter),
          quantity: parseInt(formData.quantity),
          length: parseFloat(formData.length)
        })
      });

      if (response.ok) {
        const newSchedule = await response.json();
        if (newSchedule.weight === null || newSchedule.weight === undefined) {
          newSchedule.weight = calculateWeight(formData.barDiameter, formData.length, formData.unit);
        }
        setSchedules([newSchedule, ...schedules]);
        setFormData({
          scheduleNumber: '',
          barDiameter: '',
          barType: 'MILD STEEL',
          quantity: '',
          length: '',
          unit: 'meter',
          weight: '',
          remarks: ''
        });
        alert('Schedule added successfully!');
      } else {
        alert('Error adding schedule');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding schedule');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Delete this schedule?')) {
      try {
        const response = await fetch(`${API_URL}/api/schedules/${scheduleId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setSchedules(schedules.filter(s => s.id !== scheduleId));
          alert('Schedule deleted!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
        <h3>Add New Schedule</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div className="form-group">
              <label>Schedule #</label>
              <input
                type="text"
                name="scheduleNumber"
                value={formData.scheduleNumber}
                onChange={handleChange}
                placeholder="S1, S2..."
                required
              />
            </div>

            <div className="form-group">
              <label>Bar Diameter (mm)</label>
              <input
                type="number"
                name="barDiameter"
                value={formData.barDiameter}
                onChange={handleChange}
                placeholder="8, 10, 12..."
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label>Bar Type</label>
              <select name="barType" value={formData.barType} onChange={handleChange}>
                <option>MILD STEEL</option>
                <option>HIGH TENSILE</option>
                <option>DEFORMED</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="10, 20..."
                required
              />
            </div>

            <div className="form-group">
              <label>Length</label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                placeholder="5.5, 12..."
                step="0.5"
                required
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                <option>meter</option>
                <option>feet</option>
              </select>
            </div>

            <div className="form-group">
              <label>Weight (kg)</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                readOnly
                placeholder="Auto-calculated"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Additional notes..."
            ></textarea>
          </div>

          <button type="submit" className="btn" style={{ marginTop: '10px' }}>
            Add Schedule
          </button>
        </form>
      </div>

      <div>
        <h3>Schedules ({schedules.length})</h3>
        {loading ? (
          <p>Loading schedules...</p>
        ) : schedules.length === 0 ? (
          <p style={{ color: '#999' }}>No schedules added yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Schedule #</th>
                <th>Bar Diameter (mm)</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Length</th>
                <th>Unit</th>
                <th>Weight (kg)</th>
                <th>Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(schedule => (
                <tr key={schedule.id}>
                  <td>{schedule.schedule_number}</td>
                  <td>{schedule.bar_diameter}</td>
                  <td>{schedule.bar_type}</td>
                  <td>{schedule.quantity}</td>
                  <td>{schedule.length}</td>
                  <td>{schedule.unit}</td>
                  <td>{schedule.weight !== null && schedule.weight !== undefined ? Number(schedule.weight).toFixed(2) : '-'}</td>
                  <td>{schedule.remarks || '-'}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                      style={{ width: '80px', padding: '5px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ScheduleList;
