window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {}
React = require 'react'
ReactDOM = require 'react-dom'
dom = React.createElement
Content = require './components/Content'

ReactDOM.render(
  dom 'section', {}, dom Content

  document.getElementById 'ng-app'
)