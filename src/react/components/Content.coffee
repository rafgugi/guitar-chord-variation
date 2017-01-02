React = require 'react'
dom = React.createElement
Guitar = require './Guitar'

Content = React.createClass
  displayName: 'Content'

  getInitialState: ->
    active: false
  
  render: ->
    dom Guitar

module.exports = Content