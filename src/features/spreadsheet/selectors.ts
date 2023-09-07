import { colLabelToIndex } from '../../utility/spreadsheetUtils'
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { SpreadsheetSliceState } from './spreadsheetSlice'

type Sheet = SpreadsheetSliceState['sheet']

export const selectSheet = (state: RootState) => state.spreadsheet.sheet
export const selectRowCount = (state: RootState) => state.spreadsheet.rowCount
export const selectColCount = (state: RootState) => state.spreadsheet.colCount

export const selectCellValue = createSelector(
  selectSheet,
  selectRowCount,
  selectColCount,
  (sheet, rowCount, colCount) => (row: number, col: number) => {
    const visited = new Set<string>()

    return resolveCell(sheet, rowCount, colCount, row, col, visited)
  }
)

/**
 * Resolves the display value of a cell, handles edge cases
 */
const resolveCell = (
  sheet: Sheet, 
  rowCount: number, 
  colCount: number, 
  row: number, 
  col: number, 
  visited: Set<string>
): string => {
  if (row < 0 || col < 0 || row >= rowCount || col >= colCount || !sheet) {
    return 'Invalid Reference'
  }

  const cellId = `${row}-${col}`

  if (visited.has(cellId)) {
    return 'Circular Reference'
  }
  visited.add(cellId)

  let cellValue = sheet[row][col]

  if (cellValue.startsWith('=')) {
    cellValue = findReference(cellValue, sheet, rowCount, colCount, visited)
  }

  return cellValue
}

const findReference = (
  reference: string, 
  sheet: Sheet, 
  rowCount: number, 
  colCount: number, 
  visited: Set<string>
): string => {
  const cellRef = reference.substring(1)
  const colLabelMatch = cellRef.match(/[A-Z]+/)
  const rowIndexMatch = cellRef.match(/\d+/)

  if (!colLabelMatch || !rowIndexMatch) {
    return 'Invalid Reference'
  }

  const colLabel = colLabelMatch[0]
  const rowIndex = parseInt(rowIndexMatch[0], 10)
  const colNum = colLabelToIndex(colLabel)

  return resolveCell(sheet, rowCount, colCount, rowIndex - 1, colNum, visited)
}
