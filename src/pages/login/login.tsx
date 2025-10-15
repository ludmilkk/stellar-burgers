import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUserApi } from '@api';
import { setCookie } from '../../utils/cookie';
import { checkUserAuth } from '../../services/userAuthSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    loginUserApi({ email, password })
      .then((response) => {
        if (response.success) {
          setCookie('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          dispatch(checkUserAuth());

          navigate('/');
        } else {
          setError(new Error('Ошибка входа'));
        }
      })
      .catch((err) => setError(err));
  };

  return (
    <LoginUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
