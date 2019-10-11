"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tc = __importStar(require("@actions/tool-cache"));
const download = __importStar(require("download"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const util = __importStar(require("util"));
const restm = __importStar(require("typed-rest-client/RestClient"));
let osPlat = os.platform();
let osArch = os.arch();
function getHugo(version, extended) {
    return __awaiter(this, void 0, void 0, function* () {
        const selected = yield determineVersion(version);
        if (selected) {
            version = selected;
        }
        console.log(`✅ Hugo version found: ${version}`);
        const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'hugo-'));
        const fileName = getFileName(version, extended);
        const downloadUrl = util.format('https://github.com/gohugoio/hugo/releases/download/%s/%s', version, fileName);
        console.log(`⬇️ Downloading ${downloadUrl}...`);
        yield download.default(downloadUrl, tmpdir, { filename: fileName });
        console.log('📦 Extracting Hugo...');
        let extPath = tmpdir;
        if (osPlat == 'win32') {
            extPath = yield tc.extractZip(`${tmpdir}/${fileName}`);
        }
        else {
            extPath = yield tc.extractTar(`${tmpdir}/${fileName}`);
        }
        return path.join(extPath, osPlat == 'win32' ? 'hugo.exe' : 'hugo');
    });
}
exports.getHugo = getHugo;
function getFileName(version, extended) {
    const platform = osPlat == 'win32' ? 'Windows' : osPlat == 'darwin' ? 'macOS' : 'Linux';
    const arch = osArch == 'x64' ? '64bit' : '32bit';
    const ext = osPlat == 'win32' ? 'zip' : 'tar.gz';
    const name = extended ? 'hugo_extended' : 'hugo';
    return util.format('%s_%s_%s-%s.%s', name, version.replace(/^v/, ''), platform, arch, ext);
}
function determineVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        let rest = new restm.RestClient('ghaction-hugo', 'https://github.com', undefined, {
            headers: {
                Accept: 'application/json'
            }
        });
        let res = yield rest.get(`/gohugoio/hugo/releases/${version}`);
        if (res.statusCode != 200 || res.result === null) {
            throw new Error(`Cannot find Hugo ${version} release (http ${res.statusCode})`);
        }
        return res.result.tag_name;
    });
}
