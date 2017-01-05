class Music
  notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

  chords: [
    { text: 'maj', chord: [0, 4, 7] }
    { text: 'maj7', chord: [0, 4, 7, 11] }
    { text: '7', chord: [0, 4, 7, 10] }
    { text: 'min', chord: [0, 3, 7] }
    { text: 'min7', chord: [0, 3, 7, 10] }
    { text: 'aug', chord: [0, 4, 8] }
    { text: 'aug7', chord: [0, 4, 8, 11] }
    { text: 'dim', chord: [0, 3, 6] }
    { text: 'dim7', chord: [0, 3, 6, 9] }
    { text: 'sus', chord: [0, 5, 7] }
  ]

  # Convert string of notes to array of numbered notes.
  # example: 'C G E' become [0, 4, 7]
  predictNotes: (text) ->
    for note in text.split(' ')
      predicted = @notes.indexOf note
      predicted if predicted > -1

  # Generate chord (array of note) from given chord root and
  # chord variation.
  # example of A minor: -> (9, 3) become [9, 0, 4]
  generateChord: (chordRoot, chordVariation) ->
    for interval in @chords[chordVariation].chord
      (chordRoot + interval) % 12

module.exports = new Music