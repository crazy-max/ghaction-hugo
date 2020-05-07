import * as github from '../src/github';

describe('github', () => {
  it('returns latest Hugo GitHub release', async () => {
    const release = await github.getRelease('latest');
    console.log(release);
    expect(release).not.toBeNull();
    expect(release?.tag_name).not.toEqual('');
  });

  it('returns v0.58.3 Hugo GitHub release', async () => {
    const release = await github.getRelease('v0.58.3');
    console.log(release);
    expect(release).not.toBeNull();
    expect(release?.tag_name).toEqual('v0.58.3');
  });
});
