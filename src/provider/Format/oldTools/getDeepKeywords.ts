/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,4,-999] }] */
/* eslint-disable max-lines-per-function */
import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
import type { TBrackets } from '../../../tools/Bracket';

/**
 * // TODO
 * if()   <---not \s to (, but also is foc
 * while()
 */

const focSet: ReadonlySet<string> = new Set(
    // src/tools/Built-in/statement.data.ts
    [
        // 'BREAK', does not affect the next line
        // 'CASE', useSwitchCase
        'CATCH',
        // 'CONTINUE', does not affect the next line
        // 'CRITICAL', does not affect the next line
        // 'DEFAULT', useSwitchCase
        'ELSE',
        // 'EXIT', does not affect the next line
        // 'EXITAPP', does not affect the next line
        'FINALLY',
        'FOR',
        // 'GoSub',
        // 'GOTO',
        'IF',
        'IfEqual',
        'IfExist',
        'IfGreater',
        'IfGreaterOrEqual',
        'IfInString',
        'IfLess',
        'IfLessOrEqual',
        'IfMsgBox',
        'IfNotEqual',
        'IfNotExist',
        'IfNotInString',
        'IfWinActive',
        'IfWinExist',
        'IfWinNotActive',
        'IfWinNotExist',
        'LOOP',
        // 'RETURN', does not affect the next line
        // 'SWITCH', useSwitchCase
        // 'THROW', useSwitchCase
        'TRY',
        'WHILE',
        // 'UNTIL',
    ].map((s: string): string => s.toUpperCase()),
);

export type TOccObj = {
    lockDeepList: readonly number[],
    occ: number,
    status: string,
};

function forIfCase({ AhkTokenLine, matrixBrackets, oldOccObj }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    oldOccObj: TOccObj,
}): TOccObj {
    const { line } = AhkTokenLine;
    const { occ, lockDeepList } = oldOccObj;
    const tempLockList: number[] = [...lockDeepList];

    const ifBlockClose: boolean = matrixBrackets[line][2] === 0;

    /**
     * if (a ; <---------not close
     *  + b
     *  + c
     */
    if (!ifBlockClose) {
        return {
            ...oldOccObj,
            status: `if ( ,not close at ln ${line}`, // TODO
        };
    }

    /**
     * 99% case
     * if (a ); <---------close
     *
     * or
     * oldIf case
     */
    return {
        lockDeepList: tempLockList,
        occ: occ + 1,
        status: 'if () case',
    };
}

function addLock({ oldOccObj, AhkTokenLine }: {
    AhkTokenLine: TAhkTokenLine,
    oldOccObj: TOccObj,
}): readonly number[] {
    const tempLockList: number[] = [...oldOccObj.lockDeepList];
    tempLockList.push(AhkTokenLine.deep2.at(-1) ?? 0);

    return tempLockList;
}

function focOccDiff({ oldOccObj, AhkTokenLine }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    oldOccObj: TOccObj,
}): TOccObj {
    return {
        lockDeepList: [],
        occ: 0,
        status: 'occ -> 0',
    };
    // FIXME
    // const { occ, lockDeepList } = oldOccObj;

    // if (occ === 0 || lockDeepList.length === 0) { // happy path
    //     return {
    //         lockDeepList: [],
    //         occ: 0,
    //         status: 'occ -> 0',
    //     };
    // }

    // const tempLockList: number[] = [...lockDeepList];

    // const occDiff: number | undefined = tempLockList.pop();
    // if (occDiff === undefined || occDiff === 0) {
    //     return {
    //         lockDeepList: [],
    //         occ: 0,
    //         status: 'occ -> 0',
    //     };
    // }

    // const { line, deep2 } = AhkTokenLine;

    // return {
    //     lockDeepList: tempLockList,
    //     occ: 0, // FIXME:
    //     status: `occ-- at ln ${line}`,
    // };
}

function focElseCase({ AhkTokenLine, matrixBrackets, oldOccObj }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    oldOccObj: TOccObj,
}): TOccObj {
    const { lStr, fistWordUpCol } = AhkTokenLine;
    /**
     * 1. case like
     *     else Return "AA"
     *     else foo()
     * 2. not need to check end with '{' case
     *
     * 'else'.len is 4
     */
    const afterElseStr = lStr.slice(fistWordUpCol + 4)
        .replace(/^\s*,/u, '') // fix ----> "else," WTF?
        .trim();
    if (afterElseStr.length > 0) {
        // check start with 'if' case
        if ((/^if(?:\s|\()/iu).test(afterElseStr)) {
            return forIfCase({ AhkTokenLine, matrixBrackets, oldOccObj });
        }
        return focOccDiff({ AhkTokenLine, matrixBrackets, oldOccObj });
    }

    /**
     * else ;nothings <--- after else not any string
     */
    const { occ } = oldOccObj;
    return {
        lockDeepList: addLock({ oldOccObj, AhkTokenLine }),
        occ: occ + 1,
        status: 'else end with spec',
    };
}

export function getDeepKeywords({
    lStrTrim,
    oldOccObj,
    AhkTokenLine,
    matrixBrackets,
    DocStrMap,
}: {
    lStrTrim: string,
    oldOccObj: TOccObj,
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    DocStrMap: TTokenStream,
}): TOccObj {
    const { occ } = oldOccObj;

    const { fistWordUp, line } = AhkTokenLine;
    //  console.log(line, oldOccObj);
    if (focSet.has(fistWordUp)) {
        if (lStrTrim.endsWith('{')) return { ...oldOccObj }; // managed by curly braces
        const nextLine: TAhkTokenLine | undefined = DocStrMap.at(line + 1);
        if (nextLine === undefined) {
            return {
                lockDeepList: [],
                occ: 0,
                status: 'end of file',
            };
        }
        if (nextLine.lStr.trim().startsWith('{')) return { ...oldOccObj }; // managed by curly braces

        if (fistWordUp === 'IF') return forIfCase({ AhkTokenLine, matrixBrackets, oldOccObj });
        if (fistWordUp === 'ELSE') return focElseCase({ AhkTokenLine, matrixBrackets, oldOccObj });

        // other key word
        return {
            lockDeepList: addLock({ oldOccObj, AhkTokenLine }),
            occ: occ + 1,
            status: `other key word+ "${fistWordUp}"`,
        };
    }

    const nextLine: TAhkTokenLine | undefined = DocStrMap.at(line + 1);
    if (nextLine === undefined) {
        return {
            lockDeepList: [],
            occ: 0,
            status: 'end of file part2',
        };
    }
    if (nextLine.multilineFlag !== null) {
        return { ...oldOccObj }; // managed by multiline
    }

    const { cll } = AhkTokenLine;
    if (cll === 1) {
        return { ...oldOccObj };
    }

    return focOccDiff({ AhkTokenLine, matrixBrackets, oldOccObj });
}

// FIXME fmt
// IfNotExist, %AhkScript%
//     if !iOption
//         Util_Error((IsFirstScript ? "Script" : "#include") " file cannot be opened.", 0x32, """" AhkScript """")
//     else return
// ;---end----
