import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { storage } from '../services/storage'

export const roles = { contributor: 'Colaborador', master: 'Administrador master' } as const
export type Role = keyof typeof roles
type Account = { id: string; name: string; login: string; code: string; role: Role }

export const demoAccounts: Account[] = [
  { id: 'demo-contributor', name: 'Colaborador CJR', login: 'colaborador', code: 'demo123', role: 'contributor' },
  { id: 'demo-master', name: 'Administrador CJR', login: 'master', code: 'demo123', role: 'master' },
]

export const useAuth = defineStore('auth', () => {
  const accounts = ref(storage.read('admin_accounts', demoAccounts))
  const accountId = ref(storage.read<string | null>('editorial_session', null))
  const user = computed(() => accounts.value.find(account => account.id === accountId.value))
  const isMaster = computed(() => user.value?.role === 'master')

  function signIn(login: string, code: string) {
    const current = storage.read('admin_accounts', demoAccounts)
    const account = current.find(item => item.login === login.trim().toLowerCase() && item.code === code)
    if (!account) throw new Error('Usuário ou código de demonstração inválido.')
    storage.write('editorial_session', account.id)
    accounts.value = current
    accountId.value = account.id
  }

  function signOut() {
    storage.write('editorial_session', null)
    accountId.value = null
  }

  function addAccount(input: Omit<Account, 'id'>) {
    if (!isMaster.value) throw new Error('Apenas o administrador master pode cadastrar usuários.')
    const login = input.login.trim().toLowerCase()
    const name = input.name.trim()
    if (!name || !/^[a-z0-9._-]{3,30}$/.test(login) || !/^[a-zA-Z0-9]{4,24}$/.test(input.code)) {
      throw new Error('Informe um nome fictício, um usuário de 3 a 30 caracteres e um código de demonstração alfanumérico de 4 a 24 caracteres.')
    }
    const current = storage.read('admin_accounts', demoAccounts)
    if (current.some(item => item.login === login)) throw new Error('Esse usuário já existe.')
    const next = [...current, { ...input, login, name, id: crypto.randomUUID() }]
    storage.write('admin_accounts', next)
    accounts.value = next
  }

  return { accounts, user, isMaster, signIn, signOut, addAccount }
})
