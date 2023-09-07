import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createEmptySheet } from '../../utility/spreadsheetUtils'

export interface SpreadsheetSliceState {
  rowCount: number,
  colCount: number,
  sheet: string[][],
  selectedCell: { row: number, col: number } | null,
  id: string | null,
  status: 'idle' | 'loading' | 'failed',
}

/**
 * I attempted to abstract as much as possible from referencing the datastructure 
 * outside of this slice. If I had time I'd have liked to implement something like
 * the sparse matrix discussed here. 
 * https://iq.opengenus.org/data-structure-for-spreadsheet/#sparsematrix
 */
const initialState: SpreadsheetSliceState = {
  rowCount: 100,
  colCount: 30,
  sheet: createEmptySheet(100, 30),
  selectedCell: null,
  id: null,
  status: 'idle',
}

export const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    // TODO Add row/col count. Used when importing spreadsheet with more than default rows/cols
    initializeSpreadsheet: (state, action: PayloadAction<{ sheet: string[][] }>) => {
      state.sheet = action.payload.sheet
    },
    resetSpreadsheet: (state) => {
      Object.assign(state, initialState, { sheet: createEmptySheet(100, 30) })
    },
    updateCell: (state, action: PayloadAction<{ row: number, col: number, value: string }>) => {
      const { row, col, value } = action.payload

      if (state.sheet) {
        state.sheet[row][col] = value
      }

    },
    updateSelectedCell: (state, action: PayloadAction<{ row: number, col: number } | null>) => {
      state.selectedCell = action.payload
    },
    // Just used to trigger middleware
    // TODO Create better solution
    saveSpreadsheet: (state) => {},
    // TODO Switch router to one that integrates with redux to avoid tracking ID here. Feels flimsy
    saveSpreadsheetId: (state, action: PayloadAction<{ id: string }>) => {
      state.id = action.payload.id
    }
  },
})

export const { 
  initializeSpreadsheet, 
  updateCell, 
  updateSelectedCell, 
  resetSpreadsheet,
  saveSpreadsheet,
  saveSpreadsheetId
} = spreadsheetSlice.actions

export default spreadsheetSlice.reducer
