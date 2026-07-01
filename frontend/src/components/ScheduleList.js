import React, { useState, useEffect, useCallback } from 'react';

function ScheduleList({ projectId }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    scheduleNumber: '',
    barDiameter: '',
    barType: 'MILD STEEL',
    quantity: '',
    length: '',
    unit: 'meter',
    weight: '',
    consumedWeight: '',
    remarks: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || 'https://bbs-software-w9co.vercel.app/api';

  const fetchWeightReport = useCallback(async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`${API_URL}/schedules/report/${projectId}`);
      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  }, [projectId, API_URL]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!projectId) {
        setSchedules([]);
        setReport(null);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/schedules/project/${projectId}`);
        const data = await response.json();
        setSchedules(data);
        fetchWeightReport();
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
      setLoading(false);
    };

    fetchSchedules();
  }, [API_URL, projectId, fetchWeightReport]);

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

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      scheduleNumber: '',
      barDiameter: '',
      barType: 'MILD STEEL',
      quantity: '',
      length: '',
      unit: 'meter',
      weight: '',
      consumedWeight: '',
      remarks: ''
    });
  };

  const handleEditSchedule = (schedule) => {
    setEditingId(schedule.id);
    setFormData({
      scheduleNumber: schedule.schedule_number || '',
      barDiameter: schedule.bar_diameter?.toString() || '',
      barType: schedule.bar_type || 'MILD STEEL',
      quantity: schedule.quantity?.toString() || '',
      length: schedule.length?.toString() || '',
      unit: schedule.unit || 'meter',
      weight: schedule.weight?.toString() || calculateWeight(schedule.bar_diameter, schedule.length, schedule.unit),
      consumedWeight: schedule.consumed_weight?.toString() || '',
      remarks: schedule.remarks || ''
    });
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const consumedVal = parseFloat(formData.consumedWeight) || 0;
      const givenVal = parseFloat(formData.weight) || 0;
      
      if (consumedVal > givenVal) {
        alert('Consumed weight cannot exceed given weight!');
        return;
      }

      const payload = {
        projectId,
        scheduleNumber: formData.scheduleNumber,
        barDiameter: parseFloat(formData.barDiameter),
        barType: formData.barType,
        quantity: parseInt(formData.quantity),
        length: parseFloat(formData.length),
        unit: formData.unit,
        consumedWeight: consumedVal,
        remarks: formData.remarks
      };

      let response;
      if (editingId) {
        response = await fetch(`${API_URL}/schedules/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`${API_URL}/schedules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        const scheduleData = await response.json();
        const updatedSchedule = {
          ...scheduleData,
          weight: scheduleData.weight ?? calculateWeight(formData.barDiameter, formData.length, formData.unit)
        };

        if (editingId) {
          setSchedules(schedules.map(s => (s.id === editingId ? updatedSchedule : s)));
          alert('Schedule updated successfully!');
        } else {
          setSchedules([updatedSchedule, ...schedules]);
          alert('Schedule added successfully!');
        }

        resetForm();
        fetchWeightReport();
      } else {
        const errorText = await response.text();
        console.error('Error saving schedule:', response.status, errorText);
        alert(editingId ? 'Error updating schedule' : 'Error adding schedule');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(editingId ? 'Error updating schedule' : 'Error adding schedule');
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('Delete this schedule?')) {
      try {
        const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setSchedules(schedules.filter(s => s.id !== scheduleId));
          fetchWeightReport();
          alert('Schedule deleted!');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div>
      {/* Weight Report Section */}
      {report && (
        <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '4px', border: '2px solid #4caf50' }}>
          <h3 style={{ color: '#2e7d32', marginTop: 0 }}>Weight Report</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Total Given Weight</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                {parseFloat(report.total_given_weight).toFixed(2)} kg
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Total Consumed Weight</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#f57c00' }}>
                {parseFloat(report.total_consumed_weight).toFixed(2)} kg
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Balance Weight</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>
                {parseFloat(report.balance_weight).toFixed(2)} kg
              </p>
            </div>
            <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Percentage Consumed</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#d32f2f' }}>
                {report.percentage_consumed}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Form */}
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
              <label>Given Weight (kg)</label>
              <input
                type="text"
                name="weight"
                value={formData.weight}
                readOnly
                placeholder="Auto-calculated"
              />
            </div>

            <div className="form-group">
              <label>Consumed Weight (kg)</label>
              <input
                type="number"
                name="consumedWeight"
                value={formData.consumedWeight}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
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

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button type="submit" className="btn">
              {editingId ? 'Update Schedule' : 'Add Schedule'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Schedules Table */}
      <div>
        <h3>Schedules ({schedules.length})</h3>
        {loading ? (
          <p>Loading schedules...</p>
        ) : schedules.length === 0 ? (
          <p style={{ color: '#999' }}>No schedules added yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Schedule #</th>
                  <th>Bar Diameter (mm)</th>
                  <th>Type</th>
                  <th>Qty</th>
                  <th>Length</th>
                  <th>Unit</th>
                  <th>Given Weight (kg)</th>
                  <th>Consumed Weight (kg)</th>
                  <th>Balance Weight (kg)</th>
                  <th>Remarks</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map(schedule => {
                  const givenWeight = parseFloat(schedule.weight) || 0;
                  const consumedWeight = parseFloat(schedule.consumed_weight) || 0;
                  const balanceWeight = givenWeight - consumedWeight;
                  return (
                    <tr key={schedule.id}>
                      <td>{schedule.schedule_number}</td>
                      <td>{schedule.bar_diameter}</td>
                      <td>{schedule.bar_type}</td>
                      <td>{schedule.quantity}</td>
                      <td>{schedule.length}</td>
                      <td>{schedule.unit}</td>
                      <td>{givenWeight.toFixed(2)}</td>
                      <td style={{ color: consumedWeight > 0 ? '#f57c00' : '#999' }}>
                        {consumedWeight.toFixed(2)}
                      </td>
                      <td style={{ color: balanceWeight < 0 ? '#d32f2f' : '#4caf50', fontWeight: 'bold' }}>
                        {balanceWeight.toFixed(2)}
                      </td>
                      <td>{schedule.remarks || '-'}</td>
                      <td style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEditSchedule(schedule)}
                          style={{ width: '80px', padding: '5px' }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          style={{ width: '80px', padding: '5px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduleList;
