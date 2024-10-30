import React, { useState, useEffect, useRef } from 'react';
import Guitar from './Guitar';
import music from '../music';

const notes = music.notes;

interface MainState {
  chord: number[];
  tuning: number[];
  active: number[];
  advanced: boolean;
}

const Main: React.FC = () => {
  const [state, setState] = useState<MainState>({
    chord: [],
    tuning: [],
    active: [],
    advanced: false,
  });

  const chordRoot = useRef<HTMLSelectElement>(null);
  const chordVariation = useRef<HTMLSelectElement>(null);
  const manualChord = useRef<HTMLInputElement>(null);
  const manualTuning = useRef<HTMLInputElement>(null);

  useEffect(() => {
    music.on('chord', () => {
      setState((prevState) => ({ ...prevState, chord: music.chord }));
    });
    music.on('tuning', () => {
      setState((prevState) => ({ ...prevState, tuning: music.tuning }));
      resetTuning();
    });
    music.on('active', () => {
      setState((prevState) => ({ ...prevState, active: music.active }));
    });

    music.setTuning(music.defaultTuning);
    easyChord();
    resetTuning();
  }, []);

  const handleManualChordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    music.setChord(music.predictNotes(e.target.value));
  };

  const handleManualTuningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tuning = music.predictNotes(e.target.value);
    if (tuning.length === 6) {
      music.setTuning(tuning);
    }
  };

  const handleAdvancedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => ({ ...prevState, advanced: e.target.checked }));
  };

  const handleResetButton = () => {
    music.setTuning(music.defaultTuning);
    easyChord();
    music.resetActive();
  };

  const handlePlayButton = () => {
    music.playActive();
  };

  const easyChord = () => {
    const root = Number(chordRoot.current?.value);
    const variation = Number(chordVariation.current?.value);

    const chord = music.generateChord(root, variation);
    music.setChord(chord);

    const manualChordValue = chord.map((note) => notes[note]);
    if (manualChord.current) {
      manualChord.current.value = manualChordValue.join(' ');
    }
  };

  const resetTuning = () => {
    const manualTuningValue = state.tuning.map((note) => notes[note]);
    if (manualTuning.current) {
      manualTuning.current.value = manualTuningValue.join(' ');
    }
  };

  return (
    <section className="row">
      <span className="col inputs">
        <label>Chord root</label>
        <select
          className="u-full-width"
          ref={chordRoot}
          onChange={easyChord}
        >
          {notes.map((note, i) => (
            <option key={i} value={i}>
              {note}
            </option>
          ))}
        </select>

        <label>Chord variation</label>
        <select
          className="u-full-width"
          ref={chordVariation}
          onChange={easyChord}
        >
          {music.chords.map((chord, i) => (
            <option key={i} value={i}>
              {chord.text}
            </option>
          ))}
        </select>

        <label>
          <input type="checkbox" onChange={handleAdvancedChange} />
          <span className="label-body">Advanced mode</span>
        </label>

        <div className={state.advanced ? '' : 'u-hide'}>
          <label>Manual chord</label>
          <input
            type="text"
            className="u-full-width"
            placeholder="try C E G B"
            ref={manualChord}
            onChange={handleManualChordChange}
          />

          <label>Manual tuning</label>
          <input
            type="text"
            className="u-full-width"
            placeholder="try E A D G B E"
            ref={manualTuning}
            onChange={handleManualTuningChange}
            onBlur={resetTuning}
          />

          <div>
            <button type="button" className="button" onClick={handleResetButton}>
              Reset
            </button>
            <i> </i>
            <button type="button" className="button-primary" onClick={handlePlayButton}>
              Play
            </button>
          </div>
        </div>
      </span>

      <span className="col">
        <Guitar
          chord={state.chord}
          tuning={state.tuning}
          active={state.active}
        />
      </span>
    </section>
  );
};

export default Main;
