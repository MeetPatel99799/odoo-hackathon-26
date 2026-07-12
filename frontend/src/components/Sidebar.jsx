import { Link } from 'react-router-dom';

export default function Sidebar({ activeItem, permissions }) {
  const items = [
    { name: 'Dashboard', path: '/' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Drivers', path: '/drivers' },
    { name: 'Trips', path: '/trips' },
    { name: 'Maintenance', path: '/maintenance' },
    { name: 'Fuel & Expenses', path: '/fuel' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="w-64 bg-panel border-r border-border h-screen p-4 flex flex-col gap-2">
      <div className="text-primary font-bold text-xl mb-6">TransitOps</div>
      {items.map((item) => {
        // TODO: hide/disable items based on permissions if access_level 'none'
        const isActive = activeItem === item.name;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`p-2 rounded ${isActive ? 'bg-primary/20 text-primary' : 'text-text hover:bg-border'}`}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
