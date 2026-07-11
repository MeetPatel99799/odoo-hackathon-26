import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useRouteAccess } from '../components/ProtectedRoute';
import ServiceRecordForm from '../components/maintenance/ServiceRecordForm';
import StatusFlowDiagram from '../components/maintenance/StatusFlowDiagram';
import ServiceLogTable from '../components/maintenance/ServiceLogTable';

export default function Maintenance() {
  const { readOnly } = useRouteAccess();
  const [vehicles, setVehicles] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/vehicles');
      // Filter out retired vehicles and format for dropdown
      const options = data
        .filter((v) => v.status !== 'Retired')
        .map((v) => ({
          id: v.id,
          name: `${v.reg_no} (${v.name_model})`,
        }));
      setVehicles(options);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to load vehicles list.');
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/maintenance');
      // Map backend fields to the props structure expected by ServiceLogTable
      const mapped = data.map((item) => ({
        id: item.id,
        vehicle: item.vehicle_reg_no || `ID: ${item.vehicle_id}`,
        service: item.description,
        cost: parseFloat(item.cost) || 0,
        status: item.status,
      }));
      setRecords(mapped);
    } catch (err) {
      console.error('Error fetching maintenance logs:', err);
      setError('Failed to load maintenance logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    if (!readOnly) {
      fetchVehicles();
    }
  }, [readOnly]);

  const handleSubmit = async (fields) => {
    try {
      setError('');
      const payload = {
        vehicle_id: fields.vehicle,
        description: fields.service,
        cost: fields.cost,
        status: fields.status,
      };
      await api.post('/maintenance', payload);
      await fetchLogs();
      if (!readOnly) {
        await fetchVehicles(); // Refetch vehicles to update statuses in case it is "In Shop"
      }
    } catch (err) {
      console.error('Error creating maintenance record:', err);
      setError(err.response?.data?.error || 'Failed to save maintenance record.');
    }
  };

  const handleCloseLog = async (id) => {
    try {
      setError('');
      await api.patch(`/maintenance/${id}/close`);
      await fetchLogs();
      if (!readOnly) {
        await fetchVehicles(); // Refetch vehicles as the status would have reverted to Available
      }
    } catch (err) {
      console.error('Error closing maintenance log:', err);
      setError(err.response?.data?.error || 'Failed to close maintenance log.');
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text">Maintenance Hub</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hide ServiceRecordForm entirely for non-full (read-only) roles */}
        {!readOnly ? (
          <div className="lg:col-span-1">
            <ServiceRecordForm vehicleOptions={vehicles} onSubmit={handleSubmit} />
          </div>
        ) : null}

        <div className={!readOnly ? 'lg:col-span-2 flex flex-col space-y-6' : 'lg:col-span-3 flex flex-col space-y-6'}>
          <StatusFlowDiagram />

          <div>
            <h3 className="text-lg font-semibold mb-4 text-text">Active & Recent Logs</h3>
            {loading ? (
              <div className="text-center py-6 text-textMuted">Loading logs...</div>
            ) : (
              <ServiceLogTable records={records} onClose={handleCloseLog} readOnly={readOnly} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}