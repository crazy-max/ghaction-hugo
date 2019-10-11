import * as tc from '@actions/tool-cache';
import * as download from 'download';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as restm from 'typed-rest-client/RestClient';

let osPlat: string = os.platform();
let osArch: string = os.arch();

export async function getHugo(
  version: string,
  extended: boolean
): Promise<string> {
  const selected = await determineVersion(version);
  if (selected) {
    version = selected;
  }

  console.log(`✅ Hugo version found: ${version}`);
  const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'hugo-'));
  const fileName = getFileName(version, extended);
  const downloadUrl = util.format(
    'https://github.com/gohugoio/hugo/releases/download/%s/%s',
    version,
    fileName
  );

  console.log(`⬇️ Downloading ${downloadUrl}...`);
  await download.default(downloadUrl, tmpdir, {filename: fileName});

  console.log('📦 Extracting Hugo...');
  let extPath: string = tmpdir;
  if (osPlat == 'win32') {
    extPath = await tc.extractZip(`${tmpdir}/${fileName}`);
  } else {
    extPath = await tc.extractTar(`${tmpdir}/${fileName}`);
  }

  return path.join(extPath, osPlat == 'win32' ? 'hugo.exe' : 'hugo');
}

function getFileName(version: string, extended: boolean): string {
  const platform: string =
    osPlat == 'win32' ? 'Windows' : osPlat == 'darwin' ? 'macOS' : 'Linux';
  const arch: string = osArch == 'x64' ? '64bit' : '32bit';
  const ext: string = osPlat == 'win32' ? 'zip' : 'tar.gz';
  const name: string = extended ? 'hugo_extended' : 'hugo';
  return util.format('%s_%s_%s-%s.%s', name, version, platform, arch, ext);
}

interface GitHubRelease {
  tag_name: string;
}

async function determineVersion(version: string): Promise<string> {
  let rest: restm.RestClient = new restm.RestClient(
    'ghaction-hugo',
    'https://github.com',
    undefined,
    {
      headers: {
        Accept: 'application/json'
      }
    }
  );

  let res: restm.IRestResponse<GitHubRelease> = await rest.get<GitHubRelease>(
    `/gohugoio/hugo/releases/${version}`
  );
  if (res.statusCode != 200 || res.result === null) {
    throw new Error(
      `Cannot find Hugo ${version} release (http ${res.statusCode})`
    );
  }

  return res.result.tag_name;
}
