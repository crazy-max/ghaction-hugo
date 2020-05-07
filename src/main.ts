import * as installer from './installer';
import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function run(): Promise<void> {
  try {
    const version = core.getInput('version') || 'latest';
    const extended = core.getInput('extended') || 'false';
    const args = core.getInput('args');
    const hugo = await installer.getHugo(version, /true/i.test(extended));

    core.info('🏃 Running Hugo...');
    await exec.exec(`${hugo} ${args}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
