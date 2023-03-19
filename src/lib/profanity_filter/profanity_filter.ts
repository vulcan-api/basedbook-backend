import * as leoProfanity from 'leo-profanity';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as pl from './dictionaries/pl_PL.json';

export function filterProfanity(text: string): string {
  leoProfanity.add(pl);
  return leoProfanity.clean(text);
}
