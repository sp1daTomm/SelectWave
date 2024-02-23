// useWebSocket.js
import { onMounted, onUnmounted, ref } from 'vue';

function getTokenFromCookie() {
  const name = 'selectWaveToken=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function useWebSocket() {
  const ws = ref(null);

  const webSocketOnOpen = () => {
    console.log('ws 連線成功~~');
    // 從 Cookie 中取得 token
    const token = getTokenFromCookie();
    // 發送 token 到服務器
    if (token && ws.value) {
      ws.value.send(JSON.stringify({ type: 'auth', token }));
    }
  };

  onMounted(() => {
    const wsURL = import.meta.env.VITE_APP_WS_URL;
    ws.value = new WebSocket(wsURL);

    ws.value.onopen = () => {
      console.log('WebSocket connection established');
      webSocketOnOpen();
    };

    ws.value.onerror = (e) => {
      console.error('WebSocket connection failed', e);
    };

    ws.value.onmessage = (event) => {
      console.log('Message from server ', event.data);
    };

    ws.value.onclose = () => {
      console.log('WebSocket connection closed');
    };
  });

  onUnmounted(() => {
    if (ws.value) {
      ws.value.close();
    }
  });

  const send = (data) => {
    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      console.log('Sending data', data);
      ws.value.send(data);
    } else {
      console.error('WebSocket is not connected.');
    }
  };

  return { ws, send };
}

export default useWebSocket;
