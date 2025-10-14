import { FC, useEffect } from 'react';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  Modal,
  OrderInfo,
  IngredientDetails,
  ProtectedRoute
} from '@components';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { checkUserAuth, setAuthChecked } from '../../services/userAuthSlice';
import { loadIngredients } from '../../services/ingredientsSlice';
import { getCookie } from '../../utils/cookie';

const App: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(loadIngredients());

    const token = getCookie('accessToken');
    if (token) {
      dispatch(checkUserAuth());
    } else {
      dispatch(setAuthChecked());
    }
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        {/* Главная страница */}
        <Route path='/' element={<ConstructorPage />} />

        {/* Лента заказов */}
        <Route path='/feed' element={<Feed />} />

        {/* Детали заказа */}
        <Route
          path='/feed/:number'
          element={
            <div className={styles.detailPageWrap}>
              <p className='text text_type_digits-default'>Детали заказа</p>
              <OrderInfo />
            </div>
          }
        />

        {/* Детали ингредиента */}
        <Route
          path='/ingredients/:id'
          element={
            <div className={`${styles.detailPageWrap} ${styles.detailHeader}`}>
              <h3 className='text text_type_main-large'>Детали ингредиента</h3>
              <IngredientDetails />
            </div>
          }
        />

        {/* Маршруты только для неавторизованных */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищенные маршруты */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <div className={styles.detailPageWrap}>
                <p className='text text_type_digits-default'>Детали заказа</p>
                <OrderInfo />
              </div>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
