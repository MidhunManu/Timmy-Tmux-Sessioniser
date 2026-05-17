import { spawn } from 'child_process'
import { readFile } from 'fs/promises';
import path from 'path';
import os from 'os';

const PATH = path.join(
    os.homedir(),
    '.local',
    'share',
    'timmy_dat',
    'paths.dat'
);

// const tmux = spawn('tmux', [
//   'new-session',
//   '-s',
//   'my-session'
// ], {
//   stdio: 'inherit'
// })

// tmux.on('close', (code) => {
//   console.log('Exited with code', code)
// })

const list_paths = async () => {
    try {
        const data = await readFile(PATH, "utf-8");
        return data.split("\n");
    } catch(err) {
        console.error(err);
    }
}

const show_in_fzf = (paths) => {
    const fzf = spawn('fzf', [], {
        stdio: ['pipe', 'inherit', 'inherit'],
    })

    fzf.stdin.write(paths.join('\n'))
    fzf.stdin.end()

    let selected = '';

    fzf.stdout.on('data', (data) => {
        selected += data.toString();
    })

    fzf.on('close', (code) => {
        if (code === 0) {
            resolve
        }
        console.log('fzf exited with', code)
    })
}

list_paths()
    .then(x => x.filter(str => str.length !== 0))
    .then(x => show_in_fzf(x))
    .catch(err => console.error(err));