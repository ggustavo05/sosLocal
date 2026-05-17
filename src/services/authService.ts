import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG from '../config/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    username: string;
    role: string;
  };
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Realiza login no backend usando HTTP Basic Authentication
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const basicAuth = btoa(`${credentials.username}:${credentials.password}`);
      const authHeader = `Basic ${basicAuth}`;

      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.EVENTOS.ATIVOS}`, {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await this.storeCredentials(credentials);
        await this.refreshPerfilCache(authHeader);

        return {
          success: true,
          user: {
            username: credentials.username,
            role: credentials.username === 'admin' ? 'ADMIN' : 'USER',
          },
        };
      } else if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          message: 'CPF/usuário ou senha incorretos.',
        };
      } else {
        let message = 'Erro ao conectar com o servidor';
        try {
          const text = await response.text();
          if (text && text.length > 0 && text.length < 300) {
            message = text;
          }
        } catch {
          /* ignore */
        }
        return {
          success: false,
          message,
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: 'Erro de conexão com o servidor',
      };
    }
  }

  /**
   * Atualiza nome exibido no cache (AsyncStorage) a partir do GET /api/mobile/me
   */
  private async refreshPerfilCache(authHeader: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.MOBILE.ME}`, {
        method: 'GET',
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
      });
      if (!response.ok) {
        return;
      }
      const j = (await response.json()) as {
        nomeExibicao?: string | null;
        username?: string;
        ddd?: string | null;
        numeroLocal?: string | null;
      };
      const label =
        (j.nomeExibicao && String(j.nomeExibicao).trim()) || (j.username && String(j.username).trim()) || '';
      if (label) {
        await AsyncStorage.setItem('auth_display_name', label);
      }
      const ddd = j.ddd != null ? String(j.ddd).replace(/\D/g, '').slice(0, 2) : '';
      const numero = j.numeroLocal != null ? String(j.numeroLocal).replace(/\D/g, '').slice(0, 9) : '';
      if (ddd.length === 2) {
        await AsyncStorage.setItem('auth_profile_ddd', ddd);
      } else {
        await AsyncStorage.removeItem('auth_profile_ddd');
      }
      if (numero.length >= 8) {
        await AsyncStorage.setItem('auth_profile_numero', numero);
      } else {
        await AsyncStorage.removeItem('auth_profile_numero');
      }
    } catch (error) {
      console.warn('Não foi possível carregar /api/mobile/me:', error);
    }
  }

  private async storeCredentials(credentials: LoginCredentials): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_username', credentials.username);
      await AsyncStorage.setItem('auth_password', credentials.password);
    } catch (error) {
      console.error('Erro ao armazenar credenciais:', error);
    }
  }

  async getStoredCredentials(): Promise<LoginCredentials | null> {
    try {
      const username = await AsyncStorage.getItem('auth_username');
      const password = await AsyncStorage.getItem('auth_password');

      if (username && password) {
        return { username, password };
      }
      return null;
    } catch (error) {
      console.error('Erro ao recuperar credenciais:', error);
      return null;
    }
  }

  /**
   * Texto do remetente alinhado ao fluxo web (nome exibido ou usuário)
   */
  async getRemetenteParaSms(): Promise<string> {
    try {
      const display = await AsyncStorage.getItem('auth_display_name');
      const user = await AsyncStorage.getItem('auth_username');
      const name = display?.trim() || user?.trim();
      return name || 'Cidadão';
    } catch {
      return 'Cidadão';
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_username');
      await AsyncStorage.removeItem('auth_password');
      await AsyncStorage.removeItem('auth_display_name');
      await AsyncStorage.removeItem('auth_profile_ddd');
      await AsyncStorage.removeItem('auth_profile_numero');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  /**
   * Atualiza nome + telefone em cache a partir de GET /api/mobile/me (útil após cadastro ou mudança no servidor).
   */
  async syncPerfilFromBackend(): Promise<void> {
    const header = await this.getAuthHeader();
    if (header) {
      await this.refreshPerfilCache(header);
    }
  }

  /**
   * DDD + número cadastrados no perfil (AsyncStorage), ou valores de demonstração.
   */
  async getTelefoneEmergenciaPadrao(): Promise<{ ddd: string; numero: string }> {
    try {
      const ddd = (await AsyncStorage.getItem('auth_profile_ddd'))?.trim() || '';
      const numero = (await AsyncStorage.getItem('auth_profile_numero'))?.trim() || '';
      if (ddd.length === 2 && numero.length >= 8 && numero.length <= 9) {
        return { ddd, numero };
      }
    } catch {
      /* ignore */
    }
    return { ddd: '11', numero: '999999999' };
  }

  async getAuthHeader(): Promise<string | null> {
    const credentials = await this.getStoredCredentials();
    if (credentials) {
      return `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
    }
    return null;
  }
}

export default new AuthService();
