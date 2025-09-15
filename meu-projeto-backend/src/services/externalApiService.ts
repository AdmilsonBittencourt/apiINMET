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
      // Verificamos se o erro é do axios para extrair mais detalhes
    if (axios.isAxiosError(error)) {
      console.error('==================================================');
      console.error('ERRO DETALHADO DA CHAMADA AXIOS:');
      console.error('Status da Resposta:', error.response?.status);
      console.error('Mensagem da API Externa:', error.response?.data);
      console.error('URL da Requisição:', error.config?.url);
      console.error('parametros: ', startDate, endDate, startDate);
      console.error('==================================================');
    } else {
      // Caso seja um erro inesperado, não relacionado ao axios
      console.error('ERRO INESPERADO:', error);
    }
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


/**
 * Recupera dados horários de um dia específico para uma estação,
 * retornando apenas os campos selecionados.
 */
export const getFilteredHourlyDataForDay = async (date: string, stationCode: string) => {
  console.log(date, stationCode)
  // 1. Reutilizamos a função existente para buscar os dados completos do dia
  const allHourlyData = await getHourlyDataByStation(date, date, stationCode);

  console.log(allHourlyData)

  if (!allHourlyData || allHourlyData.length === 0) {
    return []; // Retorna um array vazio se não houver dados
  }

  // 2. Usamos a função .map() para transformar cada objeto do array
  const filteredData = allHourlyData.map(hourlyRecord => {
    // Para cada registro horário, criamos um novo objeto apenas com os campos desejados.
    // Incluímos a HORA para dar contexto a cada registro.
    return {
      HR_MEDICAO: hourlyRecord.HR_MEDICAO,
      TEM_MIN: hourlyRecord.TEM_MIN,
      TEM_MAX: hourlyRecord.TEM_MAX,
      UMD_MIN: hourlyRecord.UMD_MIN,
      UMD_MAX: hourlyRecord.UMD_MAX,
      CHUVA: hourlyRecord.CHUVA,
      RAD_GLO: hourlyRecord.RAD_GLO,
      VEN_VEL: hourlyRecord.VEN_VEL,
      VEN_RAJ: hourlyRecord.VEN_RAJ,
      VEN_DIR: hourlyRecord.VEN_DIR,
    };
  });

  return filteredData;
};

