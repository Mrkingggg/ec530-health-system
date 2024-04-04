import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import "./index.css"
const container = document.getElementById('root');
const root = createRoot(container); // 创建一个 root
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
