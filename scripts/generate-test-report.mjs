import fs from 'node:fs';
import path from 'node:path';

const reportsDir = path.resolve('reports');
const inputPath = path.join(reportsDir, 'vitest-results.json');
const outputPath = path.join(reportsDir, 'test-report.md');

if (!fs.existsSync(inputPath)) {
  throw new Error(`Missing test results file: ${inputPath}`);
}

const raw = fs.readFileSync(inputPath, 'utf8');
const results = JSON.parse(raw);

const files = Array.isArray(results.testResults) ? results.testResults : [];
const totalTests = results.numTotalTests ?? files.reduce((sum, file) => sum + (file.assertionResults?.length ?? 0), 0);
const passedTests = results.numPassedTests ?? files.reduce((sum, file) => {
  return sum + (file.assertionResults?.filter((item) => item.status === 'passed').length ?? 0);
}, 0);
const failedTests = results.numFailedTests ?? files.reduce((sum, file) => {
  return sum + (file.assertionResults?.filter((item) => item.status === 'failed').length ?? 0);
}, 0);
const skippedTests = results.numPendingTests ?? files.reduce((sum, file) => {
  return sum + (file.assertionResults?.filter((item) => item.status === 'pending').length ?? 0);
}, 0);

const lines = [
  '# Automated Test Report',
  '',
  `- Generated: ${new Date().toISOString()}`,
  `- Total tests: ${totalTests}`,
  `- Passed: ${passedTests}`,
  `- Failed: ${failedTests}`,
  `- Skipped: ${skippedTests}`,
  '',
  '## Test Files',
];

if (files.length === 0) {
  lines.push('- No test files were reported.');
} else {
  for (const file of files) {
    const assertions = Array.isArray(file.assertionResults) ? file.assertionResults : [];
    const passed = assertions.filter((item) => item.status === 'passed').length;
    const failed = assertions.filter((item) => item.status === 'failed').length;
    const skipped = assertions.filter((item) => item.status === 'pending').length;

    lines.push(`- \`${file.name}\`: ${passed} passed, ${failed} failed, ${skipped} skipped`);

    for (const assertion of assertions) {
      lines.push(`  - [${assertion.status}] ${assertion.fullName}`);
    }
  }
}

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote ${outputPath}`);
