"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _immutable = require("immutable");

var _errors = require("./errors");

var _bindingMap = require("./binding-map");

var _bindingMap2 = _interopRequireDefault(_bindingMap);

var _ramdaFantasy = require("ramda-fantasy");

var _ramda = require("ramda");

var _ = _interopRequireWildcard(_ramda);

var _tokenizer = require("shift-parser/dist/tokenizer");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Just_643 = _ramdaFantasy.Maybe.Just;
var Nothing_644 = _ramdaFantasy.Maybe.Nothing;

function sizeDecending_645(a_646, b_647) {
  if (a_646.scopes.size > b_647.scopes.size) {
    return -1;
  } else if (b_647.scopes.size > a_646.scopes.size) {
    return 1;
  } else {
    return 0;
  }
}

var Syntax = (function () {
  function Syntax(token_648) {
    var context_649 = arguments.length <= 1 || arguments[1] === undefined ? { bindings: new _bindingMap2.default(), scopeset: (0, _immutable.List)() } : arguments[1];

    _classCallCheck(this, Syntax);

    this.token = token_648;
    this.context = { bindings: context_649.bindings, scopeset: context_649.scopeset };
    Object.freeze(this.context);
    Object.freeze(this);
  }

  _createClass(Syntax, [{
    key: "resolve",
    value: function resolve() {
      if (this.context.scopeset.size === 0 || !(this.isIdentifier() || this.isKeyword())) {
        return this.token.value;
      }
      var scope_677 = this.context.scopeset.last();
      var stxScopes_678 = this.context.scopeset;
      var bindings_679 = this.context.bindings;
      if (scope_677) {
        var scopesetBindingList = bindings_679.get(this);
        if (scopesetBindingList) {
          var biggestBindingPair = scopesetBindingList.filter(function (_ref) {
            var scopes = _ref.scopes;
            var binding = _ref.binding;

            return scopes.isSubset(stxScopes_678);
          }).sort(sizeDecending_645);
          if (biggestBindingPair.size >= 2 && biggestBindingPair.get(0).scopes.size === biggestBindingPair.get(1).scopes.size) {
            var debugBase = "{" + stxScopes_678.map(function (s_680) {
              return s_680.toString();
            }).join(", ") + "}";
            var debugAmbigousScopesets = biggestBindingPair.map(function (_ref2) {
              var scopes = _ref2.scopes;

              return "{" + scopes.map(function (s_681) {
                return s_681.toString();
              }).join(", ") + "}";
            }).join(", ");
            throw new Error("Scopeset " + debugBase + " has ambiguous subsets " + debugAmbigousScopesets);
          } else if (biggestBindingPair.size !== 0) {
            var bindingStr = biggestBindingPair.get(0).binding.toString();
            if (_ramdaFantasy.Maybe.isJust(biggestBindingPair.get(0).alias)) {
              return biggestBindingPair.get(0).alias.getOrElse(null).resolve();
            }
            return bindingStr;
          }
        }
      }
      return this.token.value;
    }
  }, {
    key: "val",
    value: function val() {
      (0, _errors.assert)(!this.isDelimiter(), "cannot get the val of a delimiter");
      if (this.isStringLiteral()) {
        return this.token.str;
      }
      if (this.isTemplate()) {
        return this.token.items.map(function (el_682) {
          if (el_682 instanceof Syntax && el_682.isDelimiter()) {
            return "${...}";
          }
          return el_682.slice.text;
        }).join("");
      }
      return this.token.value;
    }
  }, {
    key: "lineNumber",
    value: function lineNumber() {
      if (!this.isDelimiter()) {
        return this.token.slice.startLocation.line;
      } else {
        return this.token.get(0).lineNumber();
      }
    }
  }, {
    key: "inner",
    value: function inner() {
      (0, _errors.assert)(this.isDelimiter(), "can only get the inner of a delimiter");
      return this.token.slice(1, this.token.size - 1);
    }
  }, {
    key: "addScope",
    value: function addScope(scope_683, bindings_684) {
      var options_685 = arguments.length <= 2 || arguments[2] === undefined ? { flip: false } : arguments[2];

      var token_686 = this.isDelimiter() ? this.token.map(function (s_688) {
        return s_688.addScope(scope_683, bindings_684, options_685);
      }) : this.token;
      if (this.isTemplate()) {
        token_686 = { type: this.token.type, items: token_686.items.map(function (it_689) {
            if (it_689 instanceof Syntax && it_689.isDelimiter()) {
              return it_689.addScope(scope_683, bindings_684, options_685);
            }
            return it_689;
          }) };
      }
      var newScopeset_687 = undefined;
      if (options_685.flip) {
        var index = this.context.scopeset.indexOf(scope_683);
        if (index !== -1) {
          newScopeset_687 = this.context.scopeset.remove(index);
        } else {
          newScopeset_687 = this.context.scopeset.push(scope_683);
        }
      } else {
        newScopeset_687 = this.context.scopeset.push(scope_683);
      }
      return new Syntax(token_686, { bindings: bindings_684, scopeset: newScopeset_687 });
    }
  }, {
    key: "removeScope",
    value: function removeScope(scope_690) {
      var token_691 = this.isDelimiter() ? this.token.map(function (s_694) {
        return s_694.removeScope(scope_690);
      }) : this.token;
      var newScopeset_692 = this.context.scopeset;
      var index_693 = this.context.scopeset.indexOf(scope_690);
      if (index_693 !== -1) {
        newScopeset_692 = this.context.scopeset.remove(index_693);
      }
      return new Syntax(token_691, { bindings: this.context.bindings, scopeset: newScopeset_692 });
    }
  }, {
    key: "isIdentifier",
    value: function isIdentifier() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.Ident;
    }
  }, {
    key: "isAssign",
    value: function isAssign() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.ASSIGN;
    }
  }, {
    key: "isBooleanLiteral",
    value: function isBooleanLiteral() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.TRUE || this.token.type === _tokenizer.TokenType.FALSE;
    }
  }, {
    key: "isKeyword",
    value: function isKeyword() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.Keyword;
    }
  }, {
    key: "isNullLiteral",
    value: function isNullLiteral() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.NULL;
    }
  }, {
    key: "isNumericLiteral",
    value: function isNumericLiteral() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.NumericLiteral;
    }
  }, {
    key: "isPunctuator",
    value: function isPunctuator() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.Punctuator;
    }
  }, {
    key: "isStringLiteral",
    value: function isStringLiteral() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.StringLiteral;
    }
  }, {
    key: "isRegularExpression",
    value: function isRegularExpression() {
      return !this.isDelimiter() && this.token.type.klass === _tokenizer.TokenClass.RegularExpression;
    }
  }, {
    key: "isTemplate",
    value: function isTemplate() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.TEMPLATE;
    }
  }, {
    key: "isDelimiter",
    value: function isDelimiter() {
      return _immutable.List.isList(this.token);
    }
  }, {
    key: "isParens",
    value: function isParens() {
      return this.isDelimiter() && this.token.get(0).token.type === _tokenizer.TokenType.LPAREN;
    }
  }, {
    key: "isBraces",
    value: function isBraces() {
      return this.isDelimiter() && this.token.get(0).token.type === _tokenizer.TokenType.LBRACE;
    }
  }, {
    key: "isBrackets",
    value: function isBrackets() {
      return this.isDelimiter() && this.token.get(0).token.type === _tokenizer.TokenType.LBRACK;
    }
  }, {
    key: "isSyntaxTemplate",
    value: function isSyntaxTemplate() {
      return this.isDelimiter() && this.token.get(0).val() === "#`";
    }
  }, {
    key: "isEOF",
    value: function isEOF() {
      return !this.isDelimiter() && this.token.type === _tokenizer.TokenType.EOS;
    }
  }, {
    key: "toString",
    value: function toString() {
      if (this.isDelimiter()) {
        return this.token.map(function (s_695) {
          return s_695.toString();
        }).join(" ");
      }
      if (this.isStringLiteral()) {
        return "'" + this.token.str;
      }
      if (this.isTemplate()) {
        return this.val();
      }
      return this.token.value;
    }
  }], [{
    key: "of",
    value: function of(token_650) {
      var stx_651 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax(token_650, stx_651.context);
    }
  }, {
    key: "fromNull",
    value: function fromNull() {
      var stx_652 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return new Syntax({ type: _tokenizer.TokenType.NULL, value: null }, stx_652.context);
    }
  }, {
    key: "fromNumber",
    value: function fromNumber(value_653) {
      var stx_654 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: _tokenizer.TokenType.NUMBER, value: value_653 }, stx_654.context);
    }
  }, {
    key: "fromString",
    value: function fromString(value_655) {
      var stx_656 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: _tokenizer.TokenType.STRING, str: value_655 }, stx_656.context);
    }
  }, {
    key: "fromPunctuator",
    value: function fromPunctuator(value_657) {
      var stx_658 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: { klass: _tokenizer.TokenClass.Punctuator, name: value_657 }, value: value_657 }, stx_658.context);
    }
  }, {
    key: "fromKeyword",
    value: function fromKeyword(value_659) {
      var stx_660 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: { klass: _tokenizer.TokenClass.Keyword, name: value_659 }, value: value_659 }, stx_660.context);
    }
  }, {
    key: "fromIdentifier",
    value: function fromIdentifier(value_661) {
      var stx_662 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: _tokenizer.TokenType.IDENTIFIER, value: value_661 }, stx_662.context);
    }
  }, {
    key: "fromRegularExpression",
    value: function fromRegularExpression(value_663) {
      var stx_664 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return new Syntax({ type: _tokenizer.TokenType.REGEXP, value: value_663 }, stx_664.context);
    }
  }, {
    key: "fromBraces",
    value: function fromBraces(inner_665) {
      var stx_666 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var left_667 = new Syntax({ type: _tokenizer.TokenType.LBRACE, value: "{" });
      var right_668 = new Syntax({ type: _tokenizer.TokenType.RBRACE, value: "}" });
      return new Syntax(_immutable.List.of(left_667).concat(inner_665).push(right_668), stx_666.context);
    }
  }, {
    key: "fromBrackets",
    value: function fromBrackets(inner_669) {
      var stx_670 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var left_671 = new Syntax({ type: _tokenizer.TokenType.LBRACK, value: "[" });
      var right_672 = new Syntax({ type: _tokenizer.TokenType.RBRACK, value: "]" });
      return new Syntax(_immutable.List.of(left_671).concat(inner_669).push(right_672), stx_670.context);
    }
  }, {
    key: "fromParens",
    value: function fromParens(inner_673) {
      var stx_674 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var left_675 = new Syntax({ type: _tokenizer.TokenType.LPAREN, value: "(" });
      var right_676 = new Syntax({ type: _tokenizer.TokenType.RPAREN, value: ")" });
      return new Syntax(_immutable.List.of(left_675).concat(inner_673).push(right_676), stx_674.context);
    }
  }]);

  return Syntax;
})();

exports.default = Syntax;
//# sourceMappingURL=data:application/json;base64,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QUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN6Rjs7OytCQUNpQixTQUFTLEVBQWdCO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUN2QyxVQUFJLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFDLElBQUksRUFBRSxxQkFBVSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUM7QUFDaEUsVUFBSSxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUscUJBQVUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO0FBQ2pFLGFBQU8sSUFBSSxNQUFNLENBQUMsZ0JBQUssRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3pGOzs7U0E3Q2tCLE1BQU07OztrQkFBTixNQUFNIiwiZmlsZSI6InN5bnRheC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IHthc3NlcnR9IGZyb20gXCIuL2Vycm9yc1wiO1xuaW1wb3J0IEJpbmRpbmdNYXAgZnJvbSBcIi4vYmluZGluZy1tYXBcIjtcbmltcG9ydCB7TWF5YmV9IGZyb20gXCJyYW1kYS1mYW50YXN5XCI7XG5pbXBvcnQgICogYXMgXyBmcm9tIFwicmFtZGFcIjtcbmNvbnN0IEp1c3RfNjQzID0gTWF5YmUuSnVzdDtcbmNvbnN0IE5vdGhpbmdfNjQ0ID0gTWF5YmUuTm90aGluZztcbmltcG9ydCB7VG9rZW5UeXBlLCBUb2tlbkNsYXNzfSBmcm9tIFwic2hpZnQtcGFyc2VyL2Rpc3QvdG9rZW5pemVyXCI7XG5mdW5jdGlvbiBzaXplRGVjZW5kaW5nXzY0NShhXzY0NiwgYl82NDcpIHtcbiAgaWYgKGFfNjQ2LnNjb3Blcy5zaXplID4gYl82NDcuc2NvcGVzLnNpemUpIHtcbiAgICByZXR1cm4gLTE7XG4gIH0gZWxzZSBpZiAoYl82NDcuc2NvcGVzLnNpemUgPiBhXzY0Ni5zY29wZXMuc2l6ZSkge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAwO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeW50YXgge1xuICBjb25zdHJ1Y3Rvcih0b2tlbl82NDgsIGNvbnRleHRfNjQ5ID0ge2JpbmRpbmdzOiBuZXcgQmluZGluZ01hcCwgc2NvcGVzZXQ6IExpc3QoKX0pIHtcbiAgICB0aGlzLnRva2VuID0gdG9rZW5fNjQ4O1xuICAgIHRoaXMuY29udGV4dCA9IHtiaW5kaW5nczogY29udGV4dF82NDkuYmluZGluZ3MsIHNjb3Blc2V0OiBjb250ZXh0XzY0OS5zY29wZXNldH07XG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzLmNvbnRleHQpO1xuICAgIE9iamVjdC5mcmVlemUodGhpcyk7XG4gIH1cbiAgc3RhdGljIG9mKHRva2VuXzY1MCwgc3R4XzY1MSA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBTeW50YXgodG9rZW5fNjUwLCBzdHhfNjUxLmNvbnRleHQpO1xuICB9XG4gIHN0YXRpYyBmcm9tTnVsbChzdHhfNjUyID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFN5bnRheCh7dHlwZTogVG9rZW5UeXBlLk5VTEwsIHZhbHVlOiBudWxsfSwgc3R4XzY1Mi5jb250ZXh0KTtcbiAgfVxuICBzdGF0aWMgZnJvbU51bWJlcih2YWx1ZV82NTMsIHN0eF82NTQgPSB7fSkge1xuICAgIHJldHVybiBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuTlVNQkVSLCB2YWx1ZTogdmFsdWVfNjUzfSwgc3R4XzY1NC5jb250ZXh0KTtcbiAgfVxuICBzdGF0aWMgZnJvbVN0cmluZyh2YWx1ZV82NTUsIHN0eF82NTYgPSB7fSkge1xuICAgIHJldHVybiBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuU1RSSU5HLCBzdHI6IHZhbHVlXzY1NX0sIHN0eF82NTYuY29udGV4dCk7XG4gIH1cbiAgc3RhdGljIGZyb21QdW5jdHVhdG9yKHZhbHVlXzY1Nywgc3R4XzY1OCA9IHt9KSB7XG4gICAgcmV0dXJuIG5ldyBTeW50YXgoe3R5cGU6IHtrbGFzczogVG9rZW5DbGFzcy5QdW5jdHVhdG9yLCBuYW1lOiB2YWx1ZV82NTd9LCB2YWx1ZTogdmFsdWVfNjU3fSwgc3R4XzY1OC5jb250ZXh0KTtcbiAgfVxuICBzdGF0aWMgZnJvbUtleXdvcmQodmFsdWVfNjU5LCBzdHhfNjYwID0ge30pIHtcbiAgICByZXR1cm4gbmV3IFN5bnRheCh7dHlwZToge2tsYXNzOiBUb2tlbkNsYXNzLktleXdvcmQsIG5hbWU6IHZhbHVlXzY1OX0sIHZhbHVlOiB2YWx1ZV82NTl9LCBzdHhfNjYwLmNvbnRleHQpO1xuICB9XG4gIHN0YXRpYyBmcm9tSWRlbnRpZmllcih2YWx1ZV82NjEsIHN0eF82NjIgPSB7fSkge1xuICAgIHJldHVybiBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuSURFTlRJRklFUiwgdmFsdWU6IHZhbHVlXzY2MX0sIHN0eF82NjIuY29udGV4dCk7XG4gIH1cbiAgc3RhdGljIGZyb21SZWd1bGFyRXhwcmVzc2lvbih2YWx1ZV82NjMsIHN0eF82NjQgPSB7fSkge1xuICAgIHJldHVybiBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuUkVHRVhQLCB2YWx1ZTogdmFsdWVfNjYzfSwgc3R4XzY2NC5jb250ZXh0KTtcbiAgfVxuICBzdGF0aWMgZnJvbUJyYWNlcyhpbm5lcl82NjUsIHN0eF82NjYgPSB7fSkge1xuICAgIGxldCBsZWZ0XzY2NyA9IG5ldyBTeW50YXgoe3R5cGU6IFRva2VuVHlwZS5MQlJBQ0UsIHZhbHVlOiBcIntcIn0pO1xuICAgIGxldCByaWdodF82NjggPSBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuUkJSQUNFLCB2YWx1ZTogXCJ9XCJ9KTtcbiAgICByZXR1cm4gbmV3IFN5bnRheChMaXN0Lm9mKGxlZnRfNjY3KS5jb25jYXQoaW5uZXJfNjY1KS5wdXNoKHJpZ2h0XzY2OCksIHN0eF82NjYuY29udGV4dCk7XG4gIH1cbiAgc3RhdGljIGZyb21CcmFja2V0cyhpbm5lcl82NjksIHN0eF82NzAgPSB7fSkge1xuICAgIGxldCBsZWZ0XzY3MSA9IG5ldyBTeW50YXgoe3R5cGU6IFRva2VuVHlwZS5MQlJBQ0ssIHZhbHVlOiBcIltcIn0pO1xuICAgIGxldCByaWdodF82NzIgPSBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuUkJSQUNLLCB2YWx1ZTogXCJdXCJ9KTtcbiAgICByZXR1cm4gbmV3IFN5bnRheChMaXN0Lm9mKGxlZnRfNjcxKS5jb25jYXQoaW5uZXJfNjY5KS5wdXNoKHJpZ2h0XzY3MiksIHN0eF82NzAuY29udGV4dCk7XG4gIH1cbiAgc3RhdGljIGZyb21QYXJlbnMoaW5uZXJfNjczLCBzdHhfNjc0ID0ge30pIHtcbiAgICBsZXQgbGVmdF82NzUgPSBuZXcgU3ludGF4KHt0eXBlOiBUb2tlblR5cGUuTFBBUkVOLCB2YWx1ZTogXCIoXCJ9KTtcbiAgICBsZXQgcmlnaHRfNjc2ID0gbmV3IFN5bnRheCh7dHlwZTogVG9rZW5UeXBlLlJQQVJFTiwgdmFsdWU6IFwiKVwifSk7XG4gICAgcmV0dXJuIG5ldyBTeW50YXgoTGlzdC5vZihsZWZ0XzY3NSkuY29uY2F0KGlubmVyXzY3MykucHVzaChyaWdodF82NzYpLCBzdHhfNjc0LmNvbnRleHQpO1xuICB9XG4gIHJlc29sdmUoKSB7XG4gICAgaWYgKHRoaXMuY29udGV4dC5zY29wZXNldC5zaXplID09PSAwIHx8ICEodGhpcy5pc0lkZW50aWZpZXIoKSB8fCB0aGlzLmlzS2V5d29yZCgpKSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW4udmFsdWU7XG4gICAgfVxuICAgIGxldCBzY29wZV82NzcgPSB0aGlzLmNvbnRleHQuc2NvcGVzZXQubGFzdCgpO1xuICAgIGxldCBzdHhTY29wZXNfNjc4ID0gdGhpcy5jb250ZXh0LnNjb3Blc2V0O1xuICAgIGxldCBiaW5kaW5nc182NzkgPSB0aGlzLmNvbnRleHQuYmluZGluZ3M7XG4gICAgaWYgKHNjb3BlXzY3Nykge1xuICAgICAgbGV0IHNjb3Blc2V0QmluZGluZ0xpc3QgPSBiaW5kaW5nc182NzkuZ2V0KHRoaXMpO1xuICAgICAgaWYgKHNjb3Blc2V0QmluZGluZ0xpc3QpIHtcbiAgICAgICAgbGV0IGJpZ2dlc3RCaW5kaW5nUGFpciA9IHNjb3Blc2V0QmluZGluZ0xpc3QuZmlsdGVyKCh7c2NvcGVzLCBiaW5kaW5nfSkgPT4ge1xuICAgICAgICAgIHJldHVybiBzY29wZXMuaXNTdWJzZXQoc3R4U2NvcGVzXzY3OCk7XG4gICAgICAgIH0pLnNvcnQoc2l6ZURlY2VuZGluZ182NDUpO1xuICAgICAgICBpZiAoYmlnZ2VzdEJpbmRpbmdQYWlyLnNpemUgPj0gMiAmJiBiaWdnZXN0QmluZGluZ1BhaXIuZ2V0KDApLnNjb3Blcy5zaXplID09PSBiaWdnZXN0QmluZGluZ1BhaXIuZ2V0KDEpLnNjb3Blcy5zaXplKSB7XG4gICAgICAgICAgbGV0IGRlYnVnQmFzZSA9IFwie1wiICsgc3R4U2NvcGVzXzY3OC5tYXAoc182ODAgPT4gc182ODAudG9TdHJpbmcoKSkuam9pbihcIiwgXCIpICsgXCJ9XCI7XG4gICAgICAgICAgbGV0IGRlYnVnQW1iaWdvdXNTY29wZXNldHMgPSBiaWdnZXN0QmluZGluZ1BhaXIubWFwKCh7c2NvcGVzfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFwie1wiICsgc2NvcGVzLm1hcChzXzY4MSA9PiBzXzY4MS50b1N0cmluZygpKS5qb2luKFwiLCBcIikgKyBcIn1cIjtcbiAgICAgICAgICB9KS5qb2luKFwiLCBcIik7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2NvcGVzZXQgXCIgKyBkZWJ1Z0Jhc2UgKyBcIiBoYXMgYW1iaWd1b3VzIHN1YnNldHMgXCIgKyBkZWJ1Z0FtYmlnb3VzU2NvcGVzZXRzKTtcbiAgICAgICAgfSBlbHNlIGlmIChiaWdnZXN0QmluZGluZ1BhaXIuc2l6ZSAhPT0gMCkge1xuICAgICAgICAgIGxldCBiaW5kaW5nU3RyID0gYmlnZ2VzdEJpbmRpbmdQYWlyLmdldCgwKS5iaW5kaW5nLnRvU3RyaW5nKCk7XG4gICAgICAgICAgaWYgKE1heWJlLmlzSnVzdChiaWdnZXN0QmluZGluZ1BhaXIuZ2V0KDApLmFsaWFzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGJpZ2dlc3RCaW5kaW5nUGFpci5nZXQoMCkuYWxpYXMuZ2V0T3JFbHNlKG51bGwpLnJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGJpbmRpbmdTdHI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9rZW4udmFsdWU7XG4gIH1cbiAgdmFsKCkge1xuICAgIGFzc2VydCghdGhpcy5pc0RlbGltaXRlcigpLCBcImNhbm5vdCBnZXQgdGhlIHZhbCBvZiBhIGRlbGltaXRlclwiKTtcbiAgICBpZiAodGhpcy5pc1N0cmluZ0xpdGVyYWwoKSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW4uc3RyO1xuICAgIH1cbiAgICBpZiAodGhpcy5pc1RlbXBsYXRlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnRva2VuLml0ZW1zLm1hcChlbF82ODIgPT4ge1xuICAgICAgICBpZiAoZWxfNjgyIGluc3RhbmNlb2YgU3ludGF4ICYmIGVsXzY4Mi5pc0RlbGltaXRlcigpKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJHsuLi59XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsXzY4Mi5zbGljZS50ZXh0O1xuICAgICAgfSkuam9pbihcIlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9rZW4udmFsdWU7XG4gIH1cbiAgbGluZU51bWJlcigpIHtcbiAgICBpZiAoIXRoaXMuaXNEZWxpbWl0ZXIoKSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9rZW4uc2xpY2Uuc3RhcnRMb2NhdGlvbi5saW5lO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50b2tlbi5nZXQoMCkubGluZU51bWJlcigpO1xuICAgIH1cbiAgfVxuICBpbm5lcigpIHtcbiAgICBhc3NlcnQodGhpcy5pc0RlbGltaXRlcigpLCBcImNhbiBvbmx5IGdldCB0aGUgaW5uZXIgb2YgYSBkZWxpbWl0ZXJcIik7XG4gICAgcmV0dXJuIHRoaXMudG9rZW4uc2xpY2UoMSwgdGhpcy50b2tlbi5zaXplIC0gMSk7XG4gIH1cbiAgYWRkU2NvcGUoc2NvcGVfNjgzLCBiaW5kaW5nc182ODQsIG9wdGlvbnNfNjg1ID0ge2ZsaXA6IGZhbHNlfSkge1xuICAgIGxldCB0b2tlbl82ODYgPSB0aGlzLmlzRGVsaW1pdGVyKCkgPyB0aGlzLnRva2VuLm1hcChzXzY4OCA9PiBzXzY4OC5hZGRTY29wZShzY29wZV82ODMsIGJpbmRpbmdzXzY4NCwgb3B0aW9uc182ODUpKSA6IHRoaXMudG9rZW47XG4gICAgaWYgKHRoaXMuaXNUZW1wbGF0ZSgpKSB7XG4gICAgICB0b2tlbl82ODYgPSB7dHlwZTogdGhpcy50b2tlbi50eXBlLCBpdGVtczogdG9rZW5fNjg2Lml0ZW1zLm1hcChpdF82ODkgPT4ge1xuICAgICAgICBpZiAoaXRfNjg5IGluc3RhbmNlb2YgU3ludGF4ICYmIGl0XzY4OS5pc0RlbGltaXRlcigpKSB7XG4gICAgICAgICAgcmV0dXJuIGl0XzY4OS5hZGRTY29wZShzY29wZV82ODMsIGJpbmRpbmdzXzY4NCwgb3B0aW9uc182ODUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdF82ODk7XG4gICAgICB9KX07XG4gICAgfVxuICAgIGxldCBuZXdTY29wZXNldF82ODc7XG4gICAgaWYgKG9wdGlvbnNfNjg1LmZsaXApIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuY29udGV4dC5zY29wZXNldC5pbmRleE9mKHNjb3BlXzY4Myk7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIG5ld1Njb3Blc2V0XzY4NyA9IHRoaXMuY29udGV4dC5zY29wZXNldC5yZW1vdmUoaW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3U2NvcGVzZXRfNjg3ID0gdGhpcy5jb250ZXh0LnNjb3Blc2V0LnB1c2goc2NvcGVfNjgzKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3U2NvcGVzZXRfNjg3ID0gdGhpcy5jb250ZXh0LnNjb3Blc2V0LnB1c2goc2NvcGVfNjgzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBTeW50YXgodG9rZW5fNjg2LCB7YmluZGluZ3M6IGJpbmRpbmdzXzY4NCwgc2NvcGVzZXQ6IG5ld1Njb3Blc2V0XzY4N30pO1xuICB9XG4gIHJlbW92ZVNjb3BlKHNjb3BlXzY5MCkge1xuICAgIGxldCB0b2tlbl82OTEgPSB0aGlzLmlzRGVsaW1pdGVyKCkgPyB0aGlzLnRva2VuLm1hcChzXzY5NCA9PiBzXzY5NC5yZW1vdmVTY29wZShzY29wZV82OTApKSA6IHRoaXMudG9rZW47XG4gICAgbGV0IG5ld1Njb3Blc2V0XzY5MiA9IHRoaXMuY29udGV4dC5zY29wZXNldDtcbiAgICBsZXQgaW5kZXhfNjkzID0gdGhpcy5jb250ZXh0LnNjb3Blc2V0LmluZGV4T2Yoc2NvcGVfNjkwKTtcbiAgICBpZiAoaW5kZXhfNjkzICE9PSAtMSkge1xuICAgICAgbmV3U2NvcGVzZXRfNjkyID0gdGhpcy5jb250ZXh0LnNjb3Blc2V0LnJlbW92ZShpbmRleF82OTMpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFN5bnRheCh0b2tlbl82OTEsIHtiaW5kaW5nczogdGhpcy5jb250ZXh0LmJpbmRpbmdzLCBzY29wZXNldDogbmV3U2NvcGVzZXRfNjkyfSk7XG4gIH1cbiAgaXNJZGVudGlmaWVyKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZS5rbGFzcyA9PT0gVG9rZW5DbGFzcy5JZGVudDtcbiAgfVxuICBpc0Fzc2lnbigpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNEZWxpbWl0ZXIoKSAmJiB0aGlzLnRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5BU1NJR047XG4gIH1cbiAgaXNCb29sZWFuTGl0ZXJhbCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNEZWxpbWl0ZXIoKSAmJiB0aGlzLnRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5UUlVFIHx8IHRoaXMudG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkZBTFNFO1xuICB9XG4gIGlzS2V5d29yZCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNEZWxpbWl0ZXIoKSAmJiB0aGlzLnRva2VuLnR5cGUua2xhc3MgPT09IFRva2VuQ2xhc3MuS2V5d29yZDtcbiAgfVxuICBpc051bGxMaXRlcmFsKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLk5VTEw7XG4gIH1cbiAgaXNOdW1lcmljTGl0ZXJhbCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNEZWxpbWl0ZXIoKSAmJiB0aGlzLnRva2VuLnR5cGUua2xhc3MgPT09IFRva2VuQ2xhc3MuTnVtZXJpY0xpdGVyYWw7XG4gIH1cbiAgaXNQdW5jdHVhdG9yKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZS5rbGFzcyA9PT0gVG9rZW5DbGFzcy5QdW5jdHVhdG9yO1xuICB9XG4gIGlzU3RyaW5nTGl0ZXJhbCgpIHtcbiAgICByZXR1cm4gIXRoaXMuaXNEZWxpbWl0ZXIoKSAmJiB0aGlzLnRva2VuLnR5cGUua2xhc3MgPT09IFRva2VuQ2xhc3MuU3RyaW5nTGl0ZXJhbDtcbiAgfVxuICBpc1JlZ3VsYXJFeHByZXNzaW9uKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZS5rbGFzcyA9PT0gVG9rZW5DbGFzcy5SZWd1bGFyRXhwcmVzc2lvbjtcbiAgfVxuICBpc1RlbXBsYXRlKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLlRFTVBMQVRFO1xuICB9XG4gIGlzRGVsaW1pdGVyKCkge1xuICAgIHJldHVybiBMaXN0LmlzTGlzdCh0aGlzLnRva2VuKTtcbiAgfVxuICBpc1BhcmVucygpIHtcbiAgICByZXR1cm4gdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4uZ2V0KDApLnRva2VuLnR5cGUgPT09IFRva2VuVHlwZS5MUEFSRU47XG4gIH1cbiAgaXNCcmFjZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNEZWxpbWl0ZXIoKSAmJiB0aGlzLnRva2VuLmdldCgwKS50b2tlbi50eXBlID09PSBUb2tlblR5cGUuTEJSQUNFO1xuICB9XG4gIGlzQnJhY2tldHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNEZWxpbWl0ZXIoKSAmJiB0aGlzLnRva2VuLmdldCgwKS50b2tlbi50eXBlID09PSBUb2tlblR5cGUuTEJSQUNLO1xuICB9XG4gIGlzU3ludGF4VGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNEZWxpbWl0ZXIoKSAmJiB0aGlzLnRva2VuLmdldCgwKS52YWwoKSA9PT0gXCIjYFwiO1xuICB9XG4gIGlzRU9GKCkge1xuICAgIHJldHVybiAhdGhpcy5pc0RlbGltaXRlcigpICYmIHRoaXMudG9rZW4udHlwZSA9PT0gVG9rZW5UeXBlLkVPUztcbiAgfVxuICB0b1N0cmluZygpIHtcbiAgICBpZiAodGhpcy5pc0RlbGltaXRlcigpKSB7XG4gICAgICByZXR1cm4gdGhpcy50b2tlbi5tYXAoc182OTUgPT4gc182OTUudG9TdHJpbmcoKSkuam9pbihcIiBcIik7XG4gICAgfVxuICAgIGlmICh0aGlzLmlzU3RyaW5nTGl0ZXJhbCgpKSB7XG4gICAgICByZXR1cm4gXCInXCIgKyB0aGlzLnRva2VuLnN0cjtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNUZW1wbGF0ZSgpKSB7XG4gICAgICByZXR1cm4gdGhpcy52YWwoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMudG9rZW4udmFsdWU7XG4gIH1cbn1cbiJdfQ==