import React, { Dispatch, SetStateAction } from "react";
import music from "../music";

const notes = music.notes;

interface DotProps {
  note: number;
  octave: number;
  string: number;
  fret: number;
  isActive: boolean;
  setActive: Dispatch<SetStateAction<(number | null)[]>>;
}

const Dot: React.FC<DotProps> = ({
  note,
  octave,
  string,
  fret,
  isActive,
  setActive,
}) => {
  const attack = () => {
    music.toot(notes[note], octave);
    setActive((prevActive) =>
      prevActive.map((value, index) =>
        index === string ? (value === fret ? null : fret) : value,
    ),
    );
  };

  const activeClass = isActive ? "" : "-muted";

  return (
    <i
      title={notes[note]}
      className={`dot fa fa-circle color-${note}${activeClass}`}
      onClick={attack}
    />
  );
};

interface NylonProps {
  note: number;
  octave: number;
  string: number;
  fret: number;
  dot?: boolean;
  zero?: boolean;
  isActive?: boolean;
  setActive: Dispatch<SetStateAction<(number | null)[]>>;
}

const Nylon: React.FC<NylonProps> = ({
  note,
  octave,
  string,
  fret,
  dot = false,
  zero = false,
  isActive = true,
  setActive,
}) => {
  const attack = () => {
    music.toot(notes[note], octave);
  };

  return (
    <div
      className={zero ? "zero" : "string"}
      title={notes[note]}
      onClick={attack}
    >
      {dot && (
        <Dot
          note={note}
          octave={octave}
          string={string}
          fret={fret}
          isActive={isActive}
          setActive={setActive}
        />
      )}
    </div>
  );
};

interface GuitarProps {
  tuning: number[];
  frets: number;
  fretHints?: number[];
  chord: number[];
  tuningOctave: number[];
  active?: (number | null)[];
  setActive: Dispatch<SetStateAction<(number | null)[]>>;
}

const Guitar: React.FC<GuitarProps> = ({
  tuning,
  frets,
  fretHints = [0, 3, 5, 7, 9, 12, 15, 17],
  chord = [],
  active = [],
  tuningOctave = [],
  setActive,
}) => {
  const noactive = active.length === 0;

  return (
    <div className="guitar">
      <div className="tunings">
        {tuning.map((tune, i) => (
          <div
            key={i}
            className={`tuning color-${tune}`}
          >
            {notes[tune]}
          </div>
        ))}
      </div>
      <div className="zeroes">
        {tuning.map((tune, i) => (
          <Nylon
            key={i}
            string={i}
            fret={0}
            zero={true}
            note={tune}
            octave={tuningOctave[i]}
            dot={chord.includes(tune)}
            isActive={noactive || active[i] === 0}
            setActive={setActive}
          />
        ))}
      </div>
      {[...Array(frets + 1).keys()].slice(1).map((fret) => (
        <div
          key={fret}
          className="fret"
        >
          {fretHints.includes(fret - 1) && (
            <span className="index">{fret - 1}</span>
          )}
          {tuning.map((tune, i) => {
            const note = (tune + fret) % 12;
            return (
              <Nylon
                key={i}
                string={i}
                fret={fret}
                note={note}
                octave={tuningOctave[i] + Math.floor((tune + fret) / 12)}
                dot={chord.includes(note)}
                isActive={noactive || active[i] === fret}
                setActive={setActive}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Guitar;
