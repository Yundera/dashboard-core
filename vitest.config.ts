// Plain-object config (no `vitest/config` import) so the file loads even when
// vitest is resolved from outside the package node_modules (e.g. npx / CI cache).
export default {
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // KeyLib.test.ts is currently fully commented out (no active suite); exclude
    // it so vitest doesn't fail on "no test found" until it's revived.
    exclude: ['**/node_modules/**', '**/dist/**', 'src/library/keys/KeyLib.test.ts'],
  },
};
