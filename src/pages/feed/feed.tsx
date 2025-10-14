import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadFeed,
  selectFeedOrders,
  selectFeedLoading
} from '../../services/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(loadFeed());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(loadFeed());
  };

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
