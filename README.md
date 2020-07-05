# TypescriptTraining

## 環境構築
```
npm init
npm install --save-dev typescript @types/node
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier eslint-plugin-prettier
npm install --save-dev jest @types/jest ts-jest

npm install --save puppeteer
npm install --save-dev @types/puppeteer
```

> 注意点
- lintはeslintを利用する。
- prettierも利用します。
- testにはjestを利用します。(設定はpackage.jsonに保持しています。)

## トランスパイル + 実行コマンド
```
./node_modules/.bin/tsc
node ./dist/index.js
node ./dist/puppeteer/sample.js
```

## eslintの設定
```
eslint --init
```