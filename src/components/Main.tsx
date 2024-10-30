import React, { Component, createRef } from 'react';
import Guitar from './Guitar';
import music from '../music';

interface MainState {
  chord: number[];
  tuning: number[];
  active: number[];
  advanced: boolean;
}

class Main extends Component<{}, MainState> {
  chordRoot = createRef<HTMLSelectElement>();
  chordVariation = createRef<HTMLSelectElement>();
  manualChord = createRef<HTMLInputElement>();
  manualTuning = createRef<HTMLInputElement>();

  state: MainState = {
    chord: [],
    tuning: [],
    active: [],
    advanced: false,
  };

  componentWillMount() {
    music.on('chord', () => {
      this.setState({ chord: music.chord });
    });
    music.on('tuning', () => {
      this.setState({ tuning: music.tuning });
      this.resetTuning();
    });
    music.on('active', () => {
      this.setState({ active: music.active });
    });
  }

  componentDidMount() {
    music.setTuning(music.defaultTuning);
    this.easyChord();
    this.resetTuning();
  }

  handleManualChordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    music.setChord(music.predictNotes(e.target.value));
  };

  handleManualTuningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tuning = music.predictNotes(e.target.value);
    if (tuning.length === 6) {
      music.setTuning(tuning);
    }
  };

  handleAdvancedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ advanced: e.target.checked });
  };

  handleResetButton = () => {
    music.setTuning(music.defaultTuning);
    this.easyChord();
    music.resetActive();
  };

  handlePlayButton = () => {
    music.playActive();
  };

  easyChord = () => {
    const root = Number(this.chordRoot.current?.value);
    const variation = Number(this.chordVariation.current?.value);

    const chord = music.generateChord(root, variation);
    music.setChord(chord);

    const manualChord = chord.map(note => music.notes[note]);
    if (this.manualChord.current) {
      this.manualChord.current.value = manualChord.join(' ');
    }
  };

  resetTuning = () => {
    const manualTuning = this.state.tuning.map(note => music.notes[note]);
    if (this.manualTuning.current) {
      this.manualTuning.current.value = manualTuning.join(' ');
    }
  };

  render() {
    return (
      <section className="row">
        <span className="col inputs">
          <label>Chord root</label>
          <select
            className="u-full-width"
            ref={this.chordRoot}
            onChange={this.easyChord}
          >
            {music.notes.map((note, i) => (
              <option key={i} value={i}>
                {note}
              </option>
            ))}
          </select>

          <label>Chord variation</label>
          <select
            className="u-full-width"
            ref={this.chordVariation}
            onChange={this.easyChord}
          >
            {music.chords.map((chord, i) => (
              <option key={i} value={i}>
                {chord.text}
              </option>
            ))}
          </select>

          <label>
            <input type="checkbox" onChange={this.handleAdvancedChange} />
            <span className="label-body">Advanced mode</span>
          </label>

          <div className={this.state.advanced ? '' : 'u-hide'}>
            <label>Manual chord</label>
            <input
              type="text"
              className="u-full-width"
              placeholder="try C E G B"
              ref={this.manualChord}
              onChange={this.handleManualChordChange}
            />

            <label>Manual tuning</label>
            <input
              type="text"
              className="u-full-width"
              placeholder="E A D G B E"
              ref={this.manualTuning}
              onChange={this.handleManualTuningChange}
              onBlur={this.resetTuning}
            />

            <div>
              <button type="button" className="button" onClick={this.handleResetButton}>
                Reset
              </button>
              <i> </i>
              <button type="button" className="button-primary" onClick={this.handlePlayButton}>
                Play
              </button>
            </div>
          </div>
        </span>

        <span className="col">
          <Guitar
            chord={this.state.chord}
            tuning={this.state.tuning}
            active={this.state.active}
          />
        </span>
      </section>
    );
  }
}

export default Main;
