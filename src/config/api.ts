// Configuração da API
const API_CONFIG = {
  // URL base do backend - ajuste conforme necessário
  BASE_URL: 'http://localhost:8081',
  
  // URL da API Oracle APEX para áreas de risco
  ORACLE_APEX_URL: 'https://oracleapex.com/ords/oracle_soslo',
  
  // Endpoints
  ENDPOINTS: {
    LOGIN: '/login',
    EVENTOS: {
      ATIVOS: '/api/eventos/ativos',
      GET_ALL: '/api/eventos/getAll',
      GET_BY_ID: (id: number) => `/api/eventos/getById/${id}`,
    },
    SMS: {
      ENVIAR: '/api/sms',
      EMERGENCIA: (idEvento: number) => `/api/sms/emergencia/${idEvento}`,
      GET_ALL: '/api/sms/getAll',
    },
    RISK_AREAS: {
      GET_ALL: '/risco/areas',
    },
  },
  
  // Credenciais padrão para testes (remover em produção)
  DEFAULT_CREDENTIALS: {
    username: 'citizen',
    password: 'password',
  },
  
  // Configurações de timeout
  TIMEOUT: {
    DEFAULT: 10000, // 10 segundos
    RISK_AREAS: 15000, // 15 segundos para áreas de risco
  },
};

export default API_CONFIG;


