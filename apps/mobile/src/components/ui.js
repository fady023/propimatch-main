"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
exports.Input = Input;
exports.Card = Card;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_native_1 = require("react-native");
function Button(_a) {
    var title = _a.title, onPress = _a.onPress, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b;
    var base = 'items-center justify-center rounded-xl px-4 py-3';
    var map = {
        primary: 'bg-[#0E5D6C]',
        outline: 'border border-[#1F2B33]',
        ghost: ''
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: onPress, className: "".concat(base, " ").concat(map[variant]), children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { className: "text-white", children: title }) }));
}
function Input(_a) {
    var placeholder = _a.placeholder, value = _a.value, onChangeText = _a.onChangeText;
    return ((0, jsx_runtime_1.jsx)(react_native_1.TextInput, { placeholder: placeholder, placeholderTextColor: "#6b7f87", value: value, onChangeText: onChangeText, className: "rounded-xl border border-[#1F2B33] bg-[#101A1F] px-4 py-3 text-white" }));
}
function Card(_a) {
    var _b;
    var children = _a.children, props = __rest(_a, ["children"]);
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, __assign({}, props, { className: "rounded-2xl border border-[#1F2B33] bg-[#101A1F] ".concat((_b = props.className) !== null && _b !== void 0 ? _b : ''), children: children })));
}
