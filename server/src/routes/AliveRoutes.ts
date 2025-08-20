import { Express } from 'express'
import StatusCode from '../config/StatusCode'

const AliveRoutes = (app: Express) => {
    app.get('/alive', (req, res) => {
        res.status(StatusCode.OK).json({ message: 'Server is alive' });
    });
};

export default AliveRoutes;
export { AliveRoutes };