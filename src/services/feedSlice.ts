import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '../utils/types';
import { getFeedsApi, getOrderByNumberApi } from '../utils/burger-api';

export interface FeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  selectedOrder: TOrder | null;
  isLoading: boolean;
  isOrderLoading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  selectedOrder: null,
  isLoading: false,
  isOrderLoading: false,
  error: null
};

export const loadFeed = createAsyncThunk(
  'feed/load',
  async (_, { rejectWithValue }) => {
    try {
      const feedData = await getFeedsApi();
      return feedData;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить ленту заказов'
      );
    }
  }
);

export const loadOrderByNumber = createAsyncThunk(
  'feed/loadOrderByNumber',
  async (orderNumber: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(orderNumber);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить заказ'
      );
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(loadFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loadOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(loadOrderByNumber.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(loadOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectSelectedOrder: (state) => state.selectedOrder,
    selectFeedLoading: (state) => state.isLoading,
    selectOrderLoading: (state) => state.isOrderLoading,
    selectFeedError: (state) => state.error
  }
});

export const { clearSelectedOrder } = feedSlice.actions;

export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectSelectedOrder,
  selectFeedLoading,
  selectOrderLoading,
  selectFeedError
} = feedSlice.selectors;

export default feedSlice.reducer;
