import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { StateProvider } from './components/StateProvider'
import reducer, { initialState } from './reducers/authReducer'

let newInitialState = initialState

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={newInitialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
) 
