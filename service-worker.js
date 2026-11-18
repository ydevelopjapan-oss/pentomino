const CACHE_NAME = 'pentomino-v16';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './game.html',
  './manifest.json',
  './pentomino-solutions.json',
  './assets/app-icon.PNG',
  './assets/logo.PNG',
  './assets/board-texture.png',
  './assets/piece-texture.png'
];

// アプリに必要なファイルを保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// 古いキャッシュを整理して、新しいWorkerに切り替える
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key.startsWith('pentomino-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// HTMLはネット優先。オフライン時はページごとの保存済みHTMLを使う
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    const url = new URL(event.request.url);
    const cacheKey = url.pathname.endsWith('/game.html')
      ? './game.html'
      : './index.html';

    event.respondWith(
      fetch(event.request, {cache:'no-cache'})
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, copy));
          }
          return response;
        })
        .catch(() => caches.match(cacheKey).then(response =>
          response || caches.match('./index.html')
        ))
    );
    return;
  }

  // 画像・JSONなどは保存済みファイルを優先
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// アプリから更新指示を受け取ったときだけ切り替える
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
