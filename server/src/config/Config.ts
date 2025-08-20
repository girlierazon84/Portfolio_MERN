import { Express } from 'express'
import { connect } from 'mongoose'
import Logger from '../utils/Logger'


const port: number = Number(process.env.SERVER_PORT) 
const env: string = process.env.NODE_ENV ?? 'development'
const mongodbUrl: string = process.env.MONGODB_URL ?? ''
const dbName: string = process.env.MONGODB_DB_NAME ?? ''

const connectToDatabase = async () => {
    const uri = mongodbUrl + dbName
    try {
        await connect(uri)
        Logger.info('Successfully connected to the Database!')
    } catch (error) {
        Logger.error('Error while connecting to the Database!'.toUpperCase(), error)
        process.exit()
    }
}

const connectToPort = (app: Express) => {
    app.listen(port, () => {
        Logger.info(`Server is running on port ${port}`)
        if (env === 'development') {
            Logger.warn('Server is running in development mode!'.toUpperCase())
        }
    })
}

export default {
    connectToDatabase,
    connectToPort
}
