import * as core from "@actions/core";
import { parse, build, Logger } from "@terrazzo/parser";
import { defineConfig } from "@terrazzo/cli";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
import pluginCSS from "@terrazzo/plugin-css";

async function run(): Promise<void> {
  const logger = new Logger({
    debugScope: "@design-system-pro/transform-action",
    level: "info",
  });

  try {
    const tokensPath = core.getInput("tokens-path") || "./tokens";
    const outputPath = core.getInput("output-path") || "./lib";

    const tokensFile = `${tokensPath}/tokens.json`;

    core.info(`Running transformation on ${tokensPath}/tokens.json`);

    const config = defineConfig({
      tokens: tokensFile,
      outDir: `${outputPath}/`,
      plugins: [
        pluginCSS({
          filename: "tokens.css",
        }),
      ],
    });

    const rawTokens = readFileSync(tokensFile, "utf8");

    const { tokens, sources } = await parse(
      [
        {
          src: rawTokens,
        },
      ],
      { config, logger }
    );

    const buildResult = await build(tokens, { sources, config, logger });

    // Write the generated files to disk
    buildResult.outputFiles.forEach((file) => {
      const filePath = `${outputPath}/${file.filename}`;
      const dirPath = dirname(filePath);

      // Ensure the directory exists
      mkdirSync(dirPath, { recursive: true });

      // Write the file
      writeFileSync(filePath, file.contents);

      core.info(`Wrote ${filePath}`);
    });

    core.debug("Done");
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
