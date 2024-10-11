import * as core from "@actions/core";
import StyleDictionary from "style-dictionary";
import * as nodefs from "fs";
import * as path from "path";

async function run(): Promise<void> {
  try {
    const tokensPath = core.getInput("tokens-path") || "./tokens";
    const outputPath = core.getInput("output-path") || "./lib";

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

    styleDictionary.log.verbosity = "verbose";

    core.debug("Initializing Style Dictionary");
    await styleDictionary.hasInitialized;

    core.debug("Cleaning platforms");
    await styleDictionary.cleanAllPlatforms();
    core.debug(`Building platforms to ${outputPath}`);
    await styleDictionary.buildAllPlatforms();

    core.debug("Done");
    core.setOutput("output-path", outputPath);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
