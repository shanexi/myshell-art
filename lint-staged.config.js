module.exports = {
  '{apps,libs,tools}/**/*.{ts,tsx}': [
    (files) => `nx affected --target=typecheck --files=${files.join(',')}`,
    // (files) => `nx affected --target=test --files=${files.join(',')}`,
  ],
  '{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}': [
    (files) => `nx affected:lint --files=${files.join(',')}`,
    (files) => `nx format:write --files=${files.join(',')}`,
  ],
};
