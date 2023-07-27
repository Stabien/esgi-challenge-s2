import cx from 'classnames';
import { twMerge } from 'tailwind-merge';
import { numberOfLogo } from '@/utils/constant';
import jwt_decode from 'jwt-decode';
import { userStatusWebmaster, userStatusAdmin, userStatusVisitor } from '@/utils/userConstant';

export const cn = (...inputs) => {
  return twMerge(cx(inputs));
};

export const decodeToken = () => {
  try {
    return jwt_decode(localStorage.getItem('token'));
  } catch (error) {
    // return 'error';
    // console.log(error);
  }
};
export const updateLocalStorage = (key, value) => {
  localStorage.setItem(key, value);

  // Déclencher une action personnalisée pour indiquer que les données ont été mises à jour
  const event = new CustomEvent('local-storage-updated', { detail: { key, value } });
  window.dispatchEvent(event);
};
export const removeLocalStorageItem = (key) => {
  localStorage.removeItem(key);

  // Déclencher une action personnalisée pour indiquer que les données ont été mises à jour
  const event = new CustomEvent('local-storage-updated', { detail: { key } });
  window.dispatchEvent(event);
};

export const getConnectionProviderValue = () => {
  const decodedNewToken = decodeToken();
  if (!decodedNewToken) {
    return { isLogged: false, status: userStatusVisitor, decodedToken: {} };
  }
  return {
    isLogged: !!decodedNewToken,
    status: decodedNewToken.isAdmin ? userStatusAdmin : userStatusWebmaster,
    decodedToken: decodedNewToken
  };
};

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const getLogo = () => {
  if (!localStorage.getItem('logoNumber')) {
    localStorage.setItem('logoNumber', 1);
  }
  const currentLogo = localStorage.getItem('logoNumber');
  return `/eyes/eyes${currentLogo}.svg`;
};
export const setLogo = () => {
  const randomNumber = randomInt(1, numberOfLogo);
  localStorage.setItem('logoNumber', randomNumber);
};

export const getOcto = (ecart = 20) => {
  const x1 = 0 + ecart;
  const y1 = 0;

  const x2 = 100 - ecart;
  const y2 = 0;

  const x3 = 100;
  const y3 = 0 + ecart;

  const x4 = 100;
  const y4 = 100 - ecart;

  const x5 = 100 - ecart;
  const y5 = 100;

  const x6 = 0 + ecart;
  const y6 = 100;

  const x7 = 0;
  const y7 = 100 - ecart;

  const x8 = 0;
  const y8 = 0 + ecart;

  const result = `${x1}% ${y1}%, ${x2}% ${y2}%, ${x3}% ${y3}%,${x4}% ${y4}%, ${x5}% ${y5}%,${x6}% ${y6}%, ${x7}% ${y7}%, ${x8}% ${y8}%`;
  return `polygon(${result})`;
};

export const getRandomItem = (array) => {
  return array[randomInt(0, array.length)];
};

export const errorHandler = (error) => {
  switch (error) {
    case "Passwords don't match":
      return 'passs';

    default:
      return 'Something went wrong';
  }
};
