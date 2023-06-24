# Otamajakushi Bookshelf Extension

Otamajakushi Bookshelf の拡張機能ライブラリです！

## どんな拡張機能を作りたい？

|            やりたいこと            | 使用するべき拡張機能の種類 |
| :--------------------------------: | :------------------------: |
| オリジナルの辞書形式を読み込みたい |      `BookController`      |
|    描画方法をカスタマイズしたい    |      `LayoutBuilder`       |
|    検索方法をカスタマイズしたい    |       `PageExplorer`       |
|    辞書アプリの背景色を変えたい    |        `StyleTheme`        |

## 拡張機能の作り方

Otamajakushi Bookshelf の拡張機能は、TCP 通信を用いて Otamajakushi Bookshelf と連携します。

## デプロイ方法

```console
npm run build
./scripts/copy.sh # Windows では .\scripts\copy.ps1 を実行
cd ./dist
npm publish
```
