import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { hydratePersistentMemoryCache } from './utils/persistentStore';
import { validateAndWarmMediaFromPersistedData } from './utils/imageUpload';

async function bootstrapPortalCache(): Promise<void> {
  try {
    await hydratePersistentMemoryCache();
    await validateAndWarmMediaFromPersistedData();
  } catch {
    // Non-fatal; components still hydrate normally via async persistentStore
  }
}

async function mountApp() {
  // Pre-hydrate IndexedDB datasets + integrity-verified image cache before first paint
  // (bounded to 180ms so slow storage never blocks startup)
  await Promise.race([
    bootstrapPortalCache(),
    new Promise<void>((resolve) => setTimeout(resolve, 180)),
  ]);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

void mountApp();
