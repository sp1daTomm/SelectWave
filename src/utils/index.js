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

export function turnDateTime(dateTime) {
  const now = new Date();
  const target = new Date(dateTime);
  const diff = now - target;
  const hoursDiff = Math.floor(diff / (1000 * 60 * 60));
  const underOneHour = Math.floor(diff / (1000 * 60));

  if (underOneHour < 60) {
    return `${underOneHour} 分鐘前`;
  }

  if (hoursDiff < 24) {
    return `${hoursDiff} 小時前`;
  }

  if (hoursDiff >= 24 && hoursDiff < 24 * 7) {
    return `${Math.floor(hoursDiff / 24)} 天前`;
  }

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // 使用 24 小時制
    timeZone: 'Asia/Taipei', // 設定時區為 UTC
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(target);

  return formattedDate.replace(',', '');
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

export function formatImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scaleHeight = 800;
        const ratio = scaleHeight / img.height;
        const scaleWidth = img.width * ratio;
        const canvas = document.createElement('canvas');
        canvas.width = scaleWidth;
        canvas.height = scaleHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, scaleWidth, scaleHeight);
        // 使用toBlob方法轉換為blob並解析Promise
        canvas.toBlob((blob) => {
          if (blob.size > 2 * 1024 * 1024) {
            reject(new Error('檔案大小超過2MB'));
          }
          resolve(blob);
          URL.revokeObjectURL(img.src);
        }, 'image/png', 0.5);
      };
      img.onerror = reject; // 處理圖片加載錯誤
      img.src = e.target.result;
    };
    reader.onerror = reject; // 處理讀取錯誤
    reader.readAsDataURL(file);
  });
}

export default {
  getCookie,
  setCookie,
  deleteCookie,
  turnDate,
  isFileSizeValid,
  isFileTypesValid,
};
