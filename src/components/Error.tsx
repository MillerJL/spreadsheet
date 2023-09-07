import { Link } from "react-router-dom"

export const Error = () => {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <span>
        Unable to find spreadsheet
      </span>
      <Link to="/" className="btn flex justify-center btn-blue">Home</Link>
    </div>
  )
}
