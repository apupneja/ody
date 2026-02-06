import { post } from './client.js';

export function parseVoice(transcript) {
  return post('/voice-command', { transcript });
}
