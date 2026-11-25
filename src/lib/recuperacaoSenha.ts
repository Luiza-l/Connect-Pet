export const ROTA_REDEFINICAO = '/redefinir-senha'

/** O Supabase também pode entregar o retorno de recuperação na URL principal do site. */
export function encaminharRecuperacao() {
  const { pathname, hash } = window.location
  if (!hash || pathname === ROTA_REDEFINICAO) return

  const parametros = new URLSearchParams(hash.slice(1))
  if (parametros.get('type') !== 'recovery') return

  // Retira o fragmento antes que o cliente de login possa consumir a sessão.
  window.history.replaceState(window.history.state, '', pathname)
  window.location.replace(ROTA_REDEFINICAO + hash)
}
