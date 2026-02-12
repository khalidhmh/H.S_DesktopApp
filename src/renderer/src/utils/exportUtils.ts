import { logger } from '@shared/utils/logger'

/**
 * Converts an array of objects to CSV format and triggers a download.
 * Adds a BOM (Byte Order Mark) to ensure Excel opens Arabic characters correctly.
 *
 * @param data Array of objects to export
 * @param filename Name of the file to download (without extension)
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) {
    logger.warn('No data to export')
    return
  }

  // Extract headers
  const headers = Object.keys(data[0])

  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map((row) =>
      headers
        .map((fieldName) => {
          // Escape quotes and wrap in quotes to handle commas/newlines in data
          const value = row[fieldName]?.toString() || ''
          const escaped = value.replace(/"/g, '""')
          return `"${escaped}"`
        })
        .join(',')
    )
  ].join('\r\n')

  // Add BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

  // Trigger download
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
