const { test, expect } = require('@playwright/test');
const path = require('path');

const STUDENT_FILE = process.env.STUDENT_FILE;
const TARGET = 'TRIDENT';

test.beforeAll(() => {
  if (!STUDENT_FILE) throw new Error('STUDENT_FILE 環境変数が設定されていません');
});

function resolveFileUrl() {
  return `file://${path.resolve(__dirname, '..', STUDENT_FILE)}`;
}

// 各 <span> を監視し、「一度でも確定文字以外になった文字」のインデックスを集める。
// （全文字がスクランブルしたか＝全文字に反映できたかを判定するため）
async function installScrambleTracker(page) {
  await page.evaluate((target) => {
    window.__changed = new Set();
    document.querySelectorAll('.text span').forEach((span, i) => {
      const observer = new MutationObserver(() => {
        if (span.textContent !== target[i]) {
          window.__changed.add(i);
        }
      });
      observer.observe(span, { childList: true, characterData: true, subtree: true });
    });
  }, TARGET);
}

test('初期状態で TRIDENT が1文字ずつ span に入っている', async ({ page }) => {
  await page.goto(resolveFileUrl());
  const state = await page.evaluate(() => {
    const spans = document.querySelectorAll('.text span');
    return {
      count: spans.length,
      text: document.querySelector('.text').textContent.replace(/\s+/g, ''),
    };
  });
  expect(state.count).toBe(TARGET.length);
  expect(state.text).toBe(TARGET);
});

test('文字をクリックすると全文字がスクランブルして TRIDENT に戻る', async ({ page }) => {
  await page.goto(resolveFileUrl());
  await installScrambleTracker(page);

  await page.click('.text');

  // 全 7 文字が一度はスクランブルしたことを確認（1文字だけの例では到達しない）
  await page.waitForFunction((n) => window.__changed.size === n, TARGET.length, {
    timeout: 5000,
  });

  // アニメーション後に TRIDENT へ戻ることを確認
  await page.waitForFunction(
    (target) => document.querySelector('.text').textContent.replace(/\s+/g, '') === target,
    TARGET,
    { timeout: 5000 },
  );
});

test('クリック後に JavaScript エラー（import 失敗を含む）が出ていない', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto(resolveFileUrl());
  await installScrambleTracker(page);
  await page.click('.text');
  await page.waitForFunction((n) => window.__changed.size === n, TARGET.length, {
    timeout: 5000,
  });
  await page.waitForFunction(
    (target) => document.querySelector('.text').textContent.replace(/\s+/g, '') === target,
    TARGET,
    { timeout: 5000 },
  );
  expect(errors, errors.join('\n')).toEqual([]);
});
