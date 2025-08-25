import CryptoJS from "crypto-js";

// Função pura que faz o hash
const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

// Hook customizado que expõe a funcionalidade
export const useHashPassword = () => {
  return {
    hashPassword,
  };
};

// Export da função diretamente para facilitar testes
export { hashPassword };
