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
      // Cria o header de autenticação Basic
      const basicAuth = btoa(`${credentials.username}:${credentials.password}`);
      
      // Tenta acessar um endpoint protegido para validar as credenciais
      const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.EVENTOS.ATIVOS}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Login bem-sucedido
        // Armazena as credenciais para uso posterior (em produção, use token JWT)
        await this.storeCredentials(credentials);
        
        return {
          success: true,
          user: {
            username: credentials.username,
            role: credentials.username === 'admin' ? 'ADMIN' : 'USER',
          },
        };
      } else if (response.status === 401) {
        return {
          success: false,
          message: 'Credenciais inválidas',
        };
      } else {
        return {
          success: false,
          message: 'Erro ao conectar com o servidor',
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
   * Armazena credenciais localmente (AsyncStorage)
   */
  private async storeCredentials(credentials: LoginCredentials): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('auth_username', credentials.username);
      await AsyncStorage.setItem('auth_password', credentials.password);
    } catch (error) {
      console.error('Erro ao armazenar credenciais:', error);
    }
  }

  /**
   * Recupera credenciais armazenadas
   */
  async getStoredCredentials(): Promise<LoginCredentials | null> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
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
   * Remove credenciais armazenadas (logout)
   */
  async logout(): Promise<void> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('auth_username');
      await AsyncStorage.removeItem('auth_password');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  /**
   * Cria header de autenticação Basic
   */
  async getAuthHeader(): Promise<string | null> {
    const credentials = await this.getStoredCredentials();
    if (credentials) {
      return `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
    }
    return null;
  }
}

export default new AuthService();

