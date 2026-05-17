/**
 * Áreas de risco — consumidas da API Spring (SosLocaliza) /api/mobile/areas-risco
 */

import API_CONFIG from '../config/api';
import { RiskArea, RiskLevel, RISK_MARKER_CONFIG, MarkerConfig } from '../types/riskAreas';

class RiskAreasService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT.RISK_AREAS;
  }

  async fetchRiskAreas(): Promise<RiskArea[]> {
    const url = `${this.baseUrl}${API_CONFIG.ENDPOINTS.MOBILE.AREAS_RISCO}`;
    console.log('=== BUSCANDO ÁREAS DE RISCO (API Java) ===');
    console.log('URL:', url);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos da API:', data);

      let areas: RiskArea[] = [];

      if (Array.isArray(data)) {
        areas = data;
      } else if (data.items && Array.isArray(data.items)) {
        areas = data.items;
      } else if (data.data && Array.isArray(data.data)) {
        areas = data.data;
      } else {
        console.warn('Formato de resposta inesperado:', data);
        areas = [];
      }

      const validAreas = areas.filter(this.isValidRiskArea);

      console.log(`${validAreas.length} áreas de risco válidas encontradas`);

      return validAreas;
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };
      if (err?.name === 'AbortError') {
        console.error('Timeout ao buscar áreas de risco');
        throw new Error('Timeout: A requisição demorou muito para responder');
      }

      console.error('Erro ao buscar áreas de risco:', error);
      throw new Error(`Falha ao buscar áreas de risco: ${err?.message || String(error)}`);
    }
  }

  private isValidRiskArea(area: unknown): area is RiskArea {
    if (!area || typeof area !== 'object') {
      return false;
    }
    const a = area as Record<string, unknown>;

    const hasValidLatitude =
      typeof a.latitude === 'number' && (a.latitude as number) >= -90 && (a.latitude as number) <= 90;

    const hasValidLongitude =
      typeof a.longitude === 'number' &&
      (a.longitude as number) >= -180 &&
      (a.longitude as number) <= 180;

    const hasValidRisk =
      typeof a.risco_previsto === 'string' &&
      ['alto', 'medio', 'baixo'].includes((a.risco_previsto as string).toLowerCase());

    return hasValidLatitude && hasValidLongitude && hasValidRisk;
  }

  getMarkerConfig(riskLevel: RiskLevel): MarkerConfig {
    const normalizedLevel = riskLevel.toLowerCase() as RiskLevel;
    return RISK_MARKER_CONFIG[normalizedLevel] || RISK_MARKER_CONFIG.medio;
  }

  getRiskColor(riskLevel: RiskLevel): string {
    return this.getMarkerConfig(riskLevel).fillColor;
  }

  getRiskLabel(riskLevel: RiskLevel): string {
    return this.getMarkerConfig(riskLevel).label;
  }

  getRiskEmoji(riskLevel: RiskLevel): string {
    return this.getMarkerConfig(riskLevel).emoji;
  }

  groupByRiskLevel(areas: RiskArea[]): Record<RiskLevel, RiskArea[]> {
    return areas.reduce(
      (acc, area) => {
        const level = area.risco_previsto.toLowerCase() as RiskLevel;
        if (!acc[level]) {
          acc[level] = [];
        }
        acc[level].push(area);
        return acc;
      },
      {} as Record<RiskLevel, RiskArea[]>
    );
  }

  getStatistics(areas: RiskArea[]): Record<RiskLevel, number> {
    const grouped = this.groupByRiskLevel(areas);
    return {
      alto: grouped.alto?.length || 0,
      medio: grouped.medio?.length || 0,
      baixo: grouped.baixo?.length || 0,
    };
  }
}

const riskAreasService = new RiskAreasService();
export default riskAreasService;
