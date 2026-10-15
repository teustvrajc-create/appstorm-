// Телефон: "+7 (700) 555 77 55"
function national(s: string) {
  let d = s.replace(/\D/g, '');
  if (s.trim().startsWith('+')) d = d.slice(1);
  else if (d.length === 11 && (d[0] === '8' || d[0] === '7')) d = d.slice(1);
  return d.slice(0, 10);
}

function render(d: string) {
  if (!d) return '';
  let out = '+7 (' + d.slice(0, 3);
  if (d.length >= 3) out += ')';
  if (d.length > 3) out += ' ' + d.slice(3, 6);
  if (d.length > 6) out += ' ' + d.slice(6, 8);
  if (d.length > 8) out += ' ' + d.slice(8, 10);
  return out;
}

export function formatPhoneInput(next: string, prev: string) {
  let n = national(next);
  // удаление символа-разделителя: стираем последнюю цифру
  if (next.length < prev.length && n.length === national(prev).length) {
    n = n.slice(0, -1);
  }
  return render(n);
}

export const isPhoneComplete = (s: string) => national(s).length === 10;

export function passwordProblem(p: string): string | null {
  if (p.length < 8) return 'Не менее 8 символов';
  if (!/[A-Z]/.test(p) || !/[a-z]/.test(p))
    return 'Нужны прописные и строчные буквы';
  return null;
}
