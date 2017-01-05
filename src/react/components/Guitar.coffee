React = require 'react'
dom = React.createElement
{ notes } = require '../music'

# This component is a string per fret on guitar
Nylon = React.createClass
  displayName: 'Nylon'

  getDefaultProps: ->
    active: false # add dot if active is true

  render: ->
    dom 'div', className: 'string', title: notes[@props.note],
      if @props.active
        dom 'i', className: "dot color-#{@props.note}", title: notes[@props.note]


# Guitar has 3 components: Tunings, Zeroes (dot at fret-0) and Frets. 
Guitar = React.createClass
  displayName: 'Guitar'

  getDefaultProps: ->
    tuning: [4, 9, 2, 7, 11, 4] # default tuning is E A D G B E
    fret: 13 # number of frets
    fretHints: [0, 3, 5, 7, 9, 12, 15, 17] # fret index hints
    chord: [] # chords to be highlighted (dotted lol)

  render: ->
    tuning = @props.tuning
    chord = @props.chord
    dom 'div', className: 'guitar',
      # Tunings
      dom 'div', className: 'tunings',
        for tune, i in tuning
          dom 'div', key: i, className: "tuning color-#{tune}", notes[tune]
      # Dots at fret-0
      dom 'div', className: 'zeroes',
        for tune, i in tuning
          dom 'div', key: i, className: 'zero', title: notes[tune],
            if tune in chord
              dom 'i', className: "dot color-#{tune}", title: notes[tune]
      # Frets. Each has 6 strings (Nylon). If string match to one of the chords, 
      # set as active
      for fret in [0..@props.fret]
        dom 'div', key: fret, className: 'fret',
          if fret in @props.fretHints
            dom 'span', key: 'index', className: 'index', fret
          for tune, i in tuning
            note = (tune + fret + 1) % 12
            dom Nylon, key: i, note: note, active: note in chord

module.exports = Guitar