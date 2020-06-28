import React from 'react'
import ReactDOM from 'react-dom'
import Form from './Form'

const wrapper = document.getElementById('container')
if (wrapper) {
  ReactDOM.render(<Form />, wrapper)
}
