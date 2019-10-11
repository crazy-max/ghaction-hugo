import fs = require('fs');
import * as installer from '../src/installer';

describe('installer', () => {
  it('acquires v0.58.3 version of Hugo', async () => {
    const hugo = await installer.getHugo('1.8.0', false);
    expect(fs.existsSync(hugo)).toBe(true);
  }, 100000);

  it('acquires v0.58.3 version of Hugo (extended)', async () => {
    const hugo = await installer.getHugo('1.8.0', true);
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
