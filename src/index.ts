import * as core from "@actions/core";
import StyleDictionary from "style-dictionary";

async function run(): Promise<void> {
  try {
    const tokenPath = core.getInput("token-path");
    const outputPath = core.getInput("output-path");

    const styleDictionary = new StyleDictionary({
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
      },
    });

    await styleDictionary.hasInitialized;

    await styleDictionary.cleanAllPlatforms();
    await styleDictionary.buildAllPlatforms();

    core.setOutput("output-path", outputPath);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
