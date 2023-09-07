import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import spreadsheetReducer from "../features/spreadsheet/spreadsheetSlice"
import { storageMiddleware } from "../utility/storageMiddleware"

export const store = configureStore({
  reducer: {
    spreadsheet: spreadsheetReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
