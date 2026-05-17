import API_CONFIG from '../config/api';
import { cpfDigitsOnly } from '../utils/cpf';

export interface MobileCadastroPayload {
  nomeCompleto: string;
  cpf: string;
  senha: string;
  telefone: string;
  cep: string;
}

export async function cadastrarUsuario(
  payload: MobileCadastroPayload
): Promise<{ ok: boolean; message: string; username?: string }> {
  const body = {
    nomeCompleto: payload.nomeCompleto.trim(),
    cpf: cpfDigitsOnly(payload.cpf),
    senha: payload.senha,
    telefone: payload.telefone.replace(/\D/g, ''),
    cep: payload.cep.replace(/\D/g, '').slice(0, 8),
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOBILE.CADASTRO}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });

  if (response.status === 201) {
    const data = (await response.json()) as { username?: string; message?: string };
    return { ok: true, message: data.message || 'Cadastro realizado.', username: data.username };
  }

  let message = 'Não foi possível cadastrar.';
  try {
    const text = await response.text();
    if (text) message = text.length > 200 ? `${text.slice(0, 200)}…` : text;
  } catch {
    /* ignore */
  }
  if (response.status === 409) {
    message = 'Este CPF já está cadastrado.';
  }
  if (response.status === 400) {
    message =
      message.includes('CPF') || message.includes('Telefone') || message.includes('CEP')
        ? message
        : 'Dados inválidos. Verifique os campos obrigatórios.';
  }
  return { ok: false, message };
}
