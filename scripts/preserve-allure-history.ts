import fs from 'fs';
import path from 'path';

const resultsDir = 'allure-results';
const reportHistoryDir = path.join('allure-report', 'history');
const resultsHistoryDir = path.join(resultsDir, 'history');

fs.mkdirSync(resultsDir, { recursive: true });

// 1. Copy custom defect categories into allure-results
if (fs.existsSync('categories.json')) {
  fs.copyFileSync('categories.json', path.join(resultsDir, 'categories.json'));
  console.log('Copied categories.json -> allure-results/categories.json');
}

// 2. Copy previous build's history/ into allure-results/history/ for Trend Charts
if (fs.existsSync(reportHistoryDir)) {
  fs.cpSync(reportHistoryDir, resultsHistoryDir, { recursive: true });
  console.log('Copied allure-report/history -> allure-results/history (Trend history preserved)');
} else {
  console.log('No previous allure-report/history found (first run).');
}

// 3. Attach AI run-summary.md and ai-analysis.md if present
for (const aiFile of ['run-summary.md', 'ai-analysis.md']) {
  if (fs.existsSync(aiFile)) {
    fs.copyFileSync(aiFile, path.join(resultsDir, aiFile));
  }
}