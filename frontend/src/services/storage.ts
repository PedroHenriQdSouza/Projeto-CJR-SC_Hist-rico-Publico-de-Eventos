const prefix = 'cjr_'
export const storage = {
  read<T>(key: string, initial: T): T {
    const existing = localStorage.getItem(prefix + key)
    if (existing !== null) return JSON.parse(existing) as T
    return initial
  },
  write<T>(key: string, value: T) {
    try {
      localStorage.setItem(prefix + key, JSON.stringify(value))
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') throw new Error('Armazenamento cheio. Reduza ou remova imagens e tente novamente.')
      throw new Error('O navegador bloqueou a gravação local. Verifique as permissões de armazenamento.')
    }
  },
}
