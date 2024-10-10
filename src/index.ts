import * as core from "@actions/core";
import * as StyleDictionary from "style-dictionary";

async function run(): Promise<void> {
  try {
    const tokenPath = core.getInput("token-path");
    const outputPath = core.getInput("output-path");

    const styleDictionary = StyleDictionary.extend({
      source: [tokenPath],
      platforms: {
        css: {
          transformGroup: "css",
          buildPath: `${outputPath}/`,
          files: [
            {
              destination: "variables.css",
              format: "css/variables",
            },
          ],
        },
        scss: {
          transformGroup: "scss",
          buildPath: `${outputPath}/`,
          files: [
            {
              destination: "variables.scss",
              format: "scss/variables",
            },
          ],
        },
        js: {
          transformGroup: "js",
          buildPath: `${outputPath}/`,
          files: [
            {
              destination: "variables.js",
              format: "javascript/es6",
            },
          ],
        },
      },
    });

    styleDictionary.buildAllPlatforms();

    core.setOutput("output-path", outputPath);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
