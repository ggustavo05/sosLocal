// URL base do backend Spring (SosLocaliza) — perfil dev local na porta 8082
// Metro Expo do sosLocal: porta 8081 (ver npm run start)
// Emulador Android: http://10.0.2.2:8082
// Dispositivo físico: IP da máquina, ex. http://192.168.0.10:8082
// Acesso direto para o Metro embutir EXPO_PUBLIC_* no bundle web (export).
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8082',

  ENDPOINTS: {
    LOGIN: '/login',
    MOBILE: {
      CADASTRO: '/api/mobile/cadastro',
      AREAS_RISCO: '/api/mobile/areas-risco',
      ME: '/api/mobile/me',
      REVERSE_GEOCODE: '/api/mobile/reverse-geocode',
    },
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
  },

  DEFAULT_CREDENTIALS: {
    username: 'citizen',
    password: 'password',
  },

  TIMEOUT: {
    DEFAULT: 30000,
    RISK_AREAS: 45000,
  },
};

export default API_CONFIG;
