import * as path from 'path';
import * as vscode from 'vscode';

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'by CoffeeChaton/vscode-autohotkey-NekoHelp';
statusBarItem.command = 'ahk.bar.click';
let Configs = vscode.workspace.getConfiguration('AhkNekoHelp');
type TConfigs = {
    statusBar: {
        displayColor: string;
    };
    hover: {
        showComment: boolean;
    };
    format: {
        textReplace: boolean;
    };
    lint: {
        funcSize: number;
    };
    Ignored: {
        folder: {
            startsWith: string[];
            endsWith: string[];
        }
        File: {
            startsWith: string[];
            endsWith: string[];
        }
    }
};

function getConfig(): TConfigs {
    return {
        statusBar: {
            displayColor: Configs.get('statusBar.displayColor') as string,
        },
        hover: {
            showComment: Configs.get('hover.showComment') as boolean,
        },
        format: {
            textReplace: Configs.get('format.textReplace') as boolean,
        },
        lint: {
            funcSize: Configs.get('lint.funcSize') as number,
        },
        Ignored: {
            folder: {
                startsWith: Configs.get('Ignored.folder.startsWith') as string[],
                endsWith: Configs.get('Ignored.folder.endsWith') as string[],
            },
            File: {
                startsWith: Configs.get('Ignored.File.startsWith') as string[],
                endsWith: Configs.get('Ignored.File.endsWith') as string[],
            },
        },
    };
}

let config = getConfig();

export function configChangEvent(): void {
    Configs = vscode.workspace.getConfiguration('AhkNekoHelp');
    config = getConfig();
}

export function showTimeSpend(uri: vscode.Uri, timeStart: number): void {
    const time = Date.now() - timeStart;
    const name = ` of ${path.basename(uri.fsPath)}`;
    statusBarItem.text = `$(heart) ${time} ms${name}`;
    console.log('Outline provide', time, 'ms', name);
    statusBarItem.color = config.statusBar.displayColor;
    statusBarItem.show();
}

export function getHoverConfig(): { showComment: boolean } {
    return config.hover;
}
export function getLintConfig(): { funcSize: number; } {
    return config.lint;
}
export function getFormatConfig(): boolean {
    return config.format.textReplace;
}
export function getIgnoredFolder(file: string): boolean {
    const startsWith = config.Ignored.folder.startsWith;
    for (const e of startsWith) {
        if (file.startsWith(e)) return true;
    }
    const endsWith = config.Ignored.folder.endsWith;
    for (const e of endsWith) {
        if (file.endsWith(e)) return true;
    }
    return false;
}
export function getIgnoredFile(buildPath: string): boolean {
    const fileFix = path.basename(buildPath, '.ahk');
    const startsWith = config.Ignored.File.startsWith;
    for (const e of startsWith) {
        if (fileFix.startsWith(e)) return true;
    }
    const endsWith = config.Ignored.File.endsWith;
    for (const e of endsWith) {
        if (fileFix.endsWith(e)) return true;
    }
    return false;
}
// console.log(JSON.stringify(val));
// vscode.window.setStatusBarMessage(timeSpend);
// vscode.window.showErrorMessage()
// vscode.window.showInformationMessage()
// ❤♡
