# big-sur-icons-replacer

## Installation

### Requirements
  - Node.js (LTS)
  - Yarn

Clone this repository:

```
git clone https://github.com/neet/big-sur-icons-replacer.git
cd ./big-sur-icons-replacer
```

Install dependencies

```
yarn
```

Build the CLI:

```
yarn run build
```

Done

## Usage

```
Commands:
  index.js replace-all  Replace icons of all existing apps
  index.js replace      Replace single icon
  index.js revert       Revert single icon
  index.js revert-all   Revert all icons
```

See also `--help` for each command

### Example

```
sudo ./dist/index.js replace-all -d /macOS_Big_Sur_icons_replacements/icons
```

## License
CC-0
