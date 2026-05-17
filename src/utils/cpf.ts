/** Apenas os 11 dígitos do CPF (máx.). */
export function cpfDigitsOnly(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

/** Máscara 000.000.000-00 para exibição. */
export function formatCpfMask(value: string): string {
  const numbers = cpfDigitsOnly(value);
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }
  return value;
}

/** Valida dígitos verificadores (11 dígitos, sem máscara). */
export function isValidCpfDigits(digits11: string): boolean {
  const s = cpfDigitsOnly(digits11);
  if (s.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(s)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(s[i], 10) * (10 - i);
  let d1 = (sum * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(s[9], 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(s[i], 10) * (11 - i);
  let d2 = (sum * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(s[10], 10);
}
