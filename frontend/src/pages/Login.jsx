import { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import AuthErrorBox from '../components/auth/AuthErrorBox';

/**
 * Login - Page component acting as a local preview harness for LoginForm
 * and AuthErrorBox before the full Integration phase.
 */
export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitCount, setSubmitCount] = useState(0);

  // Role options passed as props to the presentational login form
  const roleOptions = [
    'Fleet Manager',
    'Dispatcher',
    'Safety Officer',
    'Financial Analyst'
  ];

  const handleLoginSubmit = (fields) => {
    console.log('Login form submitted with fields:', fields);

    // Start loading state simulation
    setLoading(true);
    setErrorMessage('');

    // Simulate network delay to test loading spinner/disabled states
    setTimeout(() => {
      setLoading(false);
      
      // Simulate rotating through different error states for layout testing
      const nextCount = submitCount + 1;
      setSubmitCount(nextCount);

      if (nextCount % 3 === 1) {
        setErrorMessage('Invalid credentials.');
      } else if (nextCount % 3 === 2) {
        setErrorMessage('Account locked after 5 failed attempts.');
      } else {
        // Success simulation (log to console)
        console.log('Simulation: Successful login with role', fields.role);
        setErrorMessage('');
      }
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-text">
      {/* Visual Preview Harness Header/Badge (only visible during design phase) */}
      <div className="absolute top-4 left-4 z-40 bg-primary/20 text-primary border border-primary/40 px-3 py-1 rounded-md text-xs font-mono select-none pointer-events-none">
        Preview Mode (Props Simulated)
      </div>

      {/* Render the presentational LoginForm */}
      <LoginForm
        onSubmit={handleLoginSubmit}
        loading={loading}
        roleOptions={roleOptions}
      />

      {/* Render the presentational AuthErrorBox */}
      <AuthErrorBox message={errorMessage} />
    </div>
  );
}