import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { Modal } from 'antd';

const ProtectedRoute: React.FC = () => {
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [shouldRedirect, setShouldRedirect] = React.useState(false);
  const hasToken = !!authService.getToken();
  const isAuthenticated = authService.isAuthenticated();

  React.useEffect(() => {
    if (hasToken && !isAuthenticated) {
      setIsModalVisible(true);
    }
  }, [location.pathname, hasToken, isAuthenticated]);

  if (!hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthenticated && !shouldRedirect) {
    return (
      <>
        <Modal
          title="Session Expired"
          open={isModalVisible}
          onOk={() => setShouldRedirect(true)}
          onCancel={() => setShouldRedirect(true)}
          okText="Go to Login"
          closable={false}
          maskClosable={false}
        >
          <p>Your session has expired. Please log in again to continue.</p>
        </Modal>
        <Outlet />
      </>
    );
  }

  if (!isAuthenticated && shouldRedirect) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
