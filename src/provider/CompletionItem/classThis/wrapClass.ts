import * as vscode from 'vscode';
import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { TTokenStream } from '../../../globalEnum';
import { getObjChapterArr } from '../../../tools/Obj/getObjChapterArr';
import { getUserDefTopClassSymbol } from './getUserDefTopClassSymbol';
import { headIsThis } from './headIsThis';
import { RefClassWithName } from './RefClassWithName';
import { valTrack } from './valTrack';

function getAhkTokenList(
    position: vscode.Position,
    DocStrMap: TTokenStream,
    DA: null | CAhkFunc,
): TTokenStream {
    const varSearchStartLine: number = (DA === null)
        ? 0
        : DA.selectionRange.end.line;

    return DocStrMap.slice(
        varSearchStartLine,
        position.line,
    );
}

function findClassDef(
    position: vscode.Position,
    ChapterArr: readonly string[],
    topSymbol: TTopSymbol | null,
    DocStrMap: TTokenStream,
    DA: null | CAhkFunc,
): vscode.CompletionItem[] {
    const Head: string = ChapterArr[0];
    if ((/^this$/iu).test(Head)) return headIsThis(topSymbol, ChapterArr);

    const classSymbol: CAhkClass | null = getUserDefTopClassSymbol(Head.toUpperCase());
    if (classSymbol !== null) return RefClassWithName(ChapterArr, classSymbol);

    // a := new ClassName
    // a.  ;<---
    const AhkTokenList: TTokenStream = getAhkTokenList(position, DocStrMap, DA);
    return valTrack(ChapterArr, AhkTokenList);
}

// eslint-disable-next-line max-params
export function wrapClass(
    position: vscode.Position,
    textRaw: string,
    lStr: string,
    topSymbol: TTopSymbol | null,
    DocStrMap: TTokenStream,
    DA: null | CAhkFunc,
): vscode.CompletionItem[] {
    const col = position.character;
    if (col > lStr.length) return [];

    // a.b.c.d. ;<---
    // ['a', 'b', 'c', 'd']
    const ChapterArr: readonly string[] | null = getObjChapterArr(textRaw, col);
    return ChapterArr === null
        ? []
        : findClassDef(position, ChapterArr, topSymbol, DocStrMap, DA);
}
