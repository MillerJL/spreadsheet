import { useSelector } from "react-redux"
import { generateUniqueId, indexToColLabel } from "../utility/spreadsheetUtils"
import { RootState } from "../app/store"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../app/hooks"
import { saveSpreadsheet, saveSpreadsheetId } from "../features/spreadsheet/spreadsheetSlice"
import { useState } from "react"

const Header = () => {
  const selectedCell = useSelector((state: RootState) => state.spreadsheet.selectedCell)
  const sheetId = useSelector((state: RootState) => state.spreadsheet.id)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const [shareButtonText, setShareButtonText] = useState('Share')

  const generateShareLink = () => {
    if (!sheetId) {
      const id = generateUniqueId()
      
      dispatch(saveSpreadsheetId({ id }))
      navigate(`/${id}`)
      dispatch(saveSpreadsheet())
    }

    navigator.clipboard.writeText(window.location.href)
    // TODO Add debounce or just use MUI and find better indicator
    setShareButtonText('Link Copied')
    setTimeout(() => {
      setShareButtonText('Share')
    }, 2000)
  }

  return (
    <header className="header">
      <div className="flex justify-center items-center px-4">
        {selectedCell &&
          <>
            {indexToColLabel(selectedCell?.col)}
            {selectedCell?.row + 1}
          </>
        }
      </div>
      <button 
        type="button" 
        onClick={generateShareLink} 
        className="btn btn-blue"
      >
        {shareButtonText}
      </button>
    </header>
  )
}

export default Header