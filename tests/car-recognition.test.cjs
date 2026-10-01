const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = process.cwd();
const ts = require(root + '/node_modules/typescript');
let processor, prediction, scores;
const labels = require(root + '/assets/lables/carLabels.json');
const mocks = {
  react: {useEffect() {}, useState: () => [null, value => prediction = value], createElement() {}},
  'react-native': {StyleSheet: {create: x => x}, Dimensions: {get: () => ({width: 390})}},
  'react-native-vision-camera': {useCameraDevice: () => ({}), useCameraPermission: () => ({hasPermission: true}), useFrameProcessor: fn => {processor = fn; return fn}, runAtTargetFps: (_, fn) => fn()},
  'react-native-fast-tflite': {useTensorflowModel: () => ({state: 'loaded', model: {runSync: () => [scores]}})},
  'vision-camera-resize-plugin': {useResizePlugin: () => ({resize: () => new Float32Array(224 * 224 * 3)})},
  'react-native-worklets-core': {Worklets: {createRunOnJS: fn => fn}},
  '@/assets/lables/carLabels.json': labels,
  '@/assets/model/car_classifier.tflite': {},
};
const code = ts.transpileModule(fs.readFileSync(root + '/src/app/(tabs)/cars.tsx', 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true}}).outputText;
const context = {exports: {}, require: name => {if (!(name in mocks)) throw Error(name); return mocks[name]}};
vm.runInNewContext(code, context);
context.exports.default();
// Exercise the real screen's frame processor and result callback with controlled
// inference outputs; native camera/inference execution is intentionally mocked.
function processScores(values) {
  scores = new Float32Array(values);
  processor({width: 640, height: 480});
}
processScores(new Array(labels.length).fill(1 / labels.length));
assert.equal(prediction, null, 'Uncertain output must not be displayed as a detected brand');
const confident = new Array(labels.length).fill(0.1 / (labels.length - 1));
confident[3] = 0.9;
processScores(confident);
assert.equal(prediction.label, labels[3], 'A confident prediction must keep its label mapping');
assert.ok(Math.abs(prediction.confidence - 0.9) < 0.00001);
processScores(new Array(labels.length).fill(1 / labels.length));
assert.equal(prediction, null, 'A weak frame must clear the previous confident brand');
console.log('Car recognition: uncertain predictions rejected, confident label preserved, stale prediction cleared.');
