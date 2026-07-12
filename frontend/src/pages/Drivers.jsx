import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DriverTable from '../components/drivers/DriverTable';
import AddDriverModal from '../components/drivers/AddDriverModal';
import StatusToggleBar from '../components/drivers/StatusToggleBar';

export default function Drivers() {
  const { hasAccess } = useAuth();
  const canWrite = hasAccess('drivers', 'write');

  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');

  const fetchDrivers = useCallback(async () => {
    try {
      const { data } = await api.get(`/drivers?search=${encodeURIComponent(search)}`);
      // Compute isExpired client-side
      const today = new Date().toISOString().split('T')[0];
      const processed = data.map(d => ({
        ...d,
        isExpired: d.expiry < today,
      }));
      setDrivers(processed);
    } catch (err) {
      console.error('Failed to fetch drivers:', err);
    }
  }, [search]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleAddSubmit = async (fields) => {
    try {
      const payload = {
        name: fields.name,
        license_no: fields.licenseNo,
        license_category: fields.category,
        license_expiry: fields.expiry,
        contact_number: fields.contact
      };
      await api.post('/drivers', payload);
      setModalError('');
      setIsModalOpen(false);
      fetchDrivers();
    } catch (err) {
      if (err.response?.status === 409) {
        setModalError(err.response.data?.error || 'Driver with this license already exists.');
      } else {
        setModalError('Failed to add driver. Please try again.');
      }
    }
  };

  const handleStatusToggle = async (status) => {
    if (!selectedId) return;
    try {
      await api.patch(`/drivers/${selectedId}/status`, { status });
      fetchDrivers();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Drivers & Safety Profiles</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage driver profiles, license compliance, and safety scoring.
          </p>
        </div>
        {canWrite && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-amber-600 text-black font-semibold text-sm rounded-lg px-4 py-2.5 shadow-md hover:shadow-lg transition-all"
          >
            + Add Driver
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-panel border border-border p-4 rounded-xl shadow-md w-full">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search drivers or license no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
          />
        </div>
        {canWrite && (
          <StatusToggleBar
            disabled={!selectedId}
            onToggle={handleStatusToggle}
          />
        )}
      </div>

      <DriverTable
        drivers={drivers}
        selectedId={selectedId}
        onSelectRow={setSelectedId}
      />

      <AddDriverModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalError('');
        }}
        onSubmit={handleAddSubmit}
        error={modalError}
      />
    </div>
  );
}