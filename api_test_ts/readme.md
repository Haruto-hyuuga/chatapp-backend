To test single file.ts, usually gemini api and other servises.

- Install: `npm install -D tsx`
- Run: `npx tsx api_test_ts/gemini.ts`

we already have installed tsx in this project so skip that.

may be bit slower then `npx tsc src/test.ts` > `node src/test.js` cuz above method doesnt compile the code, it just run donno how.
