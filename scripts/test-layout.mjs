import React from 'react';
import ReactDOMServer from 'react-dom/server';

async function test() {
  try {
    const LayoutModule = await import('../src/app/layout.tsx');
    console.log('LayoutModule loaded successfully');
  } catch (err) {
    console.error('Layout import error:', err);
  }
}

test();
