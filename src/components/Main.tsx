import React, { useState, useEffect, useRef } from "react";
import Guitar from "./Guitar";
import music from "../music";

const Main: React.FC = () => {
  const [chord, setChord] = useState<number[]>(music.chords[0].chord);
  const [frets] = useState<number>(13);
  const [fretHints] = useState<number[]>([0, 3, 5, 7, 9, 12, 15, 17]);
  const [tuning, setTuning] = useState<number[]>(music.defaultTuning);
  const [tuningOctave, setTuningOctave] = useState<number[]>(
    music.defaultTuning,
  );
  const [active, setActive] = useState<(number | null)[]>([]);
  const [advanced, setAdvanced] = useState<boolean>(false);

  const chordRoot = useRef<HTMLSelectElement>(null);
  const chordVariation = useRef<HTMLSelectElement>(null);
  const manualChord = useRef<HTMLInputElement>(null);
  const manualTuning = useRef<HTMLInputElement>(null);

  // useEffect hook to handle the tuningOctave
  useEffect(() => {
    setTuningOctave(music.getOctavesProgression(tuning));
  }, [tuning]);

  // useEffect hook to handle the active
  useEffect(() => {
    if (active.length !== 0) {
      initActive();
    }
  }, [tuning, chord]);

  // useEffect hook for initializations
  useEffect(() => {
    easyChord();
    resetTuning();
  }, []);

  const handleManualChordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChord = music.predictNotes(e.target.value);
    setChord(Array.from(new Set(newChord)));
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
      currentActive = music.getMinFretsForChord(tuning, frets, chord);
    }
    setActive(currentActive);
    music.playNotes(currentActive, tuning, tuningOctave);
  };

  const initActive = (): void => {
    let active = music.getMinFretsForChord(tuning, frets, chord);
    setActive(active);
  };

  const easyChord = () => {
    const root = Number(chordRoot.current?.value);
    const variation = Number(chordVariation.current?.value);

    const newChord = music.generateChord(root, variation);
    setChord(newChord);

    if (manualChord.current) {
      manualChord.current.value = music.getNotesNames(newChord);
    }
  };

  const resetChord = () => {
    if (manualChord.current) {
      manualChord.current.value = music.getNotesNames(chord);
    }
  };

  const resetTuning = () => {
    if (manualTuning.current) {
      manualTuning.current.value = music.getNotesNames(tuning);
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
          {music.notes.map((note, i) => (
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
            onBlur={resetChord}
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
          frets={frets}
          fretHints={fretHints}
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
