import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData
} from '../utils/burger-api';
import { setCookie, deleteCookie } from '../utils/cookie';
import { TUser } from '../utils/types';

export interface UserAuthState {
  user: TUser | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  loginError: string | null;
  registerError: string | null;
}

const initialState: UserAuthState = {
  user: null,
  isAuthenticated: false,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  loginError: null,
  registerError: null
};

// Асинхронные thunk-функции для работы с пользователем
export const loginUser = createAsyncThunk(
  'userAuth/login',
  async (credentials: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(credentials);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка входа'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'userAuth/register',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка регистрации'
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'userAuth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка проверки авторизации'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'userAuth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка выхода'
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  'userAuth/update',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления данных'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'userAuth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await forgotPasswordApi({ email });
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка восстановления пароля'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'userAuth/resetPassword',
  async (
    { password, token }: { password: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      await resetPasswordApi({ password, token });
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка сброса пароля'
      );
    }
  }
);

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    clearAuthErrors: (state) => {
      state.error = null;
      state.loginError = null;
      state.registerError = null;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.loginError = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.loginError = action.payload as string;
        state.isAuthChecked = true;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.registerError = action.payload as string;
        state.isAuthChecked = true;
      })
      // Check auth
      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reset password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectIsLoading: (state) => state.isLoading,
    selectLoginError: (state) => state.loginError,
    selectRegisterError: (state) => state.registerError
  }
});

export const { clearAuthErrors, setAuthChecked } = userAuthSlice.actions;

export const {
  selectUser,
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectIsLoading,
  selectLoginError,
  selectRegisterError
} = userAuthSlice.selectors;

export default userAuthSlice.reducer;
