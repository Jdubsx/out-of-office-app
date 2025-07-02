import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { Client } from '@microsoft/microsoft-graph-client';
import './OutOfOfficeForm.css';

interface OutOfOfficeTime {
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  reason: string;
  managerEmail: string;
  isFullDay: boolean;
}

const OutOfOfficeForm: React.FC = () => {
  const { instance } = useMsal();
  const [formData, setFormData] = useState<OutOfOfficeTime>({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    reason: '',
    managerEmail: process.env.REACT_APP_MANAGER_EMAIL || '',
    isFullDay: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [outOfOfficeTimes, setOutOfOfficeTimes] = useState<OutOfOfficeTime[]>([]);

  // Load out-of-office times from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ooo_times');
    if (stored) {
      setOutOfOfficeTimes(JSON.parse(stored));
    }
  }, []);

  // Remove expired out-of-office times on mount and every minute
  useEffect(() => {
    const interval = setInterval(() => {
      removeExpiredTimes();
    }, 60000);
    removeExpiredTimes();
    return () => clearInterval(interval);
  }, [outOfOfficeTimes]);

  const removeExpiredTimes = () => {
    const now = new Date();
    const filtered = outOfOfficeTimes.filter(time => {
      const end = time.isFullDay
        ? new Date(time.endDate + 'T23:59:00')
        : new Date(time.endDate + 'T' + (time.endTime || '17:00'));
      return end > now;
    });
    if (filtered.length !== outOfOfficeTimes.length) {
      setOutOfOfficeTimes(filtered);
      localStorage.setItem('ooo_times', JSON.stringify(filtered));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value
    }));
  };

  const createTeamsMeeting = async (accessToken: string) => {
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    let startDateTime: string;
    let endDateTime: string;
    if (formData.isFullDay) {
      // All day event: use date only, set time to 00:00 and 23:59
      startDateTime = formData.startDate + 'T00:00:00';
      endDateTime = formData.endDate + 'T23:59:00';
    } else {
      // Use date and time (local, no Z)
      startDateTime = formData.startDate + 'T' + formData.startTime + ':00';
      endDateTime = formData.endDate + 'T' + formData.endTime + ':00';
    }

    const meeting = {
      subject: `Out of Office: ${formData.reason}`,
      start: {
        dateTime: startDateTime,
        timeZone: 'Eastern Standard Time'
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Eastern Standard Time'
      },
      attendees: [
        {
          emailAddress: {
            address: formData.managerEmail
          },
          type: 'required'
        }
      ],
      isOnlineMeeting: false,
      showAs: 'free',
    };

    try {
      const createdMeeting = await graphClient
        .api('/me/calendar/events')
        .post(meeting);

      return createdMeeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const account = instance.getActiveAccount();
      if (!account) {
        throw new Error('No active account found');
      }

      const response = await instance.acquireTokenSilent({
        scopes: ['User.Read', 'Calendars.ReadWrite', 'Mail.Send'],
        account: account
      });

      await createTeamsMeeting(response.accessToken);

      // Save out-of-office time to localStorage
      const newTime = { ...formData };
      const updatedTimes = [...outOfOfficeTimes, newTime];
      setOutOfOfficeTimes(updatedTimes);
      localStorage.setItem('ooo_times', JSON.stringify(updatedTimes));

      setMessage({
        type: 'success',
        text: 'Out of office time submitted successfully! A Teams meeting has been sent to your manager.'
      });

      // Reset form
      setFormData({
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '17:00',
        reason: '',
        managerEmail: process.env.REACT_APP_MANAGER_EMAIL || '',
        isFullDay: true
      });

    } catch (error) {
      console.error('Error submitting out-of-office time:', error);
      setMessage({
        type: 'error',
        text: 'Failed to submit out-of-office time. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTime = (idx: number) => {
    const updated = outOfOfficeTimes.filter((_, i) => i !== idx);
    setOutOfOfficeTimes(updated);
    localStorage.setItem('ooo_times', JSON.stringify(updated));
  };

  return (
    <div className="form-container" style={{ display: 'flex', gap: '2rem' }}>
      <div className="form-card" style={{ flex: 1 }}>
        <h2>Submit Out of Office Time</h2>
        <form onSubmit={handleSubmit} className="out-of-office-form">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isFullDay"
                checked={formData.isFullDay}
                onChange={handleInputChange}
              />
              {' '}Full Day
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          {!formData.isFullDay && (
            <div className="form-group">
              <label htmlFor="startTime">Start Time:</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              min={formData.startDate || new Date().toISOString().split('T')[0]}
            />
          </div>
          {!formData.isFullDay && (
            <div className="form-group">
              <label htmlFor="endTime">End Time:</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="reason">Reason:</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              placeholder="Please provide a brief reason for your absence..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="managerEmail">Manager Email:</label>
            <input
              type="email"
              id="managerEmail"
              name="managerEmail"
              value={formData.managerEmail}
              onChange={handleInputChange}
              required
              placeholder="manager@company.com"
            />
          </div>

          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Out-of-Office Time'}
          </button>
        </form>
      </div>
      <div className="ooo-sidebar" style={{ minWidth: 320, maxWidth: 400 }}>
        <h3>Your Out-of-Office Times</h3>
        {outOfOfficeTimes.length === 0 && <div style={{ color: '#888' }}>No upcoming out-of-office times.</div>}
        {outOfOfficeTimes.map((time, idx) => {
          const start = time.isFullDay
            ? new Date(time.startDate + 'T00:00:00')
            : new Date(time.startDate + 'T' + (time.startTime || '09:00'));
          const end = time.isFullDay
            ? new Date(time.endDate + 'T23:59:00')
            : new Date(time.endDate + 'T' + (time.endTime || '17:00'));
          return (
            <div key={idx} style={{ background: '#f8f9fa', border: '1px solid #e1e5e9', borderRadius: 8, padding: 16, marginBottom: 16, position: 'relative' }}>
              <button
                onClick={() => handleDeleteTime(idx)}
                style={{ position: 'absolute', top: 8, right: 8, background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, padding: '2px 10px', cursor: 'pointer', fontSize: 14 }}
                title="Delete out-of-office time"
              >
                ×
              </button>
              <div><b>Reason:</b> {time.reason}</div>
              <div><b>From:</b> {start.toLocaleString()}</div>
              <div><b>To:</b> {end.toLocaleString()}</div>
              <div><b>Manager:</b> {time.managerEmail}</div>
              <div><b>Type:</b> {time.isFullDay ? 'Full Day' : 'Partial Day'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OutOfOfficeForm; 