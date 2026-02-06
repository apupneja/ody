import { post } from './client.js';

export function createScenario() {
  return post('/scenarios', { scenarioType: 'ww2' });
}
