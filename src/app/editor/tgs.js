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

    CodeMirror.defineSimpleMode("tgs", {
        // The start state contains the rules that are intially used
        start: [
            {regex: /#[A-Za-z0-9]+/, token: "keyword"}
        ],
        typedObject: [
            {regex: /[A-Za-z0-9]+\s*:/, token: "property", push: "group"}
        ],
        group: [
            //{regex: /{/, push: "group", token: "variable"},
            {regex: /#[A-Za-z0-9]+/, push: "typedObject", token: "keyword"},
            {regex: /@[A-Za-z0-9]+/, push: "script", token: "variable-3"},
            {token: "attribute", push: "attributesList"}
        ],
        attributesList: [
            {regex: /,/, push: "attributesList"},
            {regex: /#[A-Za-z0-9]+/, push: "typedObject", token: "keyword"},
            {regex: /@[A-Za-z0-9]+/, push: "script", token: "variable-3"},
            {regex: /[A-Za-z0-9]+\s*:/, token: "property", push: "attributesList"},
            {regex: /(?=[A-Za-z0-9]+\s*\(\s*[A-Za-z0-9_-]+\s*\))/, push: "objectSelector"},
            {regex: /(?=[A-Za-z0-9]+\s*->\s*[A-Za-z0-9]+)/, push: "graphLink"},
            {regex: /-?[0-9]+(?:\.[0-9]*)?/, token: "number"},
            {regex: /"[A-Za-z0-9\/._\-]+"/, token: "string"},
            {regex: /true|false/, token: "number"},
            {regex: /[A-Za-z0-9\/._]+/, token: "variable"}

        ],
        graphLink: [
            {regex: /[A-Za-z0-9]+/, token: "variable"},
            {regex: /->/, token: "operator", pop: true}
        ],
        objectSelector: [
            {regex: /[A-Za-z0-9]+/, token: "atom", next: "objectSelectorArgument"}
        ],
        objectSelectorArgument: [
            {regex: /[A-Za-z0-9]+/, token: "variable", pop: true}
        ],
        script: [
            {regex: /}/, push: "group"},
            {regex: /listen/, token: "keyword", next: "listen"},
            {regex: /(?=[A-Za-z0-9]+[ ]+[A-Za-z0-9_-]+[ ]*>[ ]*)/, push: "actionOnObject"}
        ],
        listen: [
            {regex: /[A-Za-z0-9]+/, token: "variable", next: "script"}
        ],
        actionOnObject: [
            {regex: /[A-Za-z0-9_]+/, token: "atom", push: "objectName"}
        ],
        objectName: [
            {regex: /[A-Za-z0-9_]+/, token: "variable", next: "action"}
        ],
        action: [
            {regex: />/, token: "operator", next: "action"},
            {regex: /[A-Za-z0-9"]+[ ]*$/, token: "", push: "script"},
            {regex: /[A-Za-z0-9"]+/, token: "", push: "actionArgs"}
        ],
        actionArgs: [
            {regex: /[A-Za-z0-9]+[ ]*$/, token: "string", next: "script"},
            {regex: /[A-Za-z0-9]+/, next: "actionArgs"}
        ]
    });
});