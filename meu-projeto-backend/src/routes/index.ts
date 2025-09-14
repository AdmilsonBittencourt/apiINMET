import { Router } from 'express';
import { 
    handleHourlyDataByStation, 
    handleHourlyDataForAllStations,
    handleDailyDataByStation
} from '../controllers/dataController.js';

const router = Router();

// Rota para dados horários de UMA estação
// Ex: /api/estacao/horario/2024-05-20/2024-05-21/A001
router.get('/estacao/horario/:startDate/:endDate/:stationCode', handleHourlyDataByStation);

// Rota para dados diários de UMA estação
// Ex: /api/estacao/diario/2024-05-20/2024-05-21/A001
router.get('/estacao/diario/:startDate/:endDate/:stationCode', handleDailyDataByStation);

// Rota para dados horários de TODAS as estações
// Ex: /api/estacoes/2024-05-21/1200
router.get('/estacoes/:date/:hour', handleHourlyDataForAllStations);

export default router;