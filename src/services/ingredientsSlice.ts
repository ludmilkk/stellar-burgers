import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '../utils/types';
import { getIngredientsApi } from '../utils/burger-api';

export interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const loadIngredients = createAsyncThunk(
  'ingredients/load',
  async (_, { rejectWithValue }) => {
    try {
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить ингредиенты'
      );
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.error = null;
      })
      .addCase(loadIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectAllIngredients: (state) => state.ingredients,
    selectIngredientsLoading: (state) => state.isLoading,
    selectIngredientsError: (state) => state.error,
    selectBuns: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'bun'),
    selectMains: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'main'),
    selectSauces: (state) =>
      state.ingredients.filter((ingredient) => ingredient.type === 'sauce')
  }
});

export const {
  selectAllIngredients,
  selectIngredientsLoading,
  selectIngredientsError,
  selectBuns,
  selectMains,
  selectSauces
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
