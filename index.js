#!/usr/bin/env node

import { spawn } from 'child_process';

import {
    access,
    appendFile,
    mkdir,
    readFile,
    writeFile,
} from 'fs/promises';

import { constants } from 'fs';

import path from 'path';
import os from 'os';

const PATHS_FILE = path.join(
    os.homedir(),
    '.local',
    'share',
    'timmy_dat',
    'paths.dat'
);

const ensure_storage = async () => {
    const dir = path.dirname(PATHS_FILE);

    await mkdir(dir, { recursive: true });

    try {
        await access(PATHS_FILE, constants.F_OK);
    } catch {
        await writeFile(PATHS_FILE, '', 'utf8');
    }
};

const list_paths = async () => {
    const data = await readFile(PATHS_FILE, 'utf8');

    const paths = [
        process.cwd(),
        ...data.split('\n').filter(Boolean),
    ];

    return [...new Set(paths)];
};

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

        fzf.on('close', async (code) => {
            if (code !== 0) {
                reject(new Error('No path selected'));
                return;
            }

            const selected_path = selected
                .trim()
                .replace(/^⭐\s*/, '');

            // persist cwd only if explicitly selected
            if (selected_path === cwd) {
                const data = await readFile(PATHS_FILE, 'utf8');

                const exists = data
                    .split('\n')
                    .filter(Boolean)
                    .includes(selected_path);

                if (!exists) {
                    await appendFile(
                        PATHS_FILE,
                        `${selected_path}\n`,
                        'utf8'
                    );
                }
            }

            resolve(selected_path);
        });
    });
};

const open_session = (session_path) => {
    const session_name = path.basename(session_path);

    const tmux = spawn('tmux', [
        'attach-session',
        '-t',
        session_name,
    ], {
        stdio: 'inherit',
    });

    tmux.on('close', (code) => {
        if (code === 1) {
            spawn('tmux', [
                'new-session',
                '-s',
                session_name,
                '-c',
                session_path,
            ], {
                stdio: 'inherit',
            });
        }
    });
};

ensure_storage()
    .then(list_paths)
    .then(show_in_fzf)
    .then(open_session)
    .catch(console.error);