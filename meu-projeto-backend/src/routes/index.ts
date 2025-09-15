import { Router } from 'express';
import { 
    handleHourlyDataByStation, 
    handleHourlyDataForAllStations,
    handleDailyDataByStation,
    handleFilteredHourlyDataForDay
} from '../controllers/dataController.js';

const router = Router();

// Rota para dados horários de UMA estação
// Ex: /api/estacao/horario/2024-05-20/2024-05-21/A001
router.get('/estacao/horario', handleHourlyDataByStation);

// Rota para dados diários de UMA estação
// Ex: /api/estacao/diario/2024-05-20/2024-05-21/A001
router.get('/estacao/diario', handleDailyDataByStation);

// Rota para dados horários de TODAS as estações
// Ex: /api/estacoes/2024-05-21/1200
router.get('/estacoes', handleHourlyDataForAllStations);

// Rota para buscar dados horários JÁ FILTRADOS de um dia específico
// Ex: /api/estacao/horario/filtrado/2025-09-14/A025
router.get('/estacao/horario/filtrado', handleFilteredHourlyDataForDay);

export default router;