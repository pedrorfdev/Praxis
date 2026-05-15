export function translateServerMessage(serverMessage: any): string | null {
  if (!serverMessage) return null;

  const msg = String(serverMessage).toLowerCase();

  if (Array.isArray(serverMessage)) {
    return serverMessage.map((s) => String(s)).join(" \n");
  }

  if (msg.includes("not found") || msg.includes("não encontrado") || msg.includes("not exist"))
    return "Não encontrado.";

  if (msg.includes("already exists") || msg.includes("já existe"))
    return "Já existe.";

  if (msg.includes("invalid") || msg.includes("inválid") || msg.includes("validation") || msg.includes("required") || msg.includes("missing"))
    return "Dados inválidos. Verifique os campos e tente novamente.";

  if (msg.includes("unauthorized") || msg.includes("401") || msg.includes("not authorized"))
    return "Não autorizado. Faça login novamente.";

  if (msg.includes("forbidden") || msg.includes("403"))
    return "Acesso negado.";

  if (msg.includes("email") && msg.includes("invalid"))
    return "E-mail inválido.";

  if (msg.includes("password") && (msg.includes("invalid") || msg.includes("too weak")))
    return "Senha inválida.";

  if (msg.includes("expired") && msg.includes("token"))
    return "Token inválido ou expirado.";

  if (msg.includes("could not") || msg.includes("failed") || msg.includes("error"))
    return "Ocorreu um erro ao processar a solicitação. Tente novamente.";

  return null;
}

export function getUserFacingMessage(error: any, fallback?: string) {
  // Prefer explicit userMessage attached by interceptor
  const explicit = error?.response?.data?.userMessage || error?.userMessage;
  if (explicit) return explicit;

  // Try structured issues/errors from server
  const issues = error?.response?.data?.issues || error?.response?.data?.errors;
  if (Array.isArray(issues) && issues.length > 0) {
    const joined = issues.map((i: any) => i?.message || String(i)).join(" \n");
    return joined || (fallback ?? "Ocorreu um erro. Tente novamente.");
  }

  const serverMessage = error?.response?.data?.message || error?.message;
  const translated = translateServerMessage(serverMessage);
  if (translated) return translated;

  return fallback ?? "Ocorreu um erro. Tente novamente.";
}
