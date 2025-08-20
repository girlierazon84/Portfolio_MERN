import { error } from 'console'
import winston from 'winston'


const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'

    return isDevelopment ? 'debug' : 'info'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'blue',
    silly: 'grey'
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss:ms'}),
    winston.format.colorize({all: true}),
    winston.format.printf(({timestamp, level, message}) => {
        return ` [${timestamp}] ${level}: ${message}`
    })
)

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',  
    }),
    new winston.transports.File({
        filename: 'logs/all.log',
        level: 'info',
    }),
]

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
})

export default logger