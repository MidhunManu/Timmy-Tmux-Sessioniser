# timmy

```txt
  __  _                               
 / /_(_)___ ___  ____ ___  __  __    
/ __/ / __ `__ \/ __ `__ \/ / / /    
/ /_/ / / / / / / / / / / / /_/ /     
\__/_/_/ /_/ /_/_/ /_/ /_/\__, /      
                          /____/       
```

Tiny tmux session launcher powered by `fzf`.

`timmy` remembers directories you actually use and lets you jump into tmux sessions instantly.

---

## Features

* fuzzy-find project directories with `fzf`
* automatically injects current working directory
* remembers directories only when you actually open them
* attaches to existing tmux sessions
* creates new tmux sessions automatically
* lightweight and terminal-native

---

## Supported Platforms

* Linux
* macOS

---

## Requirements

Install these first:

* tmux
* fzf
* Node.js

### Linux

#### Debian / Ubuntu

```bash
sudo apt install tmux fzf nodejs npm
```

#### Arch Linux

```bash
sudo pacman -S tmux fzf nodejs npm
```

#### Fedora

```bash
sudo dnf install tmux fzf nodejs npm
```

---

### macOS

Using Homebrew:

```bash
brew install tmux fzf node
```

---

## Installation

### npm

```bash
npm install -g timmy
```

### local development

```bash
git clone https://github.com/MidhunManu/Timmy-Tmux-Sessioniser
cd timmy
npm install
npm link
```

---

## Usage

From inside any project directory:

```bash
timmy
```

You’ll see an `fzf` picker containing:

* saved directories
* your current working directory (`⭐`)

Selecting a directory will:

1. attach to an existing tmux session
2. or create a new one automatically

If you select the current directory, it becomes permanently remembered.

---

## Example

```bash
cd ~/projects/api-server
timmy
```

Later:

```bash
timmy
```

`~/projects/api-server` will now appear in the saved list automatically.

---

## Storage

Saved paths are stored at:

```txt
~/.local/share/timmy_dat/paths.dat
```

---

## Philosophy

`timmy` tries to stay tiny.

* no databases
* no config labyrinth
* no giant abstractions
* just tmux + fzf + muscle memory

---

## License

GPL-2.0-only
