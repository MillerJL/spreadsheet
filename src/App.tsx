import "./App.css"
import { Route, Routes } from "react-router-dom"
import { Spreadsheet } from "./features/spreadsheet/Spreadsheet"
import { SpreadsheetWrapper } from "./features/spreadsheet/SpreadsheetWrapper"


function App() {
  return (
    <div className="App" id="app">
      <div className="content">
        <Routes>
          <Route path="/" element={<Spreadsheet />} />
          <Route path="/:id" element={<SpreadsheetWrapper />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
