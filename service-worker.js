
const CACHE_NAME = 'pentomino-v8';

const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/app-icon.PNG',
  './assets/logo.PNG',
  './assets/board-texture.png',
  './assets/piece-texture.png'
];

// アプリに必要なファイルを保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 古いキャッシュを整理
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key =>
            key.startsWith('pentomino-') &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      );
    })
  );
});

// HTMLはネット優先、オフラインなら保存済みHTML
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put('./index.html', copy);
            });
          }

          return response;
        })
        .catch(() => {
          return caches.match('./index.html');
        })
    );
    return;
  }

  // 画像などは保存済みファイルを優先
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
