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

export const ACTIONS_TYPES = {
  //USER
  NEW_USER_CREATED: 'NEW_USER_CREATED',
  USER_LOGIN: 'USER_LOGIN',
  USER_REFRESH_TOKEN: 'USER_REFRESH_TOKEN',
  USER_GET_ME: 'USER_GET_ME',

  //PET
  NEW_PET_CREATED: 'NEW_PET_CREATED',
  PET_LOGIN: 'PET_LOGIN',
  PET_REFRESH_TOKEN: 'PET_REFRESH_TOKEN',
  PET_GET_ME: 'PET_GET_ME',
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
