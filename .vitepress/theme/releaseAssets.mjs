const CHECKSUM_PATTERN = /\.(sha256|sha1|sha512|md5|asc|sig|sum|txt)$/i;
const DEBUG_ASSET_PATTERN = /\b(debug|test|staging)\b|\.pdb|mapping|proguard|symbols|sources|-dbg/i;
const INSTALLER_EXT_PATTERN = /\.(apk|aab|ipa|exe|msi|msix|dmg|pkg|deb|rpm|appimage|crx|xapk)$/i;

const ASSET_ARCH_RULES = [
  [/arm64|aarch64|armv8/i, "arm64"],
  [/x86_64|x64|amd64/i, "x64"],
  [/i686|i386|\bx86\b/i, "x86"],
  [/armeabi|armv7|armhf/i, "arm"],
];

// Dotted version strings only (e.g. "1.0.305"), so "arm64", "v8a", dates
// like "26081712" or build sequences never count as versions.
const VERSION_TOKEN_PATTERN = /\d+(?:\.\d+){1,}/g;

/**
 * @typedef {"arm64" | "arm" | "x64" | "x86"} DeviceArch
 */

/**
 * @typedef {object} ReleaseAsset
 * @property {string} name
 * @property {number} size
 * @property {number} downloadCount
 * @property {string} url
 * @property {string} contentType
 */

/**
 * @param {string} name
 * @returns {DeviceArch | null}
 */
export function getAssetArchitecture(name) {
  for (const [pattern, arch] of ASSET_ARCH_RULES) {
    if (pattern.test(name)) return arch;
  }
  return null;
}

/**
 * @param {string} name
 * @returns {32 | 64 | null}
 */
export function getAssetBitness(name) {
  const arch = getAssetArchitecture(name);
  if (arch === "arm64" || arch === "x64") return 64;
  if (arch === "arm" || arch === "x86") return 32;
  return null;
}

/**
 * @param {string | undefined} architecture
 * @param {string | undefined} bitness
 * @returns {DeviceArch | null}
 */
export function mapUaDataToArch(architecture, bitness) {
  const arch = architecture?.toLowerCase();
  const bits = bitness === "64" ? "64" : bitness === "32" ? "32" : "";
  if (arch === "arm") return bits === "32" ? "arm" : "arm64";
  if (arch === "x86") return bits === "32" ? "x86" : "x64";
  return null;
}

/**
 * @param {{ userAgent?: string, platform?: string } | undefined} navigatorLike
 * @returns {DeviceArch | null}
 */
export function detectDeviceArch(navigatorLike = globalThis.navigator) {
  if (!navigatorLike) return null;
  const probe = `${navigatorLike.userAgent ?? ""} ${navigatorLike.platform ?? ""}`;
  return getAssetArchitecture(probe);
}

/**
 * @param {string} name
 * @returns {{ index: number, version: number[] } | null}
 */
function assetVersion(name) {
  const matches = [...name.matchAll(VERSION_TOKEN_PATTERN)];
  if (!matches.length) return null;
  const last = matches[matches.length - 1];
  return { index: last.index, version: last[0].split(".").map(Number) };
}

function compareVersions(left, right) {
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    const diff = (left[i] ?? 0) - (right[i] ?? 0);
    if (diff) return diff;
  }
  return 0;
}

/**
 * A release can accidentally accumulate stale builds (e.g. the publishing
 * workflow re-uploads with `--clobber`, which replaces same-named files but
 * never deletes the renamed older ones). Two assets describe the same product
 * variant when their names are identical up to the version token, so only the
 * newest version of each variant is kept and duplicate download buttons
 * (e.g. an arm64 1.0.304 + arm64 1.0.305 APK) never both render.
 *
 * @param {ReleaseAsset[]} assets
 * @returns {ReleaseAsset[]}
 */
function dedupeByNewestVersion(assets) {
  const groups = new Map();
  for (const asset of assets) {
    const parsed = assetVersion(asset.name);
    // No dotted version (portable zip, universal build, ...) -> unique group,
    // kept as-is since there is nothing to compare it against.
    const key = parsed ? asset.name.slice(0, parsed.index).toLowerCase() : `__unversioned__:${asset.name}`;
    if (!groups.has(key)) groups.set(key, { assets: [], max: null });
    const group = groups.get(key);
    group.assets.push(asset);
    if (parsed && (group.max === null || compareVersions(parsed.version, group.max) > 0)) {
      group.max = parsed.version;
    }
  }

  return assets.filter((asset) => {
    const parsed = assetVersion(asset.name);
    const key = parsed ? asset.name.slice(0, parsed.index).toLowerCase() : `__unversioned__:${asset.name}`;
    const group = groups.get(key);
    return group.max === null || (parsed && compareVersions(parsed.version, group.max) === 0);
  });
}

/**
 * Return every installable asset. Device architecture changes ordering 
 * @param {{ assets?: ReleaseAsset[] } | null} release
 * @param {DeviceArch | null} userArch
 * @returns {ReleaseAsset[]}
 */
export function listDownloadAssets(release, userArch = null) {
  if (!release?.assets?.length) return [];

  const usable = release.assets.filter(
    (asset) => asset?.url && !CHECKSUM_PATTERN.test(asset.name) && !DEBUG_ASSET_PATTERN.test(asset.name),
  );
  if (!usable.length) {
    const fallback = release.assets.find((asset) => asset?.url);
    return fallback ? [fallback] : [];
  }

  const installers = usable.filter((asset) => INSTALLER_EXT_PATTERN.test(asset.name));
  const pool = installers.length ? installers : usable;

  const sorted = [...pool].sort((left, right) => {
    const score = (asset) => {
      const arch = getAssetArchitecture(asset.name);
      const deviceMatch = userArch && arch === userArch ? 100 : 0;
      const bitnessPreference = getAssetBitness(asset.name) === 64 ? 30 : arch ? 10 : 20;
      return deviceMatch + bitnessPreference;
    };

    return score(right) - score(left) || (right.size || 0) - (left.size || 0);
  });

  return dedupeByNewestVersion(sorted);
}
