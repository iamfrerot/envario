export interface EnvSchema {
  [key: string]: {
    required?: boolean; // is this variable required?
    default?: string; // default value if not provided
    validate?: (value: string) => boolean; // custom validation function
  };
}
export type EnvValidationResult<T extends EnvSchema> = {
  [K in keyof T]: string; // Final, validated environment variable values
};
