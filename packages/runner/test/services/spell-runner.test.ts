import app from '../../src/app';

describe('\'spellRunner\' service', () => {
  it('registered the service', () => {
    const service = app.service('spell-runner');
    expect(service).toBeTruthy();
  });
});
