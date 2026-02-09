import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Approutes from 'routes.js';
import { CarrinhoProvider } from 'Components/carrinhocontext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CarrinhoProvider>
      <Approutes />
    </CarrinhoProvider>
  </React.StrictMode>
);








