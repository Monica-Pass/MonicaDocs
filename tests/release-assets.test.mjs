import test from "node:test";
import assert from "node:assert/strict";

import {
  detectDeviceArch,
  getAssetBitness,
  listDownloadAssets,
  mapUaDataToArch,
} from "../.vitepress/theme/releaseAssets.mjs";

const arm64Asset = {
  name: "Monica-Android-arm64-v8a-1.0.303.APK",
  size: 45_600_000,
  downloadCount: 112,
  url: "https://example.com/monica-arm64.apk",
  contentType: "application/vnd.android.package-archive",
};

const arm32Asset = {
  name: "Monica-Android-armeabi-v7a-1.0.303.APK",
  size: 41_100_000,
  downloadCount: 49,
  url: "https://example.com/monica-arm32.apk",
  contentType: "application/vnd.android.package-archive",
};

const release = {
  assets: [arm64Asset, arm32Asset],
};

test("lists both 64-bit and 32-bit installers for the latest release", () => {
  const assets = listDownloadAssets(release);

  assert.deepEqual(assets.map((asset) => asset.name), [arm64Asset.name, arm32Asset.name]);
});

test("keeps every architecture visible while putting the detected device first", () => {
  const assets = listDownloadAssets(release, "arm");

  assert.deepEqual(assets.map((asset) => asset.name), [arm32Asset.name, arm64Asset.name]);
});

test("filters non-installable release artifacts", () => {
  const assets = listDownloadAssets({
    assets: [
      arm64Asset,
      { ...arm32Asset, name: "Monica-Android-debug.APK" },
      { ...arm32Asset, name: "Monica-Android.APK.sha256" },
    ],
  });

  assert.deepEqual(assets.map((asset) => asset.name), [arm64Asset.name]);
});

test("maps Android APK architectures to user-facing bitness", () => {
  assert.equal(getAssetBitness(arm64Asset.name), 64);
  assert.equal(getAssetBitness(arm32Asset.name), 32);
  assert.equal(getAssetBitness("Monica-Android-universal.APK"), null);
});

test("maps browser architecture hints and legacy user agents", () => {
  assert.equal(mapUaDataToArch("arm", "64"), "arm64");
  assert.equal(mapUaDataToArch("arm", "32"), "arm");
  assert.equal(mapUaDataToArch("x86", "64"), "x64");
  assert.equal(mapUaDataToArch("x86", "32"), "x86");
  assert.equal(mapUaDataToArch("mips", "64"), null);
  assert.equal(detectDeviceArch({ userAgent: "Android armv7", platform: "Linux" }), "arm");
  assert.equal(detectDeviceArch({ userAgent: "Desktop x86_64", platform: "Linux" }), "x64");
  assert.equal(detectDeviceArch(null), null);
});

test("handles empty, fallback, and architecture-neutral release assets", () => {
  assert.deepEqual(listDownloadAssets(null), []);
  assert.deepEqual(listDownloadAssets({ assets: [] }), []);

  const debugOnly = { ...arm32Asset, name: "Monica-debug.APK" };
  assert.deepEqual(listDownloadAssets({ assets: [debugOnly] }), [debugOnly]);
  assert.deepEqual(listDownloadAssets({ assets: [{ ...debugOnly, url: "" }] }), []);

  const smallerZip = { ...arm32Asset, name: "Monica-portable.zip", size: 10 };
  const largerZip = { ...arm64Asset, name: "Monica-universal.zip", size: 20 };
  assert.deepEqual(
    listDownloadAssets({ assets: [smallerZip, largerZip] }).map((asset) => asset.name),
    [largerZip.name, smallerZip.name],
  );
});

test("drops stale older-version assets so a release never shows duplicate buttons", () => {
  const stale304 = { ...arm64Asset, name: "Monica-Android-arm64-v8a-1.0.304-26081712-01.APK" };
  const current305 = { ...arm64Asset, name: "Monica-Android-arm64-v8a-1.0.305-26081712-01.APK" };
  const stale304arm = { ...arm32Asset, name: "Monica-Android-armeabi-v7a-1.0.304-26081712-01.APK" };
  const current305arm = { ...arm32Asset, name: "Monica-Android-armeabi-v7a-1.0.305-26081712-01.APK" };

  // Old (1.0.304) + new (1.0.305) for both ABIs used to render 4 buttons;
  // only the newest build of each architecture should remain.
  assert.deepEqual(
    listDownloadAssets({ assets: [stale304, current305, stale304arm, current305arm] }).map((asset) => asset.name),
    [current305.name, current305arm.name],
  );
});

test("dedupes across differing build dates, not just identical suffixes", () => {
  const olderBuild = { ...arm64Asset, name: "Monica-Android-arm64-v8a-1.0.304-26081612-01.APK" };
  const newerBuild = { ...arm64Asset, name: "Monica-Android-arm64-v8a-1.0.305-26081712-01.APK" };

  assert.deepEqual(listDownloadAssets({ assets: [olderBuild, newerBuild] }).map((asset) => asset.name), [
    newerBuild.name,
  ]);
});

test("keeps distinct products that share an architecture", () => {
  const phone = { ...arm64Asset, name: "Monica-Android-arm64-v8a-1.0.305-26081712-01.APK" };
  const wear = { ...arm64Asset, name: "Monica-wear_arm64_V1.1.2.apk", size: 6_900_000 };

  assert.deepEqual(listDownloadAssets({ assets: [phone, wear] }).map((asset) => asset.name), [
    phone.name,
    wear.name,
  ]);
});
