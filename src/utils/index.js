export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function turnDate(time) {
  // 時間格式轉換 YYYY-MM-DDTHH:mm:ss.sssZ → YYYY-MM-DD
  if (time === null || !time) {
    return '無期限';
  }
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export function isFileSizeValid(files, maxSize) {
  let valid = true;
  if (files) {
    files.map((file) => {
      const fileSize = file.size;
      if (fileSize > maxSize) {
        valid = false;
      }
      return valid;
    });
  }
  return valid;
}

export function isFileTypesValid(files, authorizedExtensions) {
  let valid = true;
  if (files) {
    files.map((file) => {
      if (!authorizedExtensions.includes(file.type)) {
        valid = false;
      }
      return valid;
    });
  }
  return valid;
}

export default {
  getCookie,
  setCookie,
  deleteCookie,
  turnDate,
  isFileSizeValid,
  isFileTypesValid,
};
