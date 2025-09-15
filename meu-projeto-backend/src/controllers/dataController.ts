import { Request, Response } from 'express';
import * as apiService from '../services/externalApiService.js';

/**
 * Controlador para dados horários de uma estação.
 */
export const handleHourlyDataByStation = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, stationCode } = req.query;
    const rawData = await apiService.getHourlyDataByStation(String(startDate), String(endDate), String(stationCode));

    // --- PONTO CHAVE: LOCAL DOS CÁLCULOS ---
    // Exemplo de cálculo: Calcular a temperatura média no período.
    // Os valores vêm como string, então precisamos convertê-los para número.
    const temperatures = rawData.map(d => parseFloat(d.TEM_INS)).filter(t => !isNaN(t));
    const averageTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;

    const processedData = {
      station: rawData[0]?.DC_NOME || 'Não encontrada',
      stationCode,
      period: `${startDate} a ${endDate}`,
      averageTemperature: averageTemp.toFixed(2), // Arredonda para 2 casas decimais
      totalReadings: rawData.length,
      rawData: rawData, // Opcional: retornar os dados brutos também
    };

    res.status(200).json(processedData);
  } catch (error) {
    if (error instanceof Error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  } else {
    // Caso seja outro tipo de erro
    res.status(500).json({ message: 'Erro interno no servidor.', error: String(error) });
  }
  }
};

/**
 * Controlador para dados horários de todas as estações.
 */
export const handleHourlyDataForAllStations = async (req: Request, res: Response) => {
  try {
    const { date, hour } = req.query;
    const rawData = await apiService.getHourlyDataForAllStations(String(date), String(hour));

    // --- PONTO CHAVE: LOCAL DOS CÁLCULOS ---
    // Exemplo: Encontrar a estação com a maior e a menor temperatura na hora consultada.
    let maxTempStation = rawData[0];
    let minTempStation = rawData[0];

    for (const station of rawData) {
      if (parseFloat(station.TEM_INS) > parseFloat(maxTempStation!.TEM_INS)) {
        maxTempStation = station;
      }
      if (parseFloat(station.TEM_INS) < parseFloat(minTempStation!.TEM_INS)) {
        minTempStation = station;
      }
    }

    const processedData = {
      date,
      hour,
      totalStations: rawData.length,
      stationWithMaxTemp: {
        name: maxTempStation!.DC_NOME,
        uf: maxTempStation!.UF,
        temp: maxTempStation!.TEM_INS
      },
      stationWithMinTemp: {
        name: minTempStation!.DC_NOME,
        uf: minTempStation!.UF,
        temp: minTempStation!.TEM_INS
      }
    }

    res.status(200).json(processedData);
  } catch (error) {
    if (error instanceof Error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  } else {
    // Caso seja outro tipo de erro
    res.status(500).json({ message: 'Erro interno no servidor.', error: String(error) });
  }
  }
};

/**
 * Controlador para dados diários de uma estação.
 */
export const handleDailyDataByStation = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, stationCode } = req.query;
        const rawData = await apiService.getDailyDataByStation(String(startDate), String(endDate), String(stationCode));
        
        // --- PONTO CHAVE: LOCAL DOS CÁLCULOS ---
        // Exemplo: Calcular o total de chuva no período.
        const totalRain = rawData.reduce((sum, day) => sum + parseFloat(day.CHUVA || '0'), 0);

        const processedData = {
            station: rawData[0]?.DC_NOME || 'Não encontrada',
            stationCode,
            period: `${startDate} a ${endDate}`,
            totalRainfall: totalRain.toFixed(2) + ' mm',
            daysWithData: rawData.length,
            rawData,
        };
        
        res.status(200).json(processedData);
    } catch (error) {
        if (error instanceof Error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  } else {
    // Caso seja outro tipo de erro
    res.status(500).json({ message: 'Erro interno no servidor.', error: String(error) });
  }
    }
};

/**
 * Controlador para dados horários filtrados de um dia para uma estação.
 */
export const handleFilteredHourlyDataForDay = async (req: Request, res: Response) => {
  try {
    const { date, stationCode } = req.query;
    console.log({date: date, stationCode: stationCode})
    const processedData = await apiService.getFilteredHourlyDataForDay(String(date), String(stationCode));

    if (processedData.length === 0) {
      return res.status(404).json({ 
        message: 'Nenhum dado encontrado para esta data e estação.',
        date,
        stationCode
      });
    }

    res.status(200).json(processedData);
  } catch (error) {
    if (error instanceof Error) {
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  } else {
    // Caso seja outro tipo de erro
    res.status(500).json({ message: 'Erro interno no servidor.', error: String(error) });
  }
  }
};