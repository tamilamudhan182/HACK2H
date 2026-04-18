module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins: [
    // Replace import.meta.env with empty object so Jest can parse Vite-style code
    function () {
      return {
        visitor: {
          MetaProperty(path) {
            path.replaceWithSourceString("({env:{}})");
          },
        },
      };
    },
  ],
};
