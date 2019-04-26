// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Factor syntax highlight - simple mode
//
// by Dimage Sapelkin (https://github.com/kerabromsmu)

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("codemirror/lib/codemirror"), require("codemirror/addon/mode/simple"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["codemirror/lib/codemirror", "codemirror/addon/mode/simple"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    var WORD = /[\w$]+/, RANGE = 500;

  CodeMirror.registerHelper("hint", "anyword", function(editor, options) {
    var word = options && options.word || WORD;
    var range = options && options.range || RANGE;
    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
    var end = cur.ch, start = end;
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end);

    var list = options && options.list || [], seen = {};
    var re = new RegExp(word.source, "g");
    for (var dir = -1; dir <= 1; dir += 2) {
      var line = cur.line, endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
      for (; line != endLine; line += dir) {
        var text = editor.getLine(line), m;
        while (m = re.exec(text)) {
          if (line == cur.line && m[0] === curWord) continue;
          if ((!curWord || m[0].lastIndexOf(curWord, 0) == 0) && !Object.prototype.hasOwnProperty.call(seen, m[0])) {
            seen[m[0]] = true;
            list.push(m[0]);
          }
        }
      }
    }
    return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
  });

    CodeMirror.defineSimpleMode("tgs", {
        // The start state contains the rules that are intially used
        start: [
            {regex: /\/\/.*/, token: "comment"},
            {regex: /\/\*/, token: "comment", next: "comment"},
            {regex: /@[A-Za-z0-9-]+/, push: "script", token: "script-id"},
            {regex: /#[A-Za-z0-9-]+/, next: "block", token: "block-id"},
            {regex: /->|=>/, token: "keyword"}
        ],
        script: [
            {regex: /\/\/.*/, token: "comment"},
            { regex: /\{/, token: "operator", next: "scriptBlock"}
        ],
        scriptBlock: [
            { regex: /\/\/.*/, token: "comment" },
            { regex: /\/\*/, token: "comment", next: "comment" },
            { regex: /true|false/, token: "boolean" },
            { regex: /".*?"/, token: "string" },
            { regex: /[0-9]+/, token: "numeric"},
            { regex: /[A-Za-z0-9]+/, token: "variable" },
            { regex: /\}/, token: "operator", pop: true },
        ],
        block: [
            { regex: /@[A-Za-z0-9-]+/, push: "script", token: "script-id-b" },
            { regex: /\/\*/, token: "comment", next: "comment" },
            { regex: /%(?=[A-Za-z0-9]+%)/, token: "inblock", next: "inlineVariable" },
            { regex: /(?=#).*?/, next: "start" },
            { regex: /\*/, next: "link", token: "linkb"},
            { regex: /</, token: "block-inline-item", next: "styleEnum" },
            { regex: /\(\?/, token: "block-inline-item", next: "condition" }
        ],
        condition: [
            { regex: /(!=\)).*/, token: "block-inline-item"},
            { regex: /\)/, token: "block-inline-item", next: "block" }
        ],
        styleEnum: [
            { regex: /[A-Za-z0-9-]+/, token: "block-inline-item" },
            { regex: />/, token: "block-inline-item", next: "block" }
        ],
        inlineVariable: [
            { regex: /[A-Za-z0-9]+/, token: "variable-3" },
            { regex: /%/, token: "inblock", next: "block"}
        ],
        link: [
            { regex: /->|=>/, token: "linkb", next: "linkRef"}
        ],
        linkRef: [
            { regex: /[A-Za-z0-9-\/]+#[A-Za-z0-9-]+/, token: "linkref", next: "block" },
            { regex: /[A-Za-z0-9-\/]+/, token: "linkref", next: "block" },
            { regex: /#[A-Za-z0-9-]+/, token: "linkref-local", next: "block" }
        ],
        comment: [
            {regex: /.*\*\//, token: "comment", pop: true },
            {regex: /.*/, token: "comment"}
        ],
        meta: {
            dontIndentStates: ["comment"],
            lineComment: "//"
          }
    });
});