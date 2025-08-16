import React from 'react'
import ReactDOM from 'react-dom/client'
// react-router-dom에서 BrowserRouter를 가져옵니다.
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
