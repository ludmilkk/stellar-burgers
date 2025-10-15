import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { registerUserApi } from '@api';
import { setCookie } from '../../utils/cookie';
import { checkUserAuth } from '../../services/userAuthSlice';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    registerUserApi({ name: userName, email, password })
      .then((response) => {
        if (response.success) {
          setCookie('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

          dispatch(checkUserAuth());

          navigate('/');
        } else {
          setError(new Error('Ошибка регистрации'));
        }
      })
      .catch((err) => setError(err));
  };

  return (
    <RegisterUI
      errorText={error?.message}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
