# Envario

Envario is a command-line tool for validating environment variables against a
schema. It helps ensure that your .env files are well-structured and contain all
the necessary values in the right format.

## Features

- Validate .env files against a customizable schema.
- Support for required fields, default values, and custom validation functions.
- Strict and tolerant validation modes.
- Clear error reporting and user-friendly CLI.
- Can be imported directly into your Node.js projects for validation of
  environment variables.

## Installation

### 1. Install Globally

To install Envario globally, use the following npm command:

```bash
npm install -g envario
```

### 2. Install Locally

To install it locally as a development dependency:

```bash
npm install --save-dev envario
```

## Usage

### CLI Commands

Envario provides a CLI that you can use to validate your `.env` file base on
JSON schema.

#### 1. Validate a `.env` file

To validate your `.env ` file, run:

```bash
envario --env ./path/to/.env --schema ./path/to/schema.json
```

- `--env`: (optional) The path to your .env file. Defaults to .env.
- `--schema`: The path to the JSON schema file.
- `--mode`: (optional) Validation mode. Use strict (default) for failing
  immediately on errors, or tolerant to collect all errors and show them at
  once.

#### 2. Help Command

To view the CLI help

```bash
envario --help
```

#### 3. Version Command

To check the version of Envario:

```bash
envario --version
```

## Example schema

A schema defines the environment variables you expect to see in your `.env` file
and their requirements

Example schema (`schema.json`)

```json
{
  "PORT": { "required": true },
  "NODE_ENV": { "required": true, "default": "development" },
  "DEBUG": { "required": false },
  "API_KEY": { "required": true, "validate": "startsWithSk" }
}
```

- `required`: Marks the variable as required.
- `default`: Provides a default value if the variable is missing.
- `validate`: A custom validation function (e.g., ensure API_KEY starts with
  "sk-").

## Custom Validators

Envario supports custom validation functions to add more flexibility in how
environment variables are validated. For example, you can create a custom
function to check if a value starts with a specific prefix.

Example of a custom validator function (`startsWithSk`):

```javascript
function startsWithSk(value) {
  if (!value.startsWith("sk-")) {
    throw new Error("API_KEY must start with 'sk-'");
  }
  return value;
}
```

You can add these custom functions in your schema by referencing the function
name as a string.

## Programmatic Use

You can also use Envario’s validation directly in your Node.js applications by
importing the `validateEnv` function.

### 1. Import the `validateEnv` function

```javascript
const {validateEnv} from "envario"
```

### 2. Define your schema

You can define a schema just like in the CLI example, which includes
`required fields`, `default values`, and `custom validation`

```javascript
const schema = {
  PORT: { required: true },
  NODE_ENV: { required: true, default: "development" },
  DEBUG: { required: false },
  API_KEY: { required: true, validate: startsWithSk },
};
```

### 3.Validate your environment variables

Call `validateEnv` with your `schema` to validate environment variables. This
will throw an error if any required environment variables are missing or if the
values don't meet the validation criteria.

```javascript
try {
  const envVars = validateEnv(schema);
  console.log("Environment variables are valid:", envVars);
} catch (error) {
  console.error("Environment variable validation failed:", error.message);
}
```

## Examples

### 1. Validate `.env` with default schema

if your `.env`file is located at `./.env`, and you want to validate it with the
default schema:

```bash
envario --schema ./schema.json
```

### 2. Use a Custom `.env` file

if you want to validate `.env` file located elsewhere: ``bash envario --env
./config/.env --schema ./config/schema.json

### 3. Use tolerant mode

if you want to gather all validation errors instead of failing on the first
error: ``bash envario --env ./config/.env --schema ./config/schema.json --mode
tolerant

## Contributing

I welcome contribution to envario! to contribute:

1. Fork this repository
2. Create a new branch
3. Open a pull request.
4. Yeah!! that's it 😂
