import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import App from './App'
import './index.css'
import { init } from '@rematch/core'
import {store} from './models'
import { Provider, connect } from 'react-redux'

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Provider store={store}>
  <App/>
</Provider>)