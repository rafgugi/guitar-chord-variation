React = require 'react'
dom = React.createElement

{ notes } = require '../music'

Nylon = React.createClass
  displayName: 'String'

  getDefaultProps: ->
    active: false
  
  render: ->
    dom 'div', className: 'string', title: notes[@props.note],
      if @props.active
        dom 'i', className: "fa fa-circle color-#{@props.note}", title: notes[@props.note]

Guitar = React.createClass
  displayName: 'Guitar'

  getDefaultProps: ->
    tuning: [4, 9, 2, 7, 11, 4]
    fret: 13
    chord: [0, 4, 7]
  
  render: ->
    tuning = @props.tuning
    chord = @props.chord
    dom 'div', className: 'guitar',
      dom 'div', className: 'tunings',
        for tune, i in tuning
          dom 'div', key: i, className: "tuning color-#{tune}", notes[tune]
      dom 'div', className: 'zeroes',
        for tune, i in tuning
          dom 'div', key: i, className: 'zero', 
            if tune in chord
              dom 'i', className: "fa fa-circle color-#{tune}"
      for fret in [0..@props.fret]
        dom 'div', key: fret, className: 'fret',
          if fret % 2 is 0
            dom 'span', key: 'index', className: 'index', fret
          for j in [0..5]
            note = (tuning[j] + fret + 1) % 12
            dom Nylon, key: j, note: note, active: note in chord

module.exports = Guitar