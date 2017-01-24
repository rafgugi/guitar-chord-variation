React = require 'react'
dom = React.createElement
Guitar = require './Guitar'
music = require '../music'

Main = React.createClass
  displayName: 'Main'

  getInitialState: ->
    chord: [] # current chord
    tuning: [4, 9, 2, 7, 11, 4] # current tuning
    advanced: false

  componentDidMount: ->
    @easyChord()
    @resetTuning()

  # inputs dom
  chordRoot: null
  chordVariation: null
  manualChord: null
  manualTuning: null

  handleManualChordChange: (e) ->
    @setState
      chord: music.predictNotes(e.target.value)

  handleManualTuningChange: (e) ->
    tuning = music.predictNotes(e.target.value)
    if tuning.length == 6
      @setState
        tuning: tuning

  handleAdvancedChange: (e) ->
    @setState
      advanced: e.target.checked

  handleResetButton: ->
    @state.tuning = [4, 9, 2, 7, 11, 4]
    @resetTuning()
    @easyChord()

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

  resetTuning: ->
    manualTuning = for note in @state.tuning
      music.notes[note]
    @manualTuning.value = manualTuning.join(' ')

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

        dom 'label', {},
          dom 'input', type: 'checkbox', onChange: @handleAdvancedChange
          dom 'span', className: 'label-body', 'Advanced mode'

        dom 'div', className: "#{if @state.advanced then '' else 'u-hide'}",
          # Manual chord input
          dom 'label', {}, 'Manual chord'
          dom 'input',
            type: 'text'
            className: 'u-full-width'
            placeholder: 'try C E G B'
            ref: (input) => @manualChord = input
            onChange: @handleManualChordChange

          # Manual tuning input
          dom 'label', {}, 'Manual tuning'
          dom 'input',
            type: 'text'
            className: 'u-full-width'
            placeholder: 'E A D G B E'
            ref: (input) => @manualTuning = input
            onChange: @handleManualTuningChange
            onBlur: @resetTuning

          dom 'div', {},
            dom 'button',
              type: 'button'
              className: 'button'
              onClick: @handleResetButton
              'Reset'
            # dom 'i', {}, ' '
            # dom 'button',
            #   type: 'button'
            #   className: 'button-primary'
            #   'Play'

      # Guitar
      dom 'span', className: 'col',
        dom Guitar, chord: @state.chord, tuning: @state.tuning

module.exports = Main