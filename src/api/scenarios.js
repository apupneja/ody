import { post } from './client.js';

export function createScenario(params = {}) {
  const body = params.scenarioType ? params : { scenarioType: 'ww2' };
  return post('/scenarios', body);
}
