export function hasDoubleSemicolon(textFix: string): boolean {
    return textFix.includes('::');
}

/*
```ahk
::t3{{::
    SendRaw, { testC
Return

::t4}}::{{{{{{}}}}}}

::t5(((::
    SendRaw, t5 (((((
    SendRaw, t6 }}}}
Return
```
*/
