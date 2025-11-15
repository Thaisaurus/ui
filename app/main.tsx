import { domAnimation, LazyMotion } from 'motion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/styles/globals.css';
import App from '@/app/app';

createRoot(document.querySelector(`#root`)!).render(
  <StrictMode>
    <LazyMotion features={domAnimation}>
      <App />
    </LazyMotion>
  </StrictMode>,
);
