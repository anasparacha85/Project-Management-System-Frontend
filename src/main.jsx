import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { Provider } from 'react-redux'
import store, { persistor } from './store/Store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { SocketProvider } from './Contexts/notificationcontext.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <BrowserRouter>
  <Provider store={store}>
  <PersistGate persistor={persistor} loading={null}>
  <SocketProvider >
    <App />
    </SocketProvider>
    </PersistGate>
    </Provider>
    </BrowserRouter>,
  // </StrictMode>,
)
