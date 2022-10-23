import { spiltCommandAll } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

export type TVarData = {
    rawName: string;
    ch: number;
};

function isLookLikeVar(rawName: string): boolean {
    return !(
        !(/^\w+$/u).test(rawName)
        || (/^_+$/u).test(rawName) // str
        || (/^\d+$/u).test(rawName) // just number
        || (/^0X[\dA-F]+$/ui).test(rawName) // NumHexConst = 0 x [0-9a-fA-F]+
    );
}

/**
 * A1: "{"
 * A2 : "["
 * A3: "("
 */
export type TBrackets = [number, number, number];

type TMap = ReadonlyMap<string, readonly [0 | 1 | 2, -1 | 1]>;

const BracketMap: TMap = new Map([
    ['{', [0, +1]],
    ['}', [0, -1]],
    ['[', [1, +1]],
    [']', [1, -1]],
    ['(', [2, +1]],
    [')', [2, -1]],
]);

function matchStr(RawNameNew: string, list: TBrackets): TBrackets {
    const newBrackets: TBrackets = [...list];

    for (const str of RawNameNew) {
        const config = BracketMap.get(str);
        if (config !== undefined) {
            newBrackets[config[0]] += config[1];
        }
    }

    return newBrackets;
}

type TVarDataResult = {
    varDataList: TVarData[];
    Brackets: TBrackets;
};

/**
 * ```ahk
 * static li := {btn: {oc:1, ari:2, ync:3, yn:4, rc:5, ctc:6}, ico: {"x":16, "?":32, "!":48, "i":64}},b9,c5
 *
 * li,b9,c5 is variable
 * ```
 */
export function varMixedAnnouncement(strF: string, BracketsRaw: TBrackets): TVarDataResult {
    const varDataList: TVarData[] = [];

    let Brackets: TBrackets = [...BracketsRaw];
    for (const { RawNameNew, lPos } of spiltCommandAll(strF)) {
        Brackets = matchStr(RawNameNew, Brackets);

        if (RawNameNew.includes(':=')) {
            for (const ma of RawNameNew.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gui)) {
                const rawName: string = ma[1].trim();
                if (isLookLikeVar(rawName)) {
                    varDataList.push({
                        rawName,
                        ch: lPos + RawNameNew.indexOf(rawName, ma.index),
                    });
                }
            }
        } else if (Brackets[0] === 0 && Brackets[1] === 0 && Brackets[2] === 0) {
            const rawName: string = RawNameNew.trim();
            if (isLookLikeVar(rawName)) {
                varDataList.push({
                    rawName,
                    ch: lPos + RawNameNew.indexOf(rawName),
                });
            }
        }
    }

    return {
        varDataList,
        Brackets,
    };
}
