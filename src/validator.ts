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
        throw new Error(`Environment variable ${key} is required`);
      }
      if (config.default !== undefined) {
        result[key] = config.default;
        continue;
      }
    } else {
      if (config.validate && !config.validate(value)) {
        throw new Error(`Environment variable "${key}" is invalid.`);
      }
      result[key] = value;
    }
  }
  return result as EnvValidationResult<T>;
}
