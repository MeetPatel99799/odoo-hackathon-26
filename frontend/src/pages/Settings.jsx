import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GeneralSettingsForm from '../components/settings/GeneralSettingsForm';
import RbacMatrixTable from '../components/settings/RbacMatrixTable';

export default function Settings() {
  const [settings, setSettings] = useState({
    depotName: '',
    currency: '',
    distanceUnit: ''
  });
  const [matrix, setMatrix] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data) {
        setSettings({
          depotName: data.depot_name || '',
          currency: data.currency || '',
          distanceUnit: data.distance_unit || ''
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load general settings.');
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data } = await api.get('/roles/permissions');
      setMatrix(data || {});
    } catch (err) {
      console.error('Error fetching role permissions:', err);
      setError('Failed to load permissions matrix.');
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSettings(), fetchPermissions()]).finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');
      const payload = {
        depot_name: settings.depotName,
        currency: settings.currency,
        distance_unit: settings.distanceUnit
      };
      await api.put('/settings', payload);
      setSuccess('Settings updated successfully!');
      await fetchSettings();
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.error || 'Failed to save settings.');
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-textMuted">Loading settings...</div>;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">System Settings</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GeneralSettingsForm
            depotName={settings.depotName}
            currency={settings.currency}
            distanceUnit={settings.distanceUnit}
            onChange={handleChange}
            onSave={handleSave}
          />
        </div>

        <div className="lg:col-span-2">
          <RbacMatrixTable matrix={matrix} />
        </div>
      </div>
    </div>
  );
}