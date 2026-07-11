/**
 * FilterBar - Dropdown filters for Dashboard metric viewing
 *
 * Props:
 * - vehicleType: current selected vehicle type
 * - status: current selected status
 * - region: current selected region
 * - onChange(field, value): callback called when a filter changes (field is 'vehicleType', 'status', or 'region')
 * - typeOptions: array of available vehicle type strings/objects
 * - statusOptions: array of available status strings/objects
 * - regionOptions: array of available region strings/objects
 */
export default function FilterBar({
  vehicleType,
  status,
  region,
  onChange,
  typeOptions = [],
  statusOptions = [],
  regionOptions = []
}) {
  const normalizeOptions = (options) => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    });
  };

  const handleSelectChange = (field, event) => {
    if (onChange) {
      onChange(field, event.target.value);
    }
  };

  const renderDropdown = (label, field, currentValue, options) => {
    const normalized = normalizeOptions(options);
    // Ensure "All" option exists
    const hasAll = normalized.some(opt => opt.value === '' || opt.label.toLowerCase() === 'all');
    const finalOptions = hasAll ? normalized : [{ value: '', label: 'All' }, ...normalized];

    return (
      <div className="flex flex-col min-w-[160px] flex-1 sm:flex-initial">
        <label 
          htmlFor={`filter-${field}`} 
          className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1"
        >
          {label}
        </label>
        <div className="relative">
          <select
            id={`filter-${field}`}
            value={currentValue ?? ''}
            onChange={(e) => handleSelectChange(field, e)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer appearance-none pr-8"
          >
            {finalOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom Chevron icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-panel border border-border p-4 rounded-xl w-full shadow-md">
      {renderDropdown('Vehicle Type', 'vehicleType', vehicleType, typeOptions)}
      {renderDropdown('Status', 'status', status, statusOptions)}
      {renderDropdown('Region', 'region', region, regionOptions)}
    </div>
  );
}
