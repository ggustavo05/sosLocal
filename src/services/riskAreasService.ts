/**
 * Serviço para consumir API Oracle APEX de Áreas de Risco
 * Busca e processa dados de áreas com diferentes níveis de risco
 */

import API_CONFIG from '../config/api';
import { RiskArea, RiskLevel, RISK_MARKER_CONFIG, MarkerConfig } from '../types/riskAreas';

class RiskAreasService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.ORACLE_APEX_URL;
    this.timeout = API_CONFIG.TIMEOUT.RISK_AREAS;
  }

  /**
   * Busca todas as áreas de risco da API Oracle APEX
   * @returns Promise com array de áreas de risco
   */
  async fetchRiskAreas(): Promise<RiskArea[]> {
    console.log('=== BUSCANDO ÁREAS DE RISCO DA API ORACLE APEX ===');
    console.log('URL:', `${this.baseUrl}${API_CONFIG.ENDPOINTS.RISK_AREAS.GET_ALL}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.RISK_AREAS.GET_ALL}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Dados recebidos da API:', data);

      // Processar resposta - pode ser array direto ou objeto com items/data
      let areas: RiskArea[] = [];
      
      if (Array.isArray(data)) {
        areas = data;
      } else if (data.items && Array.isArray(data.items)) {
        areas = data.items;
      } else if (data.data && Array.isArray(data.data)) {
        areas = data.data;
      } else {
        console.warn('⚠️ Formato de resposta inesperado:', data);
        areas = [];
      }

      // Validar e filtrar áreas válidas
      const validAreas = areas.filter(this.isValidRiskArea);
      
      console.log(`✅ ${validAreas.length} áreas de risco válidas encontradas`);
      console.log('Áreas:', validAreas);

      return validAreas;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.error('❌ Timeout ao buscar áreas de risco');
        throw new Error('Timeout: A requisição demorou muito para responder');
      }
      
      console.error('❌ Erro ao buscar áreas de risco:', error);
      throw new Error(`Falha ao buscar áreas de risco: ${error.message}`);
    }
  }

  /**
   * Valida se uma área de risco possui dados válidos
   * @param area Área de risco a ser validada
   * @returns true se válida, false caso contrário
   */
  private isValidRiskArea(area: any): area is RiskArea {
    if (!area || typeof area !== 'object') {
      return false;
    }

    const hasValidLatitude = 
      typeof area.latitude === 'number' && 
      area.latitude >= -90 && 
      area.latitude <= 90;

    const hasValidLongitude = 
      typeof area.longitude === 'number' && 
      area.longitude >= -180 && 
      area.longitude <= 180;

    const hasValidRisk = 
      typeof area.risco_previsto === 'string' &&
      ['alto', 'medio', 'baixo'].includes(area.risco_previsto.toLowerCase());

    const isValid = hasValidLatitude && hasValidLongitude && hasValidRisk;

    if (!isValid) {
      console.warn('⚠️ Área de risco inválida:', area);
    }

    return isValid;
  }

  /**
   * Obtém a configuração de marcador para um nível de risco
   * @param riskLevel Nível de risco
   * @returns Configuração do marcador
   */
  getMarkerConfig(riskLevel: RiskLevel): MarkerConfig {
    const normalizedLevel = riskLevel.toLowerCase() as RiskLevel;
    return RISK_MARKER_CONFIG[normalizedLevel] || RISK_MARKER_CONFIG.medio;
  }

  /**
   * Obtém a cor do marcador para um nível de risco
   * @param riskLevel Nível de risco
   * @returns Cor em formato hexadecimal
   */
  getRiskColor(riskLevel: RiskLevel): string {
    return this.getMarkerConfig(riskLevel).fillColor;
  }

  /**
   * Obtém o label do marcador para um nível de risco
   * @param riskLevel Nível de risco
   * @returns Label descritivo
   */
  getRiskLabel(riskLevel: RiskLevel): string {
    return this.getMarkerConfig(riskLevel).label;
  }

  /**
   * Obtém o emoji do marcador para um nível de risco
   * @param riskLevel Nível de risco
   * @returns Emoji representativo
   */
  getRiskEmoji(riskLevel: RiskLevel): string {
    return this.getMarkerConfig(riskLevel).emoji;
  }

  /**
   * Agrupa áreas de risco por nível
   * @param areas Array de áreas de risco
   * @returns Objeto com áreas agrupadas por nível
   */
  groupByRiskLevel(areas: RiskArea[]): Record<RiskLevel, RiskArea[]> {
    return areas.reduce((acc, area) => {
      const level = area.risco_previsto.toLowerCase() as RiskLevel;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(area);
      return acc;
    }, {} as Record<RiskLevel, RiskArea[]>);
  }

  /**
   * Obtém estatísticas das áreas de risco
   * @param areas Array de áreas de risco
   * @returns Objeto com contagem por nível
   */
  getStatistics(areas: RiskArea[]): Record<RiskLevel, number> {
    const grouped = this.groupByRiskLevel(areas);
    return {
      alto: grouped.alto?.length || 0,
      medio: grouped.medio?.length || 0,
      baixo: grouped.baixo?.length || 0,
    };
  }
}

// Exportar instância única do serviço
const riskAreasService = new RiskAreasService();
export default riskAreasService;

