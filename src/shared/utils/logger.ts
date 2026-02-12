/**
 * Shared Logger Utility
 * Replaces console.* calls in production
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDev: boolean

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development'
  }

  error(message: string, context?: LogContext): void {
    if (this.isDev) {
      console.error(`[ERROR] ${message}`, context || '')
    }
    // In production: send to logging service
    this.writeToFile('error', message, context)
  }

  warn(message: string, context?: LogContext): void {
    if (this.isDev) {
      console.warn(`[WARN] ${message}`, context || '')
    }
    this.writeToFile('warn', message, context)
  }

  info(message: string, context?: LogContext): void {
    if (this.isDev) {
      console.info(`[INFO] ${message}`, context || '')
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDev) {
      console.debug(`[DEBUG] ${message}`, context || '')
    }
  }

  private writeToFile(level: LogLevel, message: string, context?: LogContext): void {
    // TODO: Implement file logging for production
    // For now, we'll skip file writing in development
    if (!this.isDev) {
      // Example: fs.appendFileSync('logs/app.log', JSON.stringify({ level, message, context, timestamp: new Date() }))
    }
  }
}

export const logger = new Logger()
