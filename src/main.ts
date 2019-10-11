import * as installer from './installer';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function run(silent?: boolean) {
  try {
    const version = core.getInput('version') || 'latest';
    const extended = core.getInput('extended') || 'false';
    const args = core.getInput('args');
    const hugo = await installer.getHugo(version, /true/i.test(extended));

    console.log('🏃 Running Hugo...');
    await exec.exec(`${hugo} ${args}`, undefined, {
      silent: silent
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
