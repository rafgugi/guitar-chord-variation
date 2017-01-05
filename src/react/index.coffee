React = require 'react'
ReactDOM = require 'react-dom'
dom = React.createElement
Main = require './components/Main'

ReactDOM.render(
  dom Main
  document.getElementsByTagName('main')[0]
)