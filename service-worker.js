
const CACHE_NAME = 'pentomino-v7';

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

key))
      );
    })
  );
});

