import API_CONFIG from '../config/api';
import authService from './authService';

export interface SmsRequest {
  remetente: string;
  ddd: string;
  numeroTelefone: string;
  mensagem: string;
  idEvento: number;
}

export interface SmsResponse {
  idSms: number;
  remetente: string;
  numeroTelefone: string;
  ddd: string;
  mensagem: string;
  dataEnvio: string;
  enviadoComSucesso: boolean;
  erro?: string;
  idEvento: number;
}

export interface Evento {
  idEvento: number;
  nomeEvento: string;
  descricaoEvento?: string;
  ativo?: boolean;
}

class SmsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Envia SMS de emergência
   */
  async enviarSms(smsData: SmsRequest): Promise<{ success: boolean; data?: SmsResponse; message?: string }> {
    try {
      const authHeader = await authService.getAuthHeader();
      
      if (!authHeader) {
        return {
          success: false,
          message: 'Usuário não autenticado',
        };
      }

      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.SMS.ENVIAR}`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(smsData),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
        };
      } else if (response.status === 401) {
        return {
          success: false,
          message: 'Não autorizado. Faça login novamente.',
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          message: `Erro ao enviar SMS: ${errorText}`,
        };
      }
    } catch (error) {
      console.error('Erro ao enviar SMS:', error);
      return {
        success: false,
        message: 'Erro de conexão com o servidor',
      };
    }
  }

  /**
   * Envia SMS de emergência vinculado a um evento específico
   */
  async enviarSmsEmergencia(
    idEvento: number,
    smsData: Omit<SmsRequest, 'idEvento'>
  ): Promise<{ success: boolean; data?: SmsResponse; message?: string }> {
    try {
      const authHeader = await authService.getAuthHeader();
      
      if (!authHeader) {
        return {
          success: false,
          message: 'Usuário não autenticado',
        };
      }

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.SMS.EMERGENCIA(idEvento)}`,
        {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...smsData, idEvento }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
        };
      } else if (response.status === 401) {
        return {
          success: false,
          message: 'Não autorizado. Faça login novamente.',
        };
      } else {
        const errorText = await response.text();
        return {
          success: false,
          message: `Erro ao enviar SMS: ${errorText}`,
        };
      }
    } catch (error) {
      console.error('Erro ao enviar SMS de emergência:', error);
      return {
        success: false,
        message: 'Erro de conexão com o servidor',
      };
    }
  }

  /**
   * Busca eventos ativos
   */
  async buscarEventosAtivos(): Promise<{ success: boolean; data?: Evento[]; message?: string }> {
    try {
      const authHeader = await authService.getAuthHeader();
      
      if (!authHeader) {
        return {
          success: false,
          message: 'Usuário não autenticado',
        };
      }

      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.EVENTOS.ATIVOS}`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data,
        };
      } else if (response.status === 401) {
        return {
          success: false,
          message: 'Não autorizado. Faça login novamente.',
        };
      } else {
        return {
          success: false,
          message: 'Erro ao buscar eventos',
        };
      }
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      return {
        success: false,
        message: 'Erro de conexão com o servidor',
      };
    }
  }

  /**
   * Lista todos os SMS enviados
   */
  async listarSms(): Promise<{ success: boolean; data?: SmsResponse[]; message?: string }> {
    try {
      const authHeader = await authService.getAuthHeader();
      
      if (!authHeader) {
        return {
          success: false,
          message: 'Usuário não autenticado',
        };
      }

      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.SMS.GET_ALL}`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          data: data.content || data,
        };
      } else if (response.status === 401) {
        return {
          success: false,
          message: 'Não autorizado. Faça login novamente.',
        };
      } else {
        return {
          success: false,
          message: 'Erro ao listar SMS',
        };
      }
    } catch (error) {
      console.error('Erro ao listar SMS:', error);
      return {
        success: false,
        message: 'Erro de conexão com o servidor',
      };
    }
  }
}

export default new SmsService();

