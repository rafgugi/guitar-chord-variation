import React, { useState, useEffect, useRef } from 'react';
import Guitar from './Guitar';
import music from '../music';

const notes = music.notes;

const Main: React.FC = () => {
  const [chord, setChord] = useState<number[]>([]);
  const [tuning, setTuning] = useState<number[]>(music.defaultTuning);
  const [active, setActive] = useState<number[]>([]);
  const [advanced, setAdvanced] = useState<boolean>(false);

  const chordRoot = useRef<HTMLSelectElement>(null);
  const chordVariation = useRef<HTMLSelectElement>(null);
  const manualChord = useRef<HTMLInputElement>(null);
  const manualTuning = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resetTuning();
    easyChord();
  }, []);

  const handleManualChordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChord = music.predictNotes(e.target.value);
    setChord(newChord);
  };

  const handleManualTuningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTuning = music.predictNotes(e.target.value);
    if (newTuning.length === 6) {
      setTuning(newTuning);
    }
  };

  const handleAdvancedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdvanced(e.target.checked);
  };

  const handleResetButton = () => {
    setTuning(music.defaultTuning);
    easyChord();
    setActive([]);
  };

  const handlePlayButton = () => {
    music.playNotes(active.map((fret, string) => notes[(tuning[string] + fret) % 12]));
  };

  const easyChord = () => {
    const root = Number(chordRoot.current?.value);
    const variation = Number(chordVariation.current?.value);

    const newChord = music.generateChord(root, variation);
    setChord(newChord);

    const manualChordValue = newChord.map((note) => notes[note]);
    if (manualChord.current) {
      manualChord.current.value = manualChordValue.join(' ');
    }
  };

  const resetTuning = () => {
    const manualTuningValue = tuning.map((note) => notes[note]);
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

        <div className={advanced ? '' : 'u-hide'}>
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
            placeholder="E A D G B E"
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
          chord={chord}
          tuning={tuning}
          active={active}
        />
      </span>
    </section>
  );
};

export default Main;
