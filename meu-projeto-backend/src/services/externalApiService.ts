import axios from 'axios';
import 'dotenv/config';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL ?? "",
});

const token = process.env.INMET_TOKEN;

// Interface para definir o formato dos dados que esperamos da API
// Isso ajuda o TypeScript a entender os dados e previne erros.
interface WeatherData {
  DC_NOME: string;
  DT_MEDICAO: string;
  HR_MEDICAO?: string; // Opcional, pois não existe nos dados diários
  CD_ESTACAO: string;
  [key: string]: any; // Permite outras propriedades
}

/**
 * Recupera dados horários para uma estação específica.
 */
export const getHourlyDataByStation = async (
  startDate: string,
  endDate: string,
  stationCode: string
): Promise<WeatherData[]> => {
  if (!token) throw new Error('Token da API INMET não configurado.');
  
  const url = `/token/estacao/${startDate}/${endDate}/${stationCode}/${token}`;
  console.log(`Buscando dados em: ${url}`);
  
  try {
    const { data } = await apiClient.get<WeatherData[]>(url);
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados horários por estação:', error);
    throw new Error('Falha ao obter dados da API externa.');
  }
};

/**
 * Recupera dados horários de todas as estações para um dia e hora específicos.
 */
export const getHourlyDataForAllStations = async (
  date: string,
  hour: string
): Promise<WeatherData[]> => {
  if (!token) throw new Error('Token da API INMET não configurado.');
  
  // A API espera a hora no formato "0000", "0100", etc.
  const formattedHour = hour.replace(':', '').padStart(4, '0');
  const url = `/token/estacao/dados/${date}/${formattedHour}/${token}`;
  console.log(`Buscando dados em: ${url}`);

  try {
    const { data } = await apiClient.get<WeatherData[]>(url);
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados horários de todas as estações:', error);
    throw new Error('Falha ao obter dados da API externa.');
  }
};


/**
 * Recupera dados diários para uma estação específica.
 */
export const getDailyDataByStation = async (
  startDate: string,
  endDate: string,
  stationCode: string
): Promise<WeatherData[]> => {
  if (!token) throw new Error('Token da API INMET não configurado.');
  
  const url = `/token/estacao/diaria/${startDate}/${endDate}/${stationCode}/${token}`;
  console.log(`Buscando dados em: ${url}`);
  
  try {
    const { data } = await apiClient.get<WeatherData[]>(url);
    return data;
  } catch (error) {
    console.error('Erro ao buscar dados diários por estação:', error);
    throw new Error('Falha ao obter dados da API externa.');
  }
};