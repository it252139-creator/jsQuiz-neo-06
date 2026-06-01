# jsQuiz-neo-06

「CDN から import した Motion で、文字をクリックすると中央からスクランブルして **TRIDENT** に戻る」課題です。

## 課題内容

中央の文字（`TRIDENT`）をクリックすると、各文字がランダムな文字を経由しながら、中央から外側へ順にスクランブルして、また `TRIDENT` に戻るアニメーションを完成させます。

レイアウト、Motion の **CDN からの import**、文字の **`<span>` 分割（HTML に記述済み）**、そして **「1文字目だけが動く例」** はすでに用意してあります。
あなたの課題は、**その1文字だけの例を、すべての文字に反映させる**ことです。

## 用意済みのもの

`index.html` の `<span>` は最初から HTML に置いてあります（書き換えないでください）。

```html
<h1 class="text">
  <span>T</span><span>R</span><span>I</span><span>D</span><span>E</span><span>N</span><span>T</span>
</h1>
```

`<script type="module">` には、以下が用意されています。

```js
import { animate, stagger } from 'https://cdn.jsdelivr.net/npm/motion@12/+esm';

const TARGET = 'TRIDENT';
const text = document.querySelector('.text');
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@*';
const randomChar = () => charset[Math.floor(Math.random() * charset.length)];

// HTML の <span> を取得（letters[0] が T、letters[1] が R …）
const letters = text.querySelectorAll('span');

// ↓↓↓ いまは「1文字目（letters[0]）だけ」が動く例 ↓↓↓
text.addEventListener('click', function () {
  const i = 0;
  const span = letters[i];
  animate(0, 1, {
    duration: 0.5,
    onUpdate: function (progress) {
      span.textContent = progress < 1 ? randomChar() : TARGET[i];
    },
  });
});
```

- `letters` は `TRIDENT` の各文字に対応した `<span>` の集まりです。
- `randomChar()` を呼ぶとランダムな1文字が返ります。
- `<script>` の `type="module"`、`import` の行は外したり書き換えたりしないでください。

## あなたの課題

用意済みの「1文字だけ動く例」を参考に、**文字をクリックしたら全文字がアニメーションする**ように書き換えてください。

- `letters` を `forEach` で1文字ずつ回す
- **中央から外側へ**順に確定させる遅延に `stagger(0.08, { from: 'center' })` を使う
- `onUpdate(progress)` で、`progress` が `1` 未満なら `randomChar()`、`1` なら確定文字 `TARGET[i]` を表示

### ヒント

`stagger(...)` は「順番 `i` と総数から遅延（数値）を返す関数」を作ります。
`animate(0, 1, ...)` の `delay` には数値が必要なので、`stag(i, letters.length)` のように呼び出して使います。

```js
const stag = stagger(0.08, { from: 'center' });

text.addEventListener('click', function () {
  letters.forEach(function (span, i) {
    animate(0, 1, {
      duration: 0.5,
      delay: stag(i, letters.length),
      onUpdate: function (progress) {
        span.textContent = progress < 1 ? randomChar() : TARGET[i];
      },
    });
  });
});
```

### `animate` と `onUpdate` の仕組み

```js
animate(0, 1, {
  duration: 0.5,
  delay: stag(i, letters.length),
  onUpdate: function (progress) { ... },
});
```

- `animate(0, 1, { ... })` は「**`0` から `1` へ変化する数値**」を `duration` 秒かけて作ります（特定の要素ではなく数値そのものをアニメーションさせています）。
- `onUpdate(progress)` は**アニメーションの毎フレーム呼び出される関数**で、その時点の値（`0`〜`1`）が `progress` に入ります。
- そこで、**進行中（`progress < 1`）はランダム文字**、**完了時（`progress` が `1`）は確定文字（`TARGET[i]`）** に切り替えると、「ガチャガチャ動いて最後に決まる」スクランブル表現になります。
- `delay` を付けると、その文字の**開始タイミングを遅らせ**られます。`stagger(..., { from: 'center' })` で中央ほど早く・端ほど遅く始まり、中央から広がる動きになります。

## 制作手順

1. ルートの `index.html` を `students/{自分の番号}/index.html` にコピーする
2. 「ここから下があなたの課題です。」以下の **1文字だけの例**を、全文字版に書き換える
3. ブラウザで文字をクリックし、中央からほどけて `TRIDENT` に戻ることを確認する

> Motion は CDN から読み込むため、確認時は**インターネットに接続**してください。

## 提出方法

### ① Fork
このリポジトリを自分のアカウントに Fork してください。

### ② clone
自分の Fork を GitHub Desktop で clone します。

### ③ branch を作る
ブランチ名に「quiz6/自分の名前」を記入する（例：quiz6/kawaguchi）

### ④ コードを書く
`students/{自分の番号}/index.html` を編集して課題を完成させます。
（例：出席番号が 7 番なら `students/7/index.html`）

### ⑤ commit / push
変更を commit して push してください。
- title：出席番号_名前（例：28_河口）
- message：提出します。

### ⑥ Pull Request を作成
元のリポジトリに向けて Pull Request を作成してください。

## 判定について

- Pull Request を出すと自動判定が実行されます
- 成功 → ✅ 合格！ のコメントが付きます
- 失敗 → ❌ 不合格 のコメントと確認ポイントが付きます

結果は PR のコメント欄と Checks タブで確認してください。

## ディレクトリ構成

```
jsQuiz-neo-06/
├── index.html              # 問題ファイル（参照・複製元）
├── students/               # 解答フォルダ ★ここに作業する
│   └── {自分の番号}/
│       └── index.html      # index.html を複製して解答を記述
├── .github/                # 自動判定の設定（触らない）
├── tests/                  # 自動判定の設定（触らない）
├── playwright.config.js    # 自動判定の設定（触らない）
└── README.md
```

## 注意

- `students/{自分の番号}/index.html` の `<script>` 内、「ここから下があなたの課題です。」より下だけ編集してください
- `import` の行・HTML の `<span>`・`letters`／`randomChar` などの用意済みコードは書き換えないでください
- `<script>` の `type="module"` は外さないでください
- `students/` 以外のファイルは変更しないでください
- エラーが出たら修正して再度 push してください

---

## 模範解答

授業資料の[JSQuiz_neo模範解答](https://2026doc.hideok.org/first-term/javascript/post-quizanswer)
