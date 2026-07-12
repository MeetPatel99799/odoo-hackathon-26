import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import AuthErrorBox from '../components/auth/AuthErrorBox';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    'Fleet Manager',
    'Dispatcher',
    'Safety Officer',
    'Financial Analyst',
  ];

  const handleLoginSubmit = async ({ email, password, role }) => {
    setLoading(true);
    setErrorMessage('');

    try {
      await login(email, password, role);
      navigate('/');
    } catch (err) {
      const status = err.response?.status;
      if (status === 423) {
        setErrorMessage('Account locked after 5 failed attempts.');
      } else {
        setErrorMessage('Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-text">
      <LoginForm
        onSubmit={handleLoginSubmit}
        loading={loading}
        roleOptions={roleOptions}
      />
      <AuthErrorBox message={errorMessage} />
    </div>
  );
}
