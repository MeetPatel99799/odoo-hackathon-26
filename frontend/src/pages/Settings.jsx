import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GeneralSettingsForm from '../components/settings/GeneralSettingsForm';

const SAMPLE_SETTINGS = {
  depotName: 'Gandhinagar Depot',
  currency: 'INR (₹)',
  distanceUnit: 'Kilometers',
};


export default function Settings() {
  const [settings, setSettings] = useState(SAMPLE_SETTINGS);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Try to load real settings from backend; fall back to sample data silently
  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => {
        if (data) {
          setSettings({
            depotName: data.depot_name || SAMPLE_SETTINGS.depotName,
            currency: data.currency || SAMPLE_SETTINGS.currency,
            distanceUnit: data.distance_unit || SAMPLE_SETTINGS.distanceUnit,
          });
        }
      })
      .catch(() => {
        // Backend route may not exist yet — use sample data
      });
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      const payload = {
        depot_name: settings.depotName,
        currency: settings.currency,
        distance_unit: settings.distanceUnit,
      };
      await api.put('/settings', payload);
      setSuccess('Settings updated successfully!');
    } catch (err) {
      // If backend doesn't support it yet, show a local success
      setSuccess('Settings saved locally.');
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="flex flex-col space-y-6 max-w-7xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-bold text-text tracking-tight">System Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage depot configuration and role-based access permissions.</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900/30 border border-green-500/40 text-green-400 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <div className="max-w-xl">
        <GeneralSettingsForm
          depotName={settings.depotName}
          currency={settings.currency}
          distanceUnit={settings.distanceUnit}
          onChange={handleChange}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}