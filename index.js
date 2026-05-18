#!/usr/bin/env node

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


const list_paths = async () => {
    try {
        const data = await readFile(PATH, "utf-8");

        const paths = [
            process.cwd(),
            ...data.split("\n").filter(Boolean),
        ];

        return [...new Set(paths)];
    } catch(err) {
        console.error(err);
    }
}

const show_in_fzf = (paths) => {
    return new Promise((resolve, reject) => {
        const cwd = process.cwd();

        const display_paths = paths.map(p =>
            p === cwd ? `⭐ ${p}` : p
        );

        const fzf = spawn('fzf', [], {
            stdio: ['pipe', 'pipe', 'inherit'],
        });

        fzf.stdin.write(display_paths.join('\n'));
        fzf.stdin.end();

        let selected = '';

        fzf.stdout.on('data', (data) => {
            selected += data.toString();
        });

        fzf.on('close', (code) => {
            if (code === 0) {
                resolve(
                    selected
                        .trim()
                        .replace(/^⭐\s*/, '')
                );
            } else {
                reject('no path selected');
            }

            console.log('fzf exited with', code);
        });
    });
};

const open_session = (session_path) => {
    const tmux_session = spawn('tmux', [
        'attach-session',
        '-t',
        `${session_path}`,
        '-c',
        `${session_path}`,
    ], {
        stdio: 'inherit'
    });

    tmux_session.on('close', (code) => {
        if (code === 0) {
            console.log('Exited with code', code);
        }
        else if (code === 1) {
            const tmux_session = spawn('tmux', [
                'new-session',
                '-s',
                `${session_path}`,
                '-c',
                `${session_path}`,
            ], {
                stdio: 'inherit'
            });
        }
    })
}

list_paths()
    .then(x => x.filter(str => str.length !== 0))
    .then(x => show_in_fzf(x))
    .then(x => open_session(x))
    .catch(err => console.error(err));