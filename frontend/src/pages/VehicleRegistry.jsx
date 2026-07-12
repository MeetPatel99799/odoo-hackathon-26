import { useState, useEffect, useCallback } from 'react';
import VehicleFilterBar from '../components/fleet/VehicleFilterBar';
import VehicleTable from '../components/fleet/VehicleTable';
import AddVehicleModal from '../components/fleet/AddVehicleModal';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Map a DB row (snake_case) to the shape VehicleTable expects (camelCase).
 */
function mapVehicle(row) {
  return {
    id: row.id,
    regNo: row.reg_no,
    nameModel: row.name_model,
    type: row.type,
    capacity: Number(row.max_capacity_kg),
    odometer: Number(row.odometer),
    acqCost: Number(row.acquisition_cost),
    status: row.status,
  };
}

export default function VehicleRegistry() {
  const { hasAccess } = useAuth();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');

  // RBAC: Fleet Manager (vehicles Write) gets full access; others get view-only
  const canAdd = hasAccess('vehicles', 'write');

  // Fetch vehicles from the API with current filters
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (type) params.type = type;
      if (status) params.status = status;
      if (search) params.search = search;

      const { data } = await api.get('/vehicles', { params });
      setVehicles(data.map(mapVehicle));
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    } finally {
      setLoading(false);
    }
  }, [type, status, search]);

  // Fetch on mount and whenever filters change
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Handle filter bar changes
  const handleFilterChange = (field, value) => {
    if (field === 'type') setType(value);
    if (field === 'status') setStatus(value);
    if (field === 'search') setSearch(value);
  };

  // Handle adding a new vehicle via POST /api/vehicles
  const handleAddVehicle = async (newVehicle) => {
    try {
      await api.post('/vehicles', {
        reg_no: newVehicle.regNo,
        name_model: newVehicle.nameModel,
        type: newVehicle.type,
        max_capacity_kg: newVehicle.capacity,
        odometer: newVehicle.odometer,
        acquisition_cost: newVehicle.acqCost,
      });

      // Success: close modal, clear error, refetch
      setModalError('');
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      if (err.response?.status === 409) {
        // Duplicate registration number
        setModalError(err.response.data.error || 'Registration number already exists.');
      } else {
        setModalError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text tracking-tight">Vehicle Registry</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View, filter, and register transport assets within the fleet registry.
          </p>
        </div>
      </div>

      {/* Vehicle Filter Bar */}
      <VehicleFilterBar
        type={type}
        status={status}
        search={search}
        onChange={handleFilterChange}
        onAddClick={() => setIsModalOpen(true)}
        canAdd={canAdd}
      />

      {/* Loading indicator */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        /* Vehicles Table — shows ALL vehicles including Retired/In Shop */
        <VehicleTable vehicles={vehicles} />
      )}

      {/* Add Vehicle Modal Dialog */}
      <AddVehicleModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalError('');
        }}
        onSubmit={handleAddVehicle}
        error={modalError}
      />
    </div>
  );
}