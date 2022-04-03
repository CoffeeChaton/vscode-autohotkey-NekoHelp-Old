import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { TAhkSymbol, TAhkSymbolList } from '../globalEnum';

type TStackNameSymbol = {
    readonly name: string;
    readonly ahkSymbol: TAhkSymbol;
};

type TStackPro = Readonly<{
    readonly isEnd: boolean;
    readonly deep: number;
    readonly stack: readonly TStackNameSymbol[];
}>;

function dfs(father: TAhkSymbolList, position: vscode.Position, StackPro: TStackPro): TStackPro {
    const { stack, isEnd, deep } = StackPro;
    for (const ch of father) {
        if (ch.range.contains(position)) {
            return dfs(ch.children, position, {
                stack: [
                    ...stack,
                    {
                        name: ch.name,
                        ahkSymbol: ch,
                    },
                ],
                isEnd, // Don't assign
                deep: deep + 1,
            });
        }
    }
    return {
        stack,
        isEnd: true,
        deep,
    };
}

export function getStack(document: vscode.TextDocument, position: vscode.Position): TStackPro | null {
    const AhkSymbolList: undefined | TAhkSymbolList = Detecter.getDocMap(document.uri.fsPath)?.AhkSymbolList;
    if (AhkSymbolList === undefined) return null;
    return dfs(AhkSymbolList, position, {
        stack: [],
        isEnd: false,
        deep: 0,
    });
}

export function getScopeOfPos(document: vscode.TextDocument, position: vscode.Position): vscode.Range | null {
    const stackPro = getStack(document, position);
    if (stackPro === null) return null;

    const { stack } = stackPro;
    if (stack.length === 0) return null;
    if (stack[0].ahkSymbol.kind === vscode.SymbolKind.Function) {
        return stackPro.stack[0].ahkSymbol.range;
    }

    let mayBeRange: vscode.Range | null = null;
    for (const { ahkSymbol } of stack) {
        if (ahkSymbol.kind === vscode.SymbolKind.Class || ahkSymbol.kind === vscode.SymbolKind.Method) {
            mayBeRange = ahkSymbol.range;
        } else {
            return mayBeRange;
        }
    }
    return mayBeRange;
}

export function getFnOfPos(document: vscode.TextDocument, position: vscode.Position): TAhkSymbol | null {
    const stackPro = getStack(document, position);
    if (stackPro === null) return null;

    const { stack } = stackPro;
    if (stack.length === 0) return null;
    if (stack[0].ahkSymbol.kind === vscode.SymbolKind.Function) {
        return stackPro.stack[0].ahkSymbol;
    }

    let ed: TAhkSymbol | null = null;
    for (const { ahkSymbol } of stack) {
        if (ahkSymbol.kind === vscode.SymbolKind.Class || ahkSymbol.kind === vscode.SymbolKind.Method) {
            ed = ahkSymbol;
        } else {
            return ed;
        }
    }
    return ed;
}
