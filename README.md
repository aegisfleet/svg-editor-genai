# SVG Editor GenAI

SVG Editor GenAIは、SVG画像を生成および編集するためのWebアプリケーションです。Google Generative AI（Gemini）を使用して、指示に基づいてSVG画像を自動的に更新します。

![light_theme](/images/capture_light_theme.png)

![dark_theme](/images/capture_dark_theme.png)

## 機能

- **コードエディタ**：SVG画像を直接編集できます。
- **履歴機能**：UndoおよびRedoボタンで変更履歴を管理します。
- **クリア機能**：エディタの内容をクリアします。
- **コピー機能**：エディタの内容をクリップボードにコピーします。
- **自動更新機能**：指示を入力するとGoogle Generative AIを使用してSVG画像を更新します。
- **プレビュー機能**：SVG画像のプレビューをリアルタイムで表示します。
- **リサイズ機能**：エディタとプレビューの幅を調整できます。
- **ズーム機能**：プレビュー画面でSVG画像をズームインまたはズームアウトできます。
- **パン機能**：プレビュー画面でSVG画像をドラッグして移動できます。
- **ダークモード**: ライトモードとダークモードを切り替えることができます。

## 使用技術

- Next.js
- React
- TypeScript
- Tailwind CSS
- CodeMirror
- Google Generative AI (Gemini)
- Lucide React (アイコン用)

## 環境構築

### 依存関係のインストール

```bash
npm install
```

### 環境変数の設定

`GEMINI_API_KEY` を設定する必要があります。以下のように`.env.local`ファイルを作成して設定します。

```plaintext
GEMINI_API_KEY=YOUR_API_KEY
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスしてください。

### ビルド

```bash
npm run build
```

### プロダクションモードでの起動

```bash
npm start
```

## プロジェクト構成

- `components/CodeEditor.tsx`：SVG画像を編集するためのエディタコンポーネント。
- `components/ErrorDialog.tsx`：エラーダイアログコンポーネント。
- `components/GeminiInput.tsx`：Google Generative AIに指示を送るための入力コンポーネント。
- `components/LoadingDialog.tsx`：ローディングダイアログコンポーネント。
- `components/SVGPreview.tsx`：SVG画像のプレビューコンポーネント。
- `components/Resizer.tsx`：エディタとプレビューの幅を調整するためのコンポーネント。
- `components/ThemeToggle.tsx`: ライトモードとダークモードを切り替えるためのコンポーネント。
- `pages/_app.tsx`：アプリケーションのメインエントリーポイント。
- `pages/index.tsx`：ホームページ。
- `pages/api/gemini.ts`：Google Generative AI APIとの通信を行うAPIルート。
- `utils/geminiApi.ts`：フロントエンドからGemini APIを呼び出すためのユーティリティ関数。

## ライセンス

このプロジェクトはMITライセンスのもとで公開されています。詳細は`LICENSE`ファイルを参照してください。
