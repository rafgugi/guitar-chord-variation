React = require 'react'
dom = React.createElement
Guitar = require './Guitar'
music = require '../music'

Main = React.createClass
  displayName: 'Main'

  getInitialState: ->
    active: false
    chord: []

  componentDidMount: ->
    @easyChord()
    
  easyChord: ->
    root = Number(@chordRoot.value)
    chord = []
    manualChord = []
    for interval in music.chords[@chordVariation.value].chord
      note = (root + interval) % 12
      chord.push(note)
      manualChord.push(music.notes[note])
    @manualChord.value = manualChord.join(' ')
    @setState 
      chord: chord

  handleManualChordChange: (e) ->
    @setState
      chord: music.predictNotes(e.target.value)

  render: ->
    dom 'div', style: display: 'table',
      dom 'span', style: float: 'left', marginRight: '20px', width: '240px',
        dom 'label', {}, 'Chord Root'
        dom 'select',
          className: 'u-full-width'
          ref: (input) => @chordRoot = input
          onChange: @easyChord
          for note, i in music.notes
            dom 'option', key: i, value: i, note
        dom 'label', {}, 'Chord Variation'
        dom 'select',
          className: 'u-full-width'
          ref: (input) => @chordVariation = input
          onChange: @easyChord
          for chord, i in music.chords
            dom 'option', key: i, value: i, chord.text
        dom 'hr'
        dom 'label', {}, 'Manual Chord'
        dom 'input',
          type: 'text'
          className: 'u-full-width'
          placeholder: 'try C E G B'
          ref: (input) => @manualChord = input
          onChange: @handleManualChordChange
      dom 'span', style: float: 'left',
        dom Guitar, chord: @state.chord

module.exports = Main