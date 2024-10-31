import * as Tone from "tone";

class Music {
  synth: Tone.Synth;
  polySynth: Tone.PolySynth;
  notes: string[];
  chords: { text: string; chord: number[] }[];
  defaultTuning: number[];
  fret: number;

  constructor() {
    this.synth = new Tone.Synth().toDestination();
    this.polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.notes = [
      "C", // 0
      "C#", // 1
      "D", // 2
      "D#", // 3
      "E", // 4
      "F", // 5
      "F#", // 6
      "G", // 7
      "G#", // 8
      "A", // 9
      "A#", // 10
      "B", // 11
    ];
    this.chords = [
      { text: "maj", chord: [0, 4, 7] }, // C E G
      { text: "maj7", chord: [0, 4, 7, 11] }, // C E G B
      { text: "7", chord: [0, 4, 7, 10] }, // C E G Bb
      { text: "min", chord: [0, 3, 7] }, // C Eb G
      { text: "min7", chord: [0, 3, 7, 10] }, // C Eb G Bb
      { text: "aug", chord: [0, 4, 8] }, // C E G#
      { text: "aug7", chord: [0, 4, 8, 10] }, // C E G# Bb
      { text: "dim", chord: [0, 3, 6] }, // C Eb Gb
      { text: "dim7", chord: [0, 3, 6, 9] }, // C Eb Gb Bbb
      { text: "sus", chord: [0, 5, 7] }, // C F G
    ];
    this.defaultTuning = [4, 9, 2, 7, 11, 4]; // E A D G B E
    this.fret = 13;
  }

  predictNotes(text: string): number[] {
    const result: number[] = [];
    for (const note of text.split(" ")) {
      const predicted = this.notes.indexOf(note);
      if (predicted > -1) {
        result.push(predicted);
      }
    }
    return result;
  }

  generateChord(chordRoot: number, chordVariation: number): number[] {
    return this.chords[chordVariation].chord.map(
      (interval) => (chordRoot + interval) % 12,
    );
  }

  toot(tone: string, octave: number = 4, duration: string = "4n"): void {
    this.synth.triggerAttackRelease(`${tone}${octave}`, duration);
  }

  playNotes(active: number[], tuning: number[], tuningOctave: number[]): void {
    const notes: string[] = [];
    for (const [i, tune] of tuning.entries()) {
      const octave = (tuningOctave[i] + (tune + active[i]) / 12) >> 0;
      notes.push(this.notes[(tune + active[i]) % 12] + octave);
    }
    console.log("playing: ", notes);
    this.polySynth.triggerAttackRelease(notes, "2n");
  }
}

export default new Music();
