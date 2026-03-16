import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AccountList from './pages/AccountList';
import CreateAccount from './pages/CreateAccount';
import AccountDetail from './pages/AccountDetail';
import EditAccount from './pages/EditAccount';
import TransactionOperation from './pages/TransactionOperation';
import { authService } from './services/authService';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    // Initial silent refresh to restore session and rotate token
    if (authService.getToken()) {
      console.log('Initial silent refresh');
      authService.refresh();
    }
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<AccountList />} />
          <Route path="/accounts/create" element={<CreateAccount />} />
          <Route path="/accounts/:accountId" element={<AccountDetail />} />
          <Route path="/accounts/edit/:accountId" element={<EditAccount />} />
          <Route path="/operations" element={<TransactionOperation />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
