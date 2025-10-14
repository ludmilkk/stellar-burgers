import React, { FC } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isConstructorActive =
    currentPath === '/' || currentPath.startsWith('/ingredients');
  const isFeedActive = currentPath.startsWith('/feed');
  const isProfileActive = currentPath.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
            <NavLink
              to='/'
              className={`text text_type_main-default ml-2 mr-10 ${styles.link} ${
                isConstructorActive ? styles.link_active : ''
              }`}
            >
              Конструктор
            </NavLink>
          </>
          <>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <NavLink
              to='/feed'
              className={`text text_type_main-default ml-2 ${styles.link} ${
                isFeedActive ? styles.link_active : ''
              }`}
            >
              Лента заказов
            </NavLink>
          </>
        </div>
        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <NavLink
            to='/profile'
            className={`text text_type_main-default ml-2 ${styles.link} ${
              isProfileActive ? styles.link_active : ''
            }`}
          >
            {userName || 'Личный кабинет'}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
