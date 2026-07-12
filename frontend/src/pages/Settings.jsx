import React, { useState } from 'react';
import GeneralSettingsForm from '../components/settings/GeneralSettingsForm';
import RbacMatrixTable from '../components/settings/RbacMatrixTable';

export default function Settings() {
  const [settings, setSettings] = useState({
    depotName: 'Gandhinagar Depot',
    currency: 'INR (₹)',
    distanceUnit: 'Kilometers'
  });

  const mockMatrix = {
    "Fleet Manager": { fleet: 'full', drivers: 'full', trips: 'full', fuel_expenses: 'full', analytics: 'full' },
    "Dispatcher": { fleet: 'view', drivers: 'view', trips: 'full', fuel_expenses: 'none', analytics: 'none' },
    "Safety Officer": { fleet: 'view', drivers: 'full', trips: 'view', fuel_expenses: 'none', analytics: 'none' },
    "Financial Analyst": { fleet: 'view', drivers: 'none', trips: 'view', fuel_expenses: 'full', analytics: 'view' }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    alert('Settings saved (Preview)');
    console.log('Saved settings:', settings);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">System Settings</h1>
      </div>

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
          <RbacMatrixTable matrix={mockMatrix} />
        </div>
      </div>
    </div>
  );
}