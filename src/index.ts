import * as core from "@actions/core";
import StyleDictionary from "style-dictionary";

async function run(): Promise<void> {
  try {
    const tokensPath = core.getInput("tokens-path");
    const outputPath = core.getInput("output-path");

    core.debug(`Running transformation on ${tokensPath}`);

    const styleDictionary = new StyleDictionary({
      source: [`${tokensPath}/**/*.json`],
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

    core.debug("Initializing Style Dictionary");
    await styleDictionary.hasInitialized;

    core.debug("Cleaning platforms");
    await styleDictionary.cleanAllPlatforms();
    core.debug("Building platforms");
    await styleDictionary.buildAllPlatforms();

    core.debug("Done");
    core.setOutput("output-path", outputPath);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
