import CryptoJS from 'crypto-js';

export const ENCODE = (str: string): string => {
  const result = CryptoJS.AES.encrypt(
    JSON.stringify(str),
    process.env.PRIVATE_KEY || '',
  ).toString();

  return result;
};

export const DECODE = (str: string): string => {
  const bytes = CryptoJS.AES.decrypt(str, process.env.PRIVATE_KEY || '');
  const result = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return result;
};

export const RANDOM_NUMBER_BETWEEN_TWO_NUMBERS = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const RANDOM_FLOAT_BETWEEN_TWO_NUMBERS = (min: number, max: number) => {
  return Number((Math.random() * (min - max) + max).toFixed(2));
};

export const ACTIONS_TYPES = {
  NEW_USER_CREATED: 'NEW_USER_CREATED',
  USER_LOGIN: 'USER_LOGIN',
  USER_REFRESH_TOKEN: 'USER_REFRESH_TOKEN',
  USER_GET_ME: 'USER_GET_ME',
};

export const ROLES_TYPES = {
  USER: 'resu',
  MANAGER: 'reganam',
  ROOT: 'toor',
};

export const ERRORS = {
  UNAUTHORIZED: {
    code: 401,
    json: {
      r: false,
      errors: ['NÃO AUTORIZADO.'],
    },
  },
  FORBIDDEN: {
    code: 403,
    json: {
      r: false,
      errors: ['OPS... ACHO QUE VOCÊ ESTÁ NO LUGAR ERRADO.'],
    },
  },
  EXPIRED_TOKEN: {
    code: 401,
    json: {
      r: false,
      errors: ['TOKEN EXPIRADO.'],
    },
  },
};
