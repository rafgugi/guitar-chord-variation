import React from 'react';
import music from '../music';

const notes = music.notes;

interface DotProps {
  note: number;
  octave: number;
  string: number;
  fret: number;
  active: boolean;
}

const Dot: React.FC<DotProps> = ({ note, octave, string, fret, active }) => {
  const attack = () => {
    music.toot(notes[note], octave);
    music.setActive(string, fret);
  };

  const activeClass = active ? '' : '-muted';

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
  active?: boolean;
}

const Nylon: React.FC<NylonProps> = ({ note, octave, string, fret, dot = false, zero = false, active = true }) => {
  const attack = () => {
    music.toot(notes[note], octave);
  };

  return (
    <div
      className={zero ? 'zero' : 'string'}
      title={notes[note]}
      onClick={attack}
    >
      {dot && <Dot note={note} octave={octave} string={string} fret={fret} active={active} />}
    </div>
  );
};

interface GuitarProps {
  firstTuningOctave?: number;
  tuning?: number[];
  fret?: number;
  fretHints?: number[];
  chord?: number[];
  active?: number[];
}

const Guitar: React.FC<GuitarProps> = ({
  firstTuningOctave = 3,
  tuning = music.defaultTuning,
  fret = music.fret,
  fretHints = [0, 3, 5, 7, 9, 12, 15, 17],
  chord = [],
  active = [],
}) => {
  const tuningOctave = music.tuningOctave;
  const noactive = active.length === 0;

  return (
    <div className="guitar">
      <div className="tunings">
        {tuning.map((tune, i) => (
          <div key={i} className={`tuning color-${tune}`}>
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
            active={noactive || active[i] === 0}
          />
        ))}
      </div>
      {[...Array(fret + 1).keys()].slice(1).map((fret) => (
        <div key={fret} className="fret">
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
                active={noactive || active[i] === fret}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Guitar;
