#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const packageSwiftUiDirs = [
  ['expo-dev-menu', 'ios', 'SwiftUI'],
  ['expo-dev-launcher', 'ios', 'SwiftUI'],
].map(parts => path.join(process.cwd(), 'node_modules', ...parts));
const expoCliSimulatorCheckFile = path.join(
  process.cwd(),
  'node_modules',
  '@expo',
  'cli',
  'build',
  'src',
  'start',
  'platforms',
  'ios',
  'ensureSimulatorAppRunning.js',
);

function stripPreviewBlocks(source) {
  // Removes SwiftUI preview blocks that can fail with some Xcode toolchains.
  return source.replace(/\n#Preview\s*\{[\s\S]*?\n\}\n?/g, '\n');
}

function listSwiftFilesRecursively(startDir) {
  const result = [];
  const entries = fs.readdirSync(startDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listSwiftFilesRecursively(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.swift')) {
      result.push(fullPath);
    }
  }

  return result;
}

function run() {
  let changedCount = 0;
  let scannedDirs = 0;

  for (const swiftUiDir of packageSwiftUiDirs) {
    if (!fs.existsSync(swiftUiDir)) {
      continue;
    }
    scannedDirs += 1;

    const files = listSwiftFilesRecursively(swiftUiDir);

    for (const filePath of files) {
      const original = fs.readFileSync(filePath, 'utf8');
      const updated = stripPreviewBlocks(original);

      if (updated !== original) {
        fs.writeFileSync(filePath, updated, 'utf8');
        changedCount += 1;
        const packageName = path.basename(path.dirname(path.dirname(swiftUiDir)));
        const relativeFile = path.relative(swiftUiDir, filePath);
        console.log(`✅ [Success]: patched ${packageName}/${relativeFile}`);
      }
    }
  }

  if (scannedDirs === 0) {
    console.log('⚠️ [Warning]: no Expo dev SwiftUI folders found, skipping fix.');
    return;
  }

  if (changedCount === 0) {
    console.log('🔍 [Debug]: no preview blocks found to patch.');
  }
  else {
    console.log(`✅ [Success]: iOS SwiftUI preview fix applied in ${changedCount} file(s).`);
  }

  patchExpoCliOsaScriptPermission();
}

function patchExpoCliOsaScriptPermission() {
  if (!fs.existsSync(expoCliSimulatorCheckFile)) {
    console.log('⚠️ [Warning]: Expo CLI simulator check file not found, skipping permission workaround.');
    return;
  }

  const original = fs.readFileSync(expoCliSimulatorCheckFile, 'utf8');
  const from = '        throw error;';
  const to = [
    '        if (error.message.includes(\'privilege violation\') || error.message.includes(\'not authorized\')) {',
    '            return true;',
    '        }',
    '        throw error;',
  ].join('\n');

  if (!original.includes(from)) {
    console.log('🔍 [Debug]: Expo CLI permission workaround already applied or source changed.');
    return;
  }

  const updated = original.replace(from, to);
  fs.writeFileSync(expoCliSimulatorCheckFile, updated, 'utf8');
  console.log('✅ [Success]: patched Expo CLI simulator permission fallback.');
}

run();
