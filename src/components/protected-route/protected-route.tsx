import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectIsLoading
} from '../../services/userAuthSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const isLoading = useSelector(selectIsLoading);

  // Показываем прелоадер, пока проверяется авторизация
  if (!isAuthChecked || isLoading) {
    return <Preloader />;
  }

  // Если маршрут только для неавторизованных, но пользователь авторизован
  if (onlyUnAuth && isAuthenticated) {
    const redirectPath = location.state?.from?.pathname || '/';
    return <Navigate to={redirectPath} replace />;
  }

  // Если маршрут защищенный, но пользователь не авторизован
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
