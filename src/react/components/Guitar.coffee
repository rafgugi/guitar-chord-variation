React = require 'react'
dom = React.createElement
music = require '../music'
notes = music.notes

# This is just a dot on a fret defining the tune.
Dot = React.createClass
  displayName: 'Dot'

  attack: ->
    music.toot(notes[@props.note], @props.octave)

  render: ->
    active = if @props.active then '' else '-muted'
    dom 'i',
      title: notes[@props.note]
      className: "dot fa fa-circle color-#{@props.note}#{active}"
      onClick: @attack


# This component is a string per fret on guitar
Nylon = React.createClass
  displayName: 'Nylon'

  getDefaultProps: ->
    dot: false # add dot if active is true
    zero: false # is this nylon is fret zero
    active: true

  attack: ->
    music.toot(notes[@props.note], @props.octave)

  render: ->
    dom 'div',
      className: if @props.zero then 'zero' else 'string'
      title: notes[@props.note]
      onClick: @attack
      if @props.dot
        dom Dot, @props


# Guitar has 3 components: Tunings, Zeroes (dot at fret-0) and Frets.
Guitar = React.createClass
  displayName: 'Guitar'

  getDefaultProps: ->
    firstTuningOctave: 3 # tuning octave at first string
    tuning: [4, 9, 2, 7, 11, 4] # default tuning is E A D G B E
    fret: 13 # number of frets
    fretHints: [0, 3, 5, 7, 9, 12, 15, 17] # fret index hints
    chord: [] # chords to be highlighted (dotted lol)

  render: ->
    tuning = @props.tuning
    chord = @props.chord
    tuningOctave = [@props.firstTuningOctave]

    dom 'div', className: 'guitar',
      # Tunings
      dom 'div', className: 'tunings',
        for tune, i in tuning
          dom 'div', key: i, className: "tuning color-#{tune}", notes[tune]
      # Nylon at fret-0
      dom 'div', className: 'zeroes',
        for tune, i in tuning
          if i > 0 # first tuning octave is predefined
            # otherwise define the current tuning octave
            tuningOctave.push(tuningOctave[i - 1] + (tuning[i - 1] >= tune))
          dom Nylon,
            key: i
            zero: true
            note: tune
            octave: tuningOctave[i]
            dot: tune in chord

      # Frets. Each has 6 strings (Nylon). If string match to one of note
      # the chords, set as active
      for fret in [0..@props.fret]
        dom 'div', key: fret, className: 'fret',
          if fret in @props.fretHints
            dom 'span', className: 'index', fret
          for tune, i in tuning
            note = (tune + fret + 1) % 12
            dom Nylon,
              key: i
              note: note
              octave: tuningOctave[i] + (tune + fret + 1) / 12 >> 0
              dot: note in chord

module.exports = Guitar