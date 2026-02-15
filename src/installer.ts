import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as semver from 'semver';
import * as util from 'util';
import * as core from '@actions/core';
import * as httpm from '@actions/http-client';
import * as tc from '@actions/tool-cache';

const osPlat: string = os.platform();

export interface GitHubRelease {
  id: number;
  tag_name: string;
  html_url: string;
  assets: Array<string>;
}

export const getRelease = async (version: string): Promise<GitHubRelease> => {
  const url = `https://raw.githubusercontent.com/crazy-max/ghaction-hugo/master/.github/hugo-releases.json`;
  const http: httpm.HttpClient = new httpm.HttpClient('ghaction-hugo');
  const resp: httpm.HttpClientResponse = await http.get(url);
  const body = await resp.readBody();
  const statusCode = resp.message.statusCode || 500;
  if (statusCode >= 400) {
    throw new Error(`Failed to get Hugo release ${version} from ${url} with status code ${statusCode}: ${body}`);
  }
  const releases = <Record<string, GitHubRelease>>JSON.parse(body);
  if (!releases[version]) {
    throw new Error(`Cannot find Hugo release ${version} in ${url}`);
  }
  return releases[version];
};

export async function getHugo(version: string, extended: boolean): Promise<string> {
  const release: GitHubRelease = await getRelease(version);
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
  } else if (osPlat == 'darwin' && filename.endsWith('.pkg')) {
    extPath = await extractPkg(downloadPath);
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

const extractPkg = async (downloadPath: string): Promise<string> => {
  const pkgPath: string = await tc.extractXar(downloadPath);
  const payloadPath = path.join(pkgPath, 'Payload');
  if (!fs.existsSync(payloadPath)) {
    throw new Error(`No Payload found in package ${downloadPath}`);
  }
  const extPath = fs.mkdtempSync(path.join(os.tmpdir(), 'hugo-ext-'));
  try {
    await tc.extractTar(payloadPath, extPath);
  } catch {
    // some payloads are not gzipped; retry with plain extract mode
    await tc.extractTar(payloadPath, extPath, 'x');
  }
  return extPath;
};

const getFilename = (version: string, extended: boolean): string => {
  const name: string = extended ? 'hugo_extended' : 'hugo';
  const platform: string = osPlat == 'win32' ? 'windows' : osPlat == 'darwin' ? 'darwin' : 'Linux';
  const arch: string = osPlat == 'darwin' ? 'universal' : osPlat == 'win32' ? 'amd64' : '64bit';
  let ext: string;
  switch (osPlat) {
    case 'win32':
      ext = 'zip';
      break;
    case 'darwin':
      if (semver.satisfies(version, '>=0.153.0')) {
        ext = 'pkg';
      } else {
        ext = 'tar.gz';
      }
      break;
    default:
      ext = 'tar.gz';
      break;
  }
  return util.format('%s_%s_%s-%s.%s', name, version, platform, arch, ext);
};
