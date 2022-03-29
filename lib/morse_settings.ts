import { StatsEvent } from '@aws-sdk/client-s3';
import createPersistedState from 'use-persisted-state';
import Game, { GameSettings } from './head_copy/game';

const morseSettingsState = createPersistedState('morseSettings');

const MINIMUM_WPM = 5;
const MINIMUM_FREQ = 400;
const MAXIMUM_FREQ = 1200;
const MINIMUM_PREDELAY = 100;
const MAXIMUM_PREDELAY = 2000;

export function getState(): [GameSettings, Function] {
    return morseSettingsState({
        wpm: 20,
        fwpm: 20,
        freq: 700,
        preDelay: 300,
    })
}

export function validate(morseSettings: GameSettings, set: Function): GameSettings {
    const newSettings = {...morseSettings}
    if (morseSettings.wpm < MINIMUM_WPM) {
      newSettings.wpm = MINIMUM_WPM
    } if (morseSettings.fwpm < MINIMUM_WPM) {
      newSettings.fwpm = MINIMUM_WPM
    }
    // Always lower farnsworth to wpm
    if (morseSettings.wpm < morseSettings.fwpm) {
      newSettings.fwpm = morseSettings.wpm
    }

    if (morseSettings.freq > MAXIMUM_FREQ) {morseSettings.freq = MAXIMUM_FREQ}
    if (morseSettings.freq < MINIMUM_FREQ) {morseSettings.freq = MINIMUM_FREQ}
    if (morseSettings.preDelay > MAXIMUM_PREDELAY) {morseSettings.preDelay = MAXIMUM_PREDELAY}
    if (morseSettings.preDelay < MINIMUM_PREDELAY) {morseSettings.preDelay = MINIMUM_PREDELAY}
    set(newSettings)
    return newSettings
  }
