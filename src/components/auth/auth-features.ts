/**
 * Catálogo central das funcionalidades que exigem uma conta autenticada.
 *
 * Para proteger uma nova funcionalidade basta:
 *  1. adicionar uma chave em `AuthFeature`;
 *  2. descrever o texto em `AUTH_FEATURES`;
 *  3. chamar `requireAuth("<chave>")` (do `useApp()`) antes de executar a ação.
 */
export type AuthFeature = "favorites" | "default";

export interface AuthFeatureContent {
  title: string;
  description: string;
}

export const AUTH_FEATURES: Record<AuthFeature, AuthFeatureContent> = {
  favorites: {
    title: "Entre para acessar seus favoritos",
    description:
      "Faça login para acessar seus favoritos e salvar os animais que deseja acompanhar.",
  },
  default: {
    title: "Acesso restrito a usuários cadastrados",
    description: "Faça login para utilizar esta funcionalidade do ConnectPet.",
  },
};

export interface AuthPromptState {
  feature: AuthFeature;
  /** Destino após login/cadastro. Padrão: a página atual, com a query string. */
  redirectTo?: string;
}

/** Aceita apenas caminhos internos (evita open redirect). */
export function sanitizeRedirect(path: string | null | undefined, fallback = "/"): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}
