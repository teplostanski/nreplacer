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

Replace text in a file or directory using the CLI:

```bash
nreplacer --file <filepath or directory> --search "old-text" --replace "new-text" [--global] [--noverbose]

    --file: The path to the file or directory where you want to perform the replacement.
    --search: The text or pattern you wish to search for.
    --replace: The text you wish to replace the searched text/pattern with.
    --global (Optional): If specified, will replace all occurrences. If omitted, only the first occurrence will be replaced.
    --noverbose (Optional): If specified, disables verbose output and only performs the replacement silently.
```

For programmatic usage in your JavaScript or TypeScript projects:

```javascript
#!/usr/bin/env node
import { replaceInFiles } from "nreplacer";

const filePathOrDir = 'test.txt';
const searchValue = 'old';
const replaceValue = 'new';
const globalReplace = true;

replaceInFiles(filePathOrDir, searchValue, replaceValue, globalReplace);
```

## Features

- **Fast & Efficient**: Uses streams for efficient memory usage even with large files.
- **Flexible**: Supports both global and single occurrence replacements.
- **Safe**: Checks file type and ensures it's a text-based format before processing.
- **Intuitive CLI**: Simple and straightforward command line interface.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See [LICENSE.md](./LICENSE.md) for more details.
