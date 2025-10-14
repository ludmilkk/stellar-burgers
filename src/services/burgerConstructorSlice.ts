import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '../utils/types';
import { orderBurgerApi } from '../utils/burger-api';
import { v4 as uuidv4 } from 'uuid';

export interface BurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
  error: null
};

// Асинхронная thunk-функция для создания заказа
export const createBurgerOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка создания заказа'
      );
    }
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index > 0) {
        const [movedItem] = state.ingredients.splice(index, 1);
        state.ingredients.splice(index - 1, 0, movedItem);
      }
    },
    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (index < state.ingredients.length - 1 && index !== -1) {
        const [movedItem] = state.ingredients.splice(index, 1);
        state.ingredients.splice(index + 1, 0, movedItem);
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBurgerOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createBurgerOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
        state.error = null;
      })
      .addCase(createBurgerOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectBun: (state) => state.bun,
    selectIngredients: (state) => state.ingredients,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectConstructorError: (state) => state.error
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  closeOrderModal
} = burgerConstructorSlice.actions;

export const {
  selectBun,
  selectIngredients,
  selectOrderRequest,
  selectOrderModalData,
  selectConstructorError
} = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
