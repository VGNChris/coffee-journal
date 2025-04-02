import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatDate(date: string | Date): string {
  if (!date) return ''
  
  // Se a data for uma string, converte para objeto Date
  let dateObj: Date
  if (typeof date === 'string') {
    // Verifica se a string está no formato ISO (YYYY-MM-DD)
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // Para datas no formato ISO, cria um objeto Date com o timezone correto
      const [year, month, day] = date.split('-').map(Number)
      // Cria a data usando UTC para evitar problemas de timezone
      dateObj = new Date(Date.UTC(year, month - 1, day))
    } else {
      // Para outros formatos, usa o construtor padrão
      dateObj = new Date(date)
    }
  } else {
    dateObj = date
  }
  
  // Cria um formatador de data com o timezone de São Paulo
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'America/Sao_Paulo'
  })
  
  // Formata a data usando o formatador
  return formatter.format(dateObj)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

