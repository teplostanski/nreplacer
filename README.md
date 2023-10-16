# nreplacer

Effortlessly replace text in any text-based file or directory using the power and simplicity of Node.js.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install `nreplacer` globally for easy access from any directory:

```bash
npm install -g nreplacer
```

Or install it locally for your project:

```bash
npm install nreplacer --save-dev
```

## Usage

#### Replace text in a file or directory using the CLI. You can provide either plain text or regex patterns in the --search parameter:

Example with plain text:

```bash
nreplacer --file <filepath or directory> --search "old-text" --replace "new-text" [--global] [--noprint] [--nocolor]
```

Example with a regex pattern:

```bash
nreplacer --file <filepath or directory> --search "/\d{3}-\d{2}-\d{4}/g" --replace "XXX-XX-XXXX" [--global] [--noprint] [--nocolor]
```

| Option        | Description                                                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| `--file`      | The path to the file or directory where you want to perform the replacement.                                   |
| `--search`    | The text or pattern you wish to search for.                                                                    |
| `--replace`   | The text you wish to replace the searched text/pattern with.                                                   |
| `--global`    | (Optional) If specified, will replace all occurrences. If omitted, only the first occurrence will be replaced. |
| `--noverbose` | (Optional) If specified, disables verbose output and only performs the replacement silently.                   |
| `--noprint`   | (Optional) If specified, suppresses the output printing.                                                       |
| `--nocolor`   | (Optional) If specified, disables color in the output.                                                         |

---

#### For programmatic usage in your JavaScript or TypeScript projects:

You can also utilize nreplacer in your JavaScript or TypeScript projects. Here's how you can use the replaceInFiles function:

Example with plain text:

```javascript
import { replaceInFiles } from "nreplacer";

const filePathOrDir = 'test.txt';
const searchValue = 'old-text';
const replaceValue = 'new-text';
const globalReplace = true;

replaceInFiles(filePathOrDir, searchValue, replaceValue, globalReplace);
```

Example with a regex pattern:

```javascript

import { replaceInFiles } from "nreplacer";

const filePathOrDir = 'test.txt';
const searchValue = /\d{3}-\d{2}-\d{4}/g; // Searching for patterns like "123-45-6789"
const replaceValue = 'XXX-XX-XXXX';
const globalReplace = true;

replaceInFiles(filePathOrDir, searchValue, replaceValue, globalReplace);
```

By leveraging these examples, you can efficiently integrate nreplacer into your projects and automate text replacement tasks programmatically.

## Features

- **Fast & Efficient**: Uses streams for efficient memory usage even with large files.
- **Flexible**: Supports both global and single occurrence replacements.
- **Safe**: Checks file type and ensures it's a text-based format before processing.
- **Intuitive CLI**: Simple and straightforward command line interface.
- **Regex Support**: Utilize regular expressions for text searching.
- **Configurable Output**: Control the verbosity and color of the CLI output with flags.

## Recent Updates

- Enhanced output formatting with microsecond precision.
- Integrated boxen for improved CLI output framing.
- Added `noprint` option to suppress output.
- Enhanced CLI output with a bordered box.
- Regex support added for searching.

Check out our [Changelog](./CHANGELOG.md) for a detailed history of updates.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See [LICENSE.md](./LICENSE.md) for more details.
