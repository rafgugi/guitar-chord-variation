window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {}
React = require 'react'
ReactDOM = require 'react-dom'
dom = React.createElement
Main = require './components/Main'

ReactDOM.render(
  dom Main
  document.getElementById 'ng-app'
)