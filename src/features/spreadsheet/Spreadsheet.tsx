import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'

import { RootState } from '../../app/store'
import styles from './spreadsheet.module.css'
import { selectCellValue, selectSheet } from './selectors'
import { updateCell, updateSelectedCell, initializeSpreadsheet, saveSpreadsheetId, resetSpreadsheet, saveSpreadsheet } from './spreadsheetSlice'
import { 
  createEmptySheet, 
  generateUniqueId, 
  indexToColLabel 
} from '../../utility/spreadsheetUtils'
import Header from '../../components/Header'

export const Spreadsheet = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { id } = useParams()

  const sheet = useSelector(selectSheet)
  const sheetId = useSelector((state: RootState) => state.spreadsheet.id)
  const selectedCell = useSelector((state: RootState) => state.spreadsheet.selectedCell)
  const rowCount = useSelector((state: RootState) => state.spreadsheet.rowCount)
  const colCount = useSelector((state: RootState) => state.spreadsheet.colCount)
  const getCellValue = useSelector(selectCellValue)

  /**
   * Initialize spreadsheet
   */
  useEffect(() => {
    let initialSheet = createEmptySheet(rowCount, colCount)

    if (id) {
      const savedSheet = localStorage.getItem(id)

      if (savedSheet) {
        initialSheet = JSON.parse(savedSheet)
        dispatch(saveSpreadsheetId({ id }))
      }
    } else {
      dispatch(resetSpreadsheet())
    }
    dispatch(initializeSpreadsheet({ sheet: initialSheet }))
  }, [location.pathname, dispatch])

  /**
   * Update what cell is marked as selected
   */
  const handleCellClick = (row: number, col: number) => {
    dispatch(updateSelectedCell({ row, col }))
  }

  /**
   * Update spreadsheet
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const value = e.target.value

    if (!sheetId) {
      const id = generateUniqueId()
      dispatch(saveSpreadsheetId({ id }))

      navigate(`/${id}`)
    }
    dispatch(updateCell({ row, col, value }))
  }

  /**
   * Determine if inputs match selected cell in state
   * TODO Move this to selectors
   */
  const cellMatch = (rowIndex: number, colIndex: number) => {
    return selectedCell?.row === rowIndex && selectedCell?.col === colIndex
  }

  // TODO make better error display
  const cellValueError = (rowIndex: number, colIndex: number) => {
    return ['Circular Reference', 'Invalid Reference'].includes(getCellValue(rowIndex, colIndex))
  }

  return (
    <>
      {/* Moved this last minute */}
      <Header />

      <div className={`${styles['spreadsheet-container']}`}>
        <div className={`${styles.row}`}>
          <div className={`
            ${styles.cell} 
            ${styles['header-cell']} 
            ${styles['row-header']} 
            ${styles['top-left-header']}
          `} />
          {Array.from({ length: colCount }, (_, i) => (
            <div
              key={i}
              className={`
                ${styles.cell} 
                ${styles['header-cell']} 
                ${styles['col-header']}
                ${selectedCell?.col === i ? styles['selected-header'] : ''}
              `}
            >
              {indexToColLabel(i)}
            </div>
          ))}
        </div>

        {Array.from({ length: rowCount }, (_, rowIndex) => (
          <div key={rowIndex} className={`${styles.row}`}>
            <div 
              className={`
                ${styles.cell} 
                ${styles['header-cell']} 
                ${styles['row-header']}
                ${selectedCell?.row === rowIndex ? styles['selected-header'] : ''}
              `}
            >
              {rowIndex + 1}
            </div>
            {Array.from({ length: colCount }, (_, colIndex) => (
              <div
                key={colIndex}
                className={`
                  ${styles.cell} 
                  ${cellMatch(rowIndex, colIndex) ? styles.selected : ''}
                  ${cellValueError(rowIndex, colIndex) ? styles.error : ''}
                `}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cellMatch(rowIndex, colIndex) ? (
                  <input
                    type="text"
                    autoFocus
                    value={sheet[rowIndex][colIndex]}
                    onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                  />
                ) : (
                  getCellValue(rowIndex, colIndex)
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
