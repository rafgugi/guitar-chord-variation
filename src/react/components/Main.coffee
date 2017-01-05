React = require 'react'
dom = React.createElement
Guitar = require './Guitar'
music = require '../music'

Main = React.createClass
  displayName: 'Main'

  getInitialState: ->
    chord: [] # current chord

  componentDidMount: ->
    @easyChord()

  # inputs dom
  chordRoot: null
  chordVariation: null
  manualChord: null

  # Get chord root and chord variation, then generate
  # chord from them
  easyChord: ->
    root = Number(@chordRoot.value)
    variation = @chordVariation.value

    # Get chord array
    chord = music.generateChord(root, variation)
    @setState
      chord: chord

    # Create chord text
    manualChord = for note in chord
      music.notes[note]
    @manualChord.value = manualChord.join(' ')

  handleManualChordChange: (e) ->
    @setState
      chord: music.predictNotes(e.target.value)

  render: ->
    dom 'section', className: 'row',
      dom 'span', className: 'col inputs',

        # Chord root input
        dom 'label', {}, 'Chord root'
        dom 'select',
          className: 'u-full-width'
          ref: (input) => @chordRoot = input
          onChange: @easyChord
          for note, i in music.notes
            dom 'option', key: i, value: i, note

        # Chord variation input
        dom 'label', {}, 'Chord variation'
        dom 'select',
          className: 'u-full-width'
          ref: (input) => @chordVariation = input
          onChange: @easyChord
          for chord, i in music.chords
            dom 'option', key: i, value: i, chord.text
        dom 'hr'

        # Manual chord input
        dom 'label', {}, 'Manual chord'
        dom 'input',
          type: 'text'
          className: 'u-full-width'
          placeholder: 'try C E G B'
          ref: (input) => @manualChord = input
          onChange: @handleManualChordChange

      # Guitar
      dom 'span', className: 'col',
        dom Guitar, chord: @state.chord

module.exports = Main