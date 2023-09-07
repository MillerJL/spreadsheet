export const indexToColLabel = (index: number): string => {
  let label = ''

  while (index >= 0) {
    const remainder = index % 26
    label = String.fromCharCode(65 + remainder) + label
    index = Math.floor(index / 26) - 1
  }

  return label
}

export const colLabelToIndex = (colAlpha: string): number => {
  let colNum = 0

  for (let i = 0; i < colAlpha.length; i++) {
    colNum = colNum * 26 + (colAlpha.charCodeAt(i) - 'A'.charCodeAt(0) + 1)
  }

  return colNum - 1
}

export const createEmptySheet = (rowCount: number, colCount: number): string[][] => {
  return Array.from({ length: rowCount }, () => Array(colCount).fill(''))
}

export const generateUniqueId = (): string => Math.random().toString(36).substring(2, 9)