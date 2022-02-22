import * as vscode from 'vscode';
import { UpdateCacheAsync } from './UpdateCache';

let c1: NodeJS.Timeout[] = [];

export async function DevLoopOfClearOutlineCache(): Promise<null> {
    void vscode.window.showInformationMessage('this is Dev function ,open profile-flame to get .cpuprofile');

    c1.forEach((e) => clearInterval(e));
    c1 = [];
    type TPick = {
        label: string;
        maxTime: number;
    };

    const base = 200;
    const min1 = 300; // 60 * 1000 / base
    const sec10 = 50; // 10 * 1000 / base

    const items: TPick[] = [
        { label: '1 min', maxTime: min1 },
        { label: '10 sec', maxTime: sec10 },
    ];

    const pick = await vscode.window.showQuickPick<TPick>(items);
    if (pick === undefined) return null;

    const iMax = pick.maxTime;
    for (let i = 1; i <= iMax; i++) {
        c1.push(setTimeout(() => {
            void UpdateCacheAsync(false);
        }, i * base));
    }
    c1.push(setTimeout(() => {
        void vscode.window.showInformationMessage('The task should be completed, please confirm!');
        // eslint-disable-next-line no-magic-numbers
    }, (iMax + 10) * base));
    return null;
}
