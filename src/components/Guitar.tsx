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

class Dot extends React.Component<DotProps> {
  attack = () => {
    music.toot(notes[this.props.note], this.props.octave);
    music.setActive(this.props.string, this.props.fret);
  };

  render() {
    const active = this.props.active ? '' : '-muted';
    return (
      <i
        title={notes[this.props.note]}
        className={`dot fa fa-circle color-${this.props.note}${active}`}
        onClick={this.attack}
      />
    );
  }
}

interface NylonProps {
  note: number;
  octave: number;
  string: number;
  fret: number;
  dot?: boolean;
  zero?: boolean;
  active?: boolean;
}

class Nylon extends React.Component<NylonProps> {
  static defaultProps = {
    dot: false,
    zero: false,
    active: true,
  };

  attack = () => {
    music.toot(notes[this.props.note], this.props.octave);
  };

  render() {
    return (
      <div
        className={this.props.zero ? 'zero' : 'string'}
        title={notes[this.props.note]}
        onClick={this.attack}
      >
        {this.props.dot && <Dot {...this.props} />}
      </div>
    );
  }
}

interface GuitarProps {
  firstTuningOctave?: number;
  tuning?: number[];
  fret?: number;
  fretHints?: number[];
  chord?: number[];
  active?: number[];
}

class Guitar extends React.Component<GuitarProps> {
  static defaultProps = {
    firstTuningOctave: 3,
    tuning: music.defaultTuning,
    fret: music.fret,
    fretHints: [0, 3, 5, 7, 9, 12, 15, 17],
    chord: [],
    active: [],
  };

  render() {
    const { tuning, chord, active } = this.props;
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
        {[...Array(this.props.fret + 1).keys()].slice(1).map((fret) => (
          <div key={fret} className="fret">
            {this.props.fretHints.includes(fret - 1) && (
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
  }
}

export default Guitar;
