#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { EnvSchema } from "./types";
import { validateEnv } from "./validator";
// Initialize Commander
const program = new Command();

/**
 *
 * Command to validate environment variables using a schema file.
 */
function loadSchema(filePath: string): EnvSchema {
  if (!fs.existsSync(filePath)) {
    console.log(
      chalk.red(`Error: The specified schema file does not exist: ${filePath}`)
    );
    process.exit(1);
  }

  try {
    const schema = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return schema;
  } catch (error: any) {
    console.log(
      chalk.red(`Error: Failed to parse the schema file: ${filePath}`)
    );
    console.log(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Validate environment variables using the provided schema and print the result.
 */
function validationWithSchema(schema: EnvSchema, mode: string): void {
  try {
    const result = validateEnv(schema);
    console.log(chalk.green("Validation successful!"));
    console.log(chalk.green("Result:"));
    console.log(chalk.blue(result));
  } catch (error: any) {
    if (mode === "tolerant") {
      console.error(chalk.yellow("Validation failed. Errors:"));
      console.error(chalk.red(error.message));
    } else {
      console.error(chalk.red("Validation failed:"));
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  }
}

program
  .name("envario")
  .description("A CLI tool to validate environment variables against a schema")
  .version("1.0.0")
  .option("-s, --schema <path>", "Path to the schema file")
  .option("-m, --mode <mode>", "Validation mode: strict or tolerant", "strict")
  .option("-e, --env <path>", "Path to the .env file", ".env")
  .action((options) => {
    const { schema, mode, env } = options;

    // load .env file
    const envPath = path.resolve(env);
    if (!fs.existsSync(envPath)) {
      console.log(chalk.red(`Error: .env file not found at: ${envPath}`));
      process.exit(1);
    }

    dotenv.config({ path: envPath });

    // load schema file
    if (!schema) {
      console.log(
        chalk.red("No schema provided. Use --schema to specify a schema file.")
      );
      process.exit(1);
    }

    const schemaPath = path.resolve(schema);
    const validationSchema = loadSchema(schemaPath);
    // validate environment variables
    validationWithSchema(validationSchema, mode);
  });
program.parse(process.argv);
//# sourceMappingURL=cli.js.map
