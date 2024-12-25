import * as Tone from "tone";
import music from "./music";

class Speaker {
  synth: Tone.Synth;
  polySynth: Tone.PolySynth;

  constructor() {
    this.synth = new Tone.Synth().toDestination();
    this.polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
  }

  toot(tone: string, octave: number = 4, duration: string = "4n"): void {
    const note = `${tone}${octave}`;
    console.log("playing: ", note);
    this.synth.triggerAttackRelease(note, duration);
  }

  playNotes(active: (number | null)[], tuning: number[], tuningOctave: number[], duration: string = "2n"): void {
    const notes = tuning
      .map((tune, i) => {
        if (active[i] === null) {
          return null;
        }
        const octave = Math.floor(tuningOctave[i] + (tune + active[i]) / 12);
        return music.notes[(tune + active[i]) % 12] + octave;
      })
      .filter((fret) => fret !== null);
    console.log("playing: ", notes);
    this.polySynth.triggerAttackRelease(notes, duration);
  }
}

export default new Speaker();
