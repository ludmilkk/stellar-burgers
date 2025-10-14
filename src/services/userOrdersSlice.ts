import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { getOrdersApi } from '../utils/burger-api';

export interface UserOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить заказы пользователя'
      );
    }
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.orders = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectUserOrders: (state) => state.orders,
    selectUserOrdersLoading: (state) => state.isLoading,
    selectUserOrdersError: (state) => state.error
  }
});

export const { clearUserOrders } = userOrdersSlice.actions;

export const {
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserOrdersError
} = userOrdersSlice.selectors;

export default userOrdersSlice.reducer;
