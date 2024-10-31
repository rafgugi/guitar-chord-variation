import React, { useState, useEffect, useRef } from "react";
import Guitar from "./Guitar";
import music from "../music";

const notes = music.notes;

const Main: React.FC = () => {
  const [chord, setChord] = useState<number[]>(music.chords[0].chord);
  const [tuning, setTuning] = useState<number[]>(music.defaultTuning);
  const [tuningOctave, setTuningOctave] = useState<number[]>(
    music.defaultTuning,
  );
  const [active, setActive] = useState<number[]>([]);
  const [advanced, setAdvanced] = useState<boolean>(false);

  const chordRoot = useRef<HTMLSelectElement>(null);
  const chordVariation = useRef<HTMLSelectElement>(null);
  const manualChord = useRef<HTMLInputElement>(null);
  const manualTuning = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let tuningOctave = [3]; // first tuning octave
    for (let i = 1; i < tuning.length; i++) {
      tuningOctave.push(
        tuningOctave[i - 1] + (tuning[i - 1] >= tuning[i] ? 1 : 0),
      );
    }
    if (active.length !== 0) {
      initActive();
    }
    setTuningOctave(tuningOctave);
  }, [tuning]);

  const handleManualChordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChord = music.predictNotes(e.target.value);
    setChord(newChord);
    if (active.length !== 0) {
      initActive();
    }
  };

  const handleManualTuningChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTuning = music.predictNotes(e.target.value);
      setTuning(newTuning);
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
    let currentActive = active;
    if (currentActive.length === 0) {
      currentActive = initActive();
    }
    music.playNotes(currentActive, tuning, tuningOctave);
  };

  const initActive = (): number[] => {
    let active: number[] = [];
    for (const [, tune] of tuning.entries()) {
      for (let fret = 0; fret <= music.fret; fret++) {
        if (chord.includes((fret + tune) % 12)) {
          active.push(fret);
          break;
        }
      }
    }
    setActive(active);
    return active;
  };

  const easyChord = () => {
    const root = Number(chordRoot.current?.value);
    const variation = Number(chordVariation.current?.value);

    const newChord = music.generateChord(root, variation);
    setChord(newChord);

    const manualChordValue = newChord.map((note) => notes[note]);
    if (manualChord.current) {
      manualChord.current.value = manualChordValue.join(" ");
    }
  };

  const resetTuning = () => {
    const manualTuningValue = tuning.map((note) => notes[note]);
    if (manualTuning.current) {
      manualTuning.current.value = manualTuningValue.join(" ");
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
            <option
              key={i}
              value={i}
            >
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
            <option
              key={i}
              value={i}
            >
              {chord.text}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            onChange={handleAdvancedChange}
          />
          <span className="label-body">Advanced mode</span>
        </label>

        <div className={advanced ? "" : "u-hide"}>
          <label>Manual tuning</label>
          <input
            type="text"
            className="u-full-width"
            placeholder="E A D G B E"
            ref={manualTuning}
            onChange={handleManualTuningChange}
            onBlur={resetTuning}
          />

          <label>Manual chord</label>
          <input
            type="text"
            className="u-full-width"
            placeholder="try C E G B"
            ref={manualChord}
            onChange={handleManualChordChange}
          />

          <div>
            <button
              type="button"
              className="button"
              onClick={handleResetButton}
            >
              Reset
            </button>
            <i> </i>
            <button
              type="button"
              className="button-primary"
              onClick={handlePlayButton}
            >
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
          tuningOctave={tuningOctave}
          setActive={setActive}
        />
      </span>
    </section>
  );
};

export default Main;
