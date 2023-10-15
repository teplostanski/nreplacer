# nreplacer

Effortlessly replace text in any text-based file using the power and simplicity of Node.js.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install `nreplacer` globally for easy access from any directory:

```
npm install -g nreplacer
```

Or install it locally for your project:

```
npm install nreplacer --save-dev
```

## Usage

Replace text in a file using the CLI:

```
nreplacer --file <filepath> --search "old-text" --replace "new-text" [--global]
```

- `--file`: The path to the file where you want to perform the replacement.
- `--search`: The text or pattern you wish to search for.
- `--replace`: The text you wish to replace the searched text/pattern with.
- `--global` (Optional): If specified, will replace all occurrences. If omitted, only the first occurrence will be replaced.

For programmatic usage in your JavaScript or TypeScript projects:

```javascript
#!/usr/bin/env node
import { replaceInFile } from "nreplacer";

const filePath = 'test.txt';
const searchValue = 'old';
const replaceValue = 'new';
const globalReplace = true;

replaceInFile(filePath, searchValue, replaceValue, globalReplace);
```

## Features

- **Fast & Efficient**: Uses streams for efficient memory usage even with large files.
- **Flexible**: Supports both global and single occurrence replacements.
- **Safe**: Checks file type and ensures it's a text-based format before processing.
- **Intuitive CLI**: Simple and straightforward command line interface.
  
## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](path-to-contributing-guide) for guidelines on how to contribute.

## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0). See [LICENSE.md](./LICENSE.md) for more details.
