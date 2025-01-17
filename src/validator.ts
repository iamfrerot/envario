import { EnvSchema, EnvValidationResult } from "./types";

export function validateEnv<T extends EnvSchema>(
  schema: T
): EnvValidationResult<T> {
  const result: Partial<EnvValidationResult<T>> = {};

  for (const key in schema) {
    const config = schema[key];
    const value = process.env[key];

    if (!value) {
      if (config.required) {
        throw new Error(
          `Missing environment variable: "${key}".\n` +
            `This variable is required but was not found in the environment.\n` +
            `Suggestion: Make sure to set "${key}" in your .env file or environment.`
        );
      }
      if (config.default !== undefined) {
        result[key] = config.default;
        continue;
      }
    } else {
      if (config.validate && !config.validate(value)) {
        throw new Error(
          `Invalid environment variable: "${key}".\n` +
            `Provided value: "${value}"\n` +
            `Reason: The value does not meet the validation criteria.\n` +
            `Suggestion: Double-check the value of "${key}" in your environment and ensure it meets the required format or constraints.`
        );
      }
      result[key] = value;
    }
  }

  return result as EnvValidationResult<T>;
}
