/**
 * Tipos TypeScript para Áreas de Risco
 * API Oracle APEX Integration
 */

// Níveis de risco possíveis
export type RiskLevel = 'alto' | 'medio' | 'baixo';

// Interface para área de risco retornada pela API Oracle APEX
export interface RiskArea {
  latitude: number;
  longitude: number;
  risco_previsto: RiskLevel;
}

// Interface para resposta da API (pode ser array ou objeto com items)
export interface RiskAreasResponse {
  items?: RiskArea[];
  // Caso a API retorne diretamente um array
  data?: RiskArea[];
}

// Configuração de marcador por nível de risco
export interface MarkerConfig {
  color: string;
  fillColor: string;
  icon: string;
  label: string;
  emoji: string;
}

// Mapeamento de cores e configurações por nível de risco
export const RISK_MARKER_CONFIG: Record<RiskLevel, MarkerConfig> = {
  alto: {
    color: '#ffffff',
    fillColor: '#dc3545',
    icon: 'red',
    label: 'Alto Risco',
    emoji: '🔴',
  },
  medio: {
    color: '#ffffff',
    fillColor: '#ffc107',
    icon: 'orange',
    label: 'Médio Risco',
    emoji: '🟡',
  },
  baixo: {
    color: '#ffffff',
    fillColor: '#28a745',
    icon: 'green',
    label: 'Baixo Risco',
    emoji: '🟢',
  },
};

// Interface para estado de carregamento
export interface RiskAreasState {
  areas: RiskArea[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

