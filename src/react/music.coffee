class Music
  notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

  chords: [
    { text: 'maj', chord: [0, 4, 7] }
    { text: 'maj7', chord: [0, 4, 7, 11] }
    { text: '7', chord: [0, 4, 7, 10] }
    { text: 'min', chord: [0, 3, 7] }
    { text: 'min7', chord: [0, 3, 7, 10] }
    { text: 'sus', chord: [0, 5, 7] }
  ]

  predictNotes: (text) ->
    ans = []
    for note in text.split(' ')
      predicted = @notes.indexOf note
      if predicted > -1
        ans.push(predicted)
    ans

module.exports = new Music