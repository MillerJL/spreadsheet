import { SpreadsheetSliceState } from "../features/spreadsheet/spreadsheetSlice"

/**
 * Save Spreadsheet to localStorage on input or manual call
 */
export const storageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action)

  if (action.type === 'spreadsheet/updateCell' || action.type === 'spreadsheet/saveSpreadsheet') {
    const state: SpreadsheetSliceState = store.getState().spreadsheet

    if (state.id) localStorage.setItem(state.id, JSON.stringify(state.sheet))
  }

  return result
}
