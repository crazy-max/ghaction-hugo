import {describe, expect, it} from '@jest/globals';
import * as fs from 'fs';
import * as installer from '../src/installer';

describe('getRelease', () => {
  it('returns latest hugo GitHub release', async () => {
    const release = await installer.getRelease('latest');
    expect(release).not.toBeNull();
    expect(release?.tag_name).not.toEqual('');
  });

  it('returns v0.104.2 hugo GitHub release', async () => {
    const release = await installer.getRelease('v0.104.2');
    expect(release).not.toBeNull();
    expect(release?.id).toEqual(78557952);
    expect(release?.tag_name).toEqual('v0.104.2');
    expect(release?.html_url).toEqual('https://github.com/gohugoio/hugo/releases/tag/v0.104.2');
  });

  it('unknown release', async () => {
    await expect(installer.getRelease('foo')).rejects.toThrowError(
      new Error(
        'Cannot find Hugo release foo in https://raw.githubusercontent.com/crazy-max/ghaction-hugo/master/.github/hugo-releases.json'
      )
    );
  });
});

describe('installer', () => {
  it('acquires v0.104.2 version of Hugo', async () => {
    const hugo = await installer.getHugo('v0.104.2', false);
    expect(fs.existsSync(hugo)).toBe(true);
  }, 100000);

  it('acquires v0.104.2 version of Hugo (extended)', async () => {
    const hugo = await installer.getHugo('v0.104.2', true);
    expect(fs.existsSync(hugo)).toBe(true);
  }, 100000);

  it('acquires latest version of Hugo', async () => {
    const hugo = await installer.getHugo('latest', false);
    expect(fs.existsSync(hugo)).toBe(true);
  }, 100000);

  it('acquires latest version of Hugo (extended)', async () => {
    const hugo = await installer.getHugo('latest', true);
    expect(fs.existsSync(hugo)).toBe(true);
  }, 100000);
});
