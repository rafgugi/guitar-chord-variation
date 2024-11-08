import music from "./music";
import { describe, expect, test } from "vitest";

describe("predictNotes", () => {
  // TODO: learn about mol, not only sharp, such as C, E, G, Bb.
  test("should return correct note indices", () => {
    const text = "C D E A#";
    const expected = [0, 2, 4, 10];
    expect(music.predictNotes(text)).toEqual(expected);
  });

  test("should omit unknown note", () => {
    const text = "C D what E";
    const expected = [0, 2, 4];
    expect(music.predictNotes(text)).toEqual(expected);
  });
});

describe("getNotesNames", () => {
  test("should return correct note names", () => {
    const notes = [0, 2, 4];
    const expected = "C D E";
    expect(music.getNotesNames(notes)).toBe(expected);
  });
});

describe("getOctavesProgression", () => {
  test("should return correct octaves progression", () => {
    const notes = [0, 2, 4, 1, 3, 2, 1];
    const expected = [3, 3, 3, 4, 4, 5, 6];
    expect(music.getOctavesProgression(notes)).toEqual(expected);
  });
});

describe("generateChord", () => {
  test("should return correct chord notes", () => {
    const chordRoot = 0;
    const chordVariation = 0;
    const expected = [0, 4, 7];
    expect(music.generateChord(chordRoot, chordVariation)).toEqual(expected);
  });

  test("should return empty list when note out of bound", () => {
    const chordRoot = 322;
    const chordVariation = 0;
    const expected = [];
    expect(music.generateChord(chordRoot, chordVariation)).toEqual(expected);
  });

  test("should return empty list when chord out of bound", () => {
    const chordRoot = 0;
    const chordVariation = 322;
    const expected = [];
    expect(music.generateChord(chordRoot, chordVariation)).toEqual(expected);
  });
});

describe("getMinFretsForChord", () => {
  test("should return correct frets", () => {
    const tuning = [4, 9, 2, 7];
    const frets = 12;
    const chord = [0, 4, 7]; // C major chord
    const expected = [0, 3, 2, 0];
    expect(music.getMinFretsForChord(tuning, frets, chord)).toEqual(expected);
  });
});
