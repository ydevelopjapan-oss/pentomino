
const CACHE_NAME = 'pentomino-v4';

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

// 古いバージョンのキャッシュを整理
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

// 保存済みファイルを優先して読み込む
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(response => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
