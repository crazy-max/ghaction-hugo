import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as github from './github';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';

const osPlat: string = os.platform();
const osArch: string = os.arch();

export async function getHugo(version: string, extended: boolean): Promise<string> {
  const release: github.GitHubRelease | null = await github.getRelease(version);
  if (!release) {
    throw new Error(`Cannot find Mage ${version} release`);
  }
  const semver: string = release.tag_name.replace(/^v/, '');

  core.info(`Hugo version found: ${release.tag_name}`);
  const filename = getFilename(semver, extended);
  const downloadUrl: string = util.format(
    'https://github.com/gohugoio/hugo/releases/download/%s/%s',
    release.tag_name,
    filename
  );

  core.info(`Downloading ${downloadUrl}...`);
  const downloadPath: string = await tc.downloadTool(downloadUrl);
  core.debug(`Downloaded to ${downloadPath}`);

  core.info('Extracting Hugo...');
  let extPath: string;
  if (osPlat == 'win32') {
    extPath = await tc.extractZip(downloadPath);
  } else {
    extPath = await tc.extractTar(downloadPath);
  }
  core.debug(`Extracted to ${extPath}`);

  const cachePath: string = await tc.cacheDir(extPath, 'ghaction-hugo', semver);
  core.debug(`Cached to ${cachePath}`);

  const exePath: string = path.join(cachePath, osPlat == 'win32' ? 'hugo.exe' : 'hugo');
  core.debug(`Exe path is ${exePath}`);

  return exePath;
}

const getFilename = (version: string, extended: boolean): string => {
  const platform: string = osPlat == 'win32' ? 'windows' : osPlat == 'darwin' ? 'darwin' : 'Linux';
  const arch: string = osPlat == 'darwin' ? 'universal' : osPlat == 'win32' ? 'amd64' : '64bit';
  const ext: string = osPlat == 'win32' ? 'zip' : 'tar.gz';
  const name: string = extended ? 'hugo_extended' : 'hugo';
  return util.format('%s_%s_%s-%s.%s', name, version, platform, arch, ext);
};
