import { useParams } from 'react-router-dom'
import { Spreadsheet } from './Spreadsheet'
import { Error } from '../../components/Error'

export const SpreadsheetWrapper = () => {
  const { id } = useParams()

  if (typeof id !== 'string') {
    return <Error />
  }

  const isValid = /^[a-zA-Z0-9]{7}$/.test(id)
  const existsInLocalStorage = Boolean(localStorage.getItem(id))

  if (!isValid || !existsInLocalStorage) {
    return <Error />
  }

  return <Spreadsheet />
}
