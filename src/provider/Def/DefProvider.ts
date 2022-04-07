import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { DeepReadonly, EMode, TSymAndFsPath } from '../../globalEnum';
import { tryGetSymbol } from '../../tools/tryGetSymbol';
import { getValDefInFunc } from './getValDefInFunc';

type TFnFindCol = (lineStr: string) => undefined | number;
type TDefObj = Readonly<{
    document: vscode.TextDocument;
    position: vscode.Position;
    Mode: EMode;
    wordUp: string;
    refFn: TFnFindCol;
    timeStart: number;
    listAllUsing: boolean;
}>;

async function getReference(refFn: TFnFindCol, timeStart: number, wordUp: string): Promise<vscode.Location[]> {
    const List: vscode.Location[] = [];
    const fsPathList: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPathList) {
        // use-await-in-loop jest 20ms, but Promise.all need 30ms+
        // eslint-disable-next-line no-await-in-loop
        const document = await vscode.workspace.openTextDocument(fsPath);
        const textRawList = document.getText().split('\n');

        // const dc5: TAhkFileData | undefined = Detecter.getDocMap(fsPath);

        const lineCount = textRawList.length;
        for (let line = 0; line < lineCount; line++) {
            const textRaw = textRawList[line].trim();
            const col = refFn(textRaw);
            if (col !== undefined) {
                const Location = new vscode.Location(
                    document.uri,
                    new vscode.Position(line, col),
                );
                List.push(Location);
            }
        }
    }
    console.log(`🚀 list all using of "${wordUp}"`, Date.now() - timeStart, ' ms'); // ssd -> 20ms
    return List;
}

async function ahkDef(
    {
        document,
        position,
        Mode,
        wordUp,
        refFn,
        timeStart,
        listAllUsing,
    }: TDefObj,
): Promise<null | vscode.Location[]> {
    const data: TSymAndFsPath | null = tryGetSymbol(wordUp, Mode);

    if (data === null) return null;
    const { AhkSymbol, fsPath } = data;

    if (listAllUsing) {
        const ref = await getReference(refFn, timeStart, wordUp);
        return ref;
    }

    if (
        (fsPath === document.uri.fsPath
            && AhkSymbol.selectionRange.start.line === position.line)
    ) {
        return [new vscode.Location(document.uri, AhkSymbol.selectionRange)];
        // return [new vscode.Location(document.uri, position)];
        // const ref = await getReference(refFn, timeStart, wordUp);
        // return ref;
    }

    console.log(`🚀 goto def of "${wordUp}"`, Date.now() - timeStart, ' ms'); // ssd -> 1~3ms
    return [new vscode.Location(vscode.Uri.file(fsPath), AhkSymbol.selectionRange)];
}

// FIXME goto func Def
export async function userDefTopSymbol(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): Promise<null | vscode.Location[]> {
    const timeStart = Date.now();
    type TRule = {
        refFn: TFnFindCol;
        Mode: EMode;
    };

    const func: TRule = {
        refFn: (lineStr: string): number | undefined => {
            // funcName( | "funcName"
            // eslint-disable-next-line security/detect-non-literal-regexp
            const reg = new RegExp(`(?:(?<![.\`%])\\b(${wordUp})\\b\\()|(?:"(${wordUp})")`, 'iu');
            return lineStr.match(reg)?.index;
        },
        Mode: EMode.ahkFunc,
    };

    const matchList: DeepReadonly<TRule[]> = [func];
    for (const { Mode, refFn } of matchList) {
        // eslint-disable-next-line no-await-in-loop
        const Location: vscode.Location[] | null = await ahkDef({
            document,
            position,
            Mode,
            wordUp,
            refFn,
            timeStart,
            listAllUsing,
        });
        if (Location !== null) return Location;
    }
    return null;
}

// Go to Definition (via F12 || Ctrl+Click)
// open the definition to the side with ( via Ctrl+Alt+Click )
// Peek Definition (via Alt+F12)
export class DefProvider implements vscode.DefinitionProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): Promise<null | vscode.Location | vscode.Location[]> {
        //  Definition | DefinitionLink[]
        // if (isPosAtStr(document, position)) return null;

        // eslint-disable-next-line security/detect-unsafe-regex
        const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
        if (range === undefined) return null;
        const wordUp: string = document.getText(range).toUpperCase();
        // const fileLink: vscode.Location | null = ahkInclude(document, position);
        // if (fileLink !== null) return fileLink;

        const listAllUsing = false;

        const userDefLink: vscode.Location[] | null = await userDefTopSymbol(document, position, wordUp, listAllUsing);
        if (userDefLink !== null) return userDefLink;

        const valInFunc: vscode.Location[] | null = getValDefInFunc(document, position, wordUp, listAllUsing);
        if (valInFunc !== null) return valInFunc;

        return null;
    }
}
