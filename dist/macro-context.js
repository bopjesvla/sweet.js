"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntaxOrTermWrapper = undefined;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.unwrap = unwrap;

var _mapSyntaxReducer = require("./map-syntax-reducer");

var _mapSyntaxReducer2 = _interopRequireDefault(_mapSyntaxReducer);

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _immutable = require("immutable");

var _enforester = require("./enforester");

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _ramda = require("ramda");

var _ = _interopRequireWildcard(_ramda);

var _ramdaFantasy = require("ramda-fantasy");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Just_335 = _ramdaFantasy.Maybe.Just;
var Nothing_336 = _ramdaFantasy.Maybe.Nothing;
var symWrap_337 = Symbol("wrapper");
var isKind_338 = _.curry(function (kind_352, t_353, v_354) {
  if (t_353 instanceof _syntax2.default) {
    return t_353[kind_352]() && (v_354 == null || t_353.val() == v_354);
  }
});
var isKeyword_339 = isKind_338("isKeyword");
var isIdentifier_340 = isKind_338("isIdentifier");
var isNumericLiteral_341 = isKind_338("isNumericLiteral");
var isStringLiteral_342 = isKind_338("isStringLiteral");
var isNullLiteral_343 = isKind_338("isNullLiteral");
var isPunctuator_344 = isKind_338("isPunctuator");
var isRegularExpression_345 = isKind_338("isRegularExpression");
var isBraces_346 = isKind_338("isBraces");
var isBrackets_347 = isKind_338("isBrackets");
var isParens_348 = isKind_338("isParens");
var isDelimiter_349 = isKind_338("isDelimiter");
var getLineNumber_350 = function getLineNumber_350(t_355) {
  if (t_355 instanceof _syntax2.default) {
    return t_355.lineNumber();
  }
  throw new Error("Line numbers on terms not implemented yet");
};
var getVal_351 = function getVal_351(t_356) {
  if (isDelimiter_349(t_356, null)) {
    return null;
  }
  if (t_356 instanceof _syntax2.default) {
    return t_356.val();
  }
  return null;
};

var SyntaxOrTermWrapper = exports.SyntaxOrTermWrapper = (function () {
  function SyntaxOrTermWrapper(s_357) {
    var context_358 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, SyntaxOrTermWrapper);

    this[symWrap_337] = s_357;
    this.context = context_358;
  }

  _createClass(SyntaxOrTermWrapper, [{
    key: "isKeyword",
    value: function isKeyword(value_359) {
      return isKeyword_339(this[symWrap_337], value_359);
    }
  }, {
    key: "isIdentifier",
    value: function isIdentifier(value_360) {
      return isIdentifier_340(this[symWrap_337], value_360);
    }
  }, {
    key: "isNumericLiteral",
    value: function isNumericLiteral(value_361) {
      return isNumericLiteral_341(this[symWrap_337], value_361);
    }
  }, {
    key: "isStringLiteral",
    value: function isStringLiteral(value_362) {
      return isStringLiteral_342(this[symWrap_337], value_362);
    }
  }, {
    key: "isNullLiteral",
    value: function isNullLiteral(value_363) {
      return isNullLiteral_343(this[symWrap_337], value_363);
    }
  }, {
    key: "isPunctuator",
    value: function isPunctuator(value_364) {
      return isPunctuator_344(this[symWrap_337], value_364);
    }
  }, {
    key: "isRegularExpression",
    value: function isRegularExpression(value_365) {
      return isRegularExpression_345(this[symWrap_337], value_365);
    }
  }, {
    key: "isBraces",
    value: function isBraces(value_366) {
      return isBraces_346(this[symWrap_337], value_366);
    }
  }, {
    key: "isBrackets",
    value: function isBrackets(value_367) {
      return isBrackets_347(this[symWrap_337], value_367);
    }
  }, {
    key: "isParens",
    value: function isParens(value_368) {
      return isParens_348(this[symWrap_337], value_368);
    }
  }, {
    key: "isDelimiter",
    value: function isDelimiter(value_369) {
      return isDelimiter_349(this[symWrap_337], value_369);
    }
  }, {
    key: "lineNumber",
    value: function lineNumber() {
      return getLineNumber_350(this[symWrap_337]);
    }
  }, {
    key: "val",
    value: function val() {
      return getVal_351(this[symWrap_337]);
    }
  }, {
    key: "inner",
    value: function inner() {
      var stx_370 = this[symWrap_337];
      if (!isDelimiter_349(stx_370, null)) {
        throw new Error("Can only get inner syntax on a delimiter");
      }
      var enf_371 = new _enforester.Enforester(stx_370.inner(), (0, _immutable.List)(), this.context);
      return new MacroContext(enf_371, "inner", this.context);
    }
  }]);

  return SyntaxOrTermWrapper;
})();

function unwrap(x_372) {
  if (x_372 instanceof SyntaxOrTermWrapper) {
    return x_372[symWrap_337];
  }
  return x_372;
}

var MacroContext = (function () {
  function MacroContext(enf_373, name_374, context_375, useScope_376, introducedScope_377) {
    var _this = this;

    _classCallCheck(this, MacroContext);

    this._enf = enf_373;
    this.name = name_374;
    this.context = context_375;
    if (useScope_376 && introducedScope_377) {
      this.noScopes = false;
      this.useScope = useScope_376;
      this.introducedScope = introducedScope_377;
    } else {
      this.noScopes = true;
    }
    this[Symbol.iterator] = function () {
      return _this;
    };
  }

  _createClass(MacroContext, [{
    key: "next",
    value: function next() {
      var type_378 = arguments.length <= 0 || arguments[0] === undefined ? "Syntax" : arguments[0];

      if (this._enf.rest.size === 0) {
        return { done: true, value: null };
      }
      var value_379 = undefined;
      switch (type_378) {
        case "AssignmentExpression":
        case "expr":
          value_379 = this._enf.enforestExpressionLoop();
          break;
        case "Expression":
          value_379 = this._enf.enforestExpression();
          break;
        case "Syntax":
          value_379 = this._enf.advance();
          if (!this.noScopes) {
            value_379 = value_379.addScope(this.useScope).addScope(this.introducedScope, this.context.bindings, { flip: true });
          }
          break;
        default:
          throw new Error("Unknown term type: " + type_378);
      }
      return { done: false, value: new SyntaxOrTermWrapper(value_379, this.context) };
    }
  }]);

  return MacroContext;
})();

exports.default = MacroContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L21hY3JvLWNvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O1FBOEZnQixNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF6RlQsQ0FBQzs7Ozs7Ozs7OztBQUVkLElBQU0sUUFBUSxHQUFHLG9CQUFNLElBQUksQ0FBQztBQUM1QixJQUFNLFdBQVcsR0FBRyxvQkFBTSxPQUFPLENBQUM7QUFDbEMsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLElBQU0sVUFBVSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBSztBQUNyRCxNQUFJLEtBQUssNEJBQWtCLEVBQUU7QUFDM0IsV0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxLQUFLLENBQUEsQUFBQyxDQUFDO0dBQ3JFO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsSUFBTSxhQUFhLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzlDLElBQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3BELElBQU0sb0JBQW9CLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUQsSUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMxRCxJQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0RCxJQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNwRCxJQUFNLHVCQUF1QixHQUFHLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2xFLElBQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUM1QyxJQUFNLGNBQWMsR0FB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ImZpbGUiOiJtYWNyby1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1hcFN5bnRheFJlZHVjZXIgZnJvbSBcIi4vbWFwLXN5bnRheC1yZWR1Y2VyXCI7XG5pbXBvcnQgcmVkdWNlciBmcm9tIFwic2hpZnQtcmVkdWNlclwiO1xuaW1wb3J0IHtMaXN0fSBmcm9tIFwiaW1tdXRhYmxlXCI7XG5pbXBvcnQge0VuZm9yZXN0ZXJ9IGZyb20gXCIuL2VuZm9yZXN0ZXJcIjtcbmltcG9ydCBTeW50YXggZnJvbSBcIi4vc3ludGF4XCI7XG5pbXBvcnQgICogYXMgXyBmcm9tIFwicmFtZGFcIjtcbmltcG9ydCB7TWF5YmV9IGZyb20gXCJyYW1kYS1mYW50YXN5XCI7XG5jb25zdCBKdXN0XzMzNSA9IE1heWJlLkp1c3Q7XG5jb25zdCBOb3RoaW5nXzMzNiA9IE1heWJlLk5vdGhpbmc7XG5jb25zdCBzeW1XcmFwXzMzNyA9IFN5bWJvbChcIndyYXBwZXJcIik7XG5jb25zdCBpc0tpbmRfMzM4ID0gXy5jdXJyeSgoa2luZF8zNTIsIHRfMzUzLCB2XzM1NCkgPT4ge1xuICBpZiAodF8zNTMgaW5zdGFuY2VvZiBTeW50YXgpIHtcbiAgICByZXR1cm4gdF8zNTNba2luZF8zNTJdKCkgJiYgKHZfMzU0ID09IG51bGwgfHwgdF8zNTMudmFsKCkgPT0gdl8zNTQpO1xuICB9XG59KTtcbmNvbnN0IGlzS2V5d29yZF8zMzkgPSBpc0tpbmRfMzM4KFwiaXNLZXl3b3JkXCIpO1xuY29uc3QgaXNJZGVudGlmaWVyXzM0MCA9IGlzS2luZF8zMzgoXCJpc0lkZW50aWZpZXJcIik7XG5jb25zdCBpc051bWVyaWNMaXRlcmFsXzM0MSA9IGlzS2luZF8zMzgoXCJpc051bWVyaWNMaXRlcmFsXCIpO1xuY29uc3QgaXNTdHJpbmdMaXRlcmFsXzM0MiA9IGlzS2luZF8zMzgoXCJpc1N0cmluZ0xpdGVyYWxcIik7XG5jb25zdCBpc051bGxMaXRlcmFsXzM0MyA9IGlzS2luZF8zMzgoXCJpc051bGxMaXRlcmFsXCIpO1xuY29uc3QgaXNQdW5jdHVhdG9yXzM0NCA9IGlzS2luZF8zMzgoXCJpc1B1bmN0dWF0b3JcIik7XG5jb25zdCBpc1JlZ3VsYXJFeHByZXNzaW9uXzM0NSA9IGlzS2luZF8zMzgoXCJpc1JlZ3VsYXJFeHByZXNzaW9uXCIpO1xuY29uc3QgaXNCcmFjZXNfMzQ2ID0gaXNLaW5kXzMzOChcImlzQnJhY2VzXCIpO1xuY29uc3QgaXNCcmFja2V0c18zNDcgPSBpc0tpbmRfMzM4KFwiaXNCcmFja2V0c1wiKTtcbmNvbnN0IGlzUGFyZW5zXzM0OCA9IGlzS2luZF8zMzgoXCJpc1BhcmVuc1wiKTtcbmNvbnN0IGlzRGVsaW1pdGVyXzM0OSA9IGlzS2luZF8zMzgoXCJpc0RlbGltaXRlclwiKTtcbmNvbnN0IGdldExpbmVOdW1iZXJfMzUwID0gdF8zNTUgPT4ge1xuICBpZiAodF8zNTUgaW5zdGFuY2VvZiBTeW50YXgpIHtcbiAgICByZXR1cm4gdF8zNTUubGluZU51bWJlcigpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihcIkxpbmUgbnVtYmVycyBvbiB0ZXJtcyBub3QgaW1wbGVtZW50ZWQgeWV0XCIpO1xufTtcbmNvbnN0IGdldFZhbF8zNTEgPSB0XzM1NiA9PiB7XG4gIGlmIChpc0RlbGltaXRlcl8zNDkodF8zNTYsIG51bGwpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgaWYgKHRfMzU2IGluc3RhbmNlb2YgU3ludGF4KSB7XG4gICAgcmV0dXJuIHRfMzU2LnZhbCgpO1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcbmV4cG9ydCBjbGFzcyBTeW50YXhPclRlcm1XcmFwcGVyIHtcbiAgY29uc3RydWN0b3Ioc18zNTcsIGNvbnRleHRfMzU4ID0ge30pIHtcbiAgICB0aGlzW3N5bVdyYXBfMzM3XSA9IHNfMzU3O1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRfMzU4O1xuICB9XG4gIGlzS2V5d29yZCh2YWx1ZV8zNTkpIHtcbiAgICByZXR1cm4gaXNLZXl3b3JkXzMzOSh0aGlzW3N5bVdyYXBfMzM3XSwgdmFsdWVfMzU5KTtcbiAgfVxuICBpc0lkZW50aWZpZXIodmFsdWVfMzYwKSB7XG4gICAgcmV0dXJuIGlzSWRlbnRpZmllcl8zNDAodGhpc1tzeW1XcmFwXzMzN10sIHZhbHVlXzM2MCk7XG4gIH1cbiAgaXNOdW1lcmljTGl0ZXJhbCh2YWx1ZV8zNjEpIHtcbiAgICByZXR1cm4gaXNOdW1lcmljTGl0ZXJhbF8zNDEodGhpc1tzeW1XcmFwXzMzN10sIHZhbHVlXzM2MSk7XG4gIH1cbiAgaXNTdHJpbmdMaXRlcmFsKHZhbHVlXzM2Mikge1xuICAgIHJldHVybiBpc1N0cmluZ0xpdGVyYWxfMzQyKHRoaXNbc3ltV3JhcF8zMzddLCB2YWx1ZV8zNjIpO1xuICB9XG4gIGlzTnVsbExpdGVyYWwodmFsdWVfMzYzKSB7XG4gICAgcmV0dXJuIGlzTnVsbExpdGVyYWxfMzQzKHRoaXNbc3ltV3JhcF8zMzddLCB2YWx1ZV8zNjMpO1xuICB9XG4gIGlzUHVuY3R1YXRvcih2YWx1ZV8zNjQpIHtcbiAgICByZXR1cm4gaXNQdW5jdHVhdG9yXzM0NCh0aGlzW3N5bVdyYXBfMzM3XSwgdmFsdWVfMzY0KTtcbiAgfVxuICBpc1JlZ3VsYXJFeHByZXNzaW9uKHZhbHVlXzM2NSkge1xuICAgIHJldHVybiBpc1JlZ3VsYXJFeHByZXNzaW9uXzM0NSh0aGlzW3N5bVdyYXBfMzM3XSwgdmFsdWVfMzY1KTtcbiAgfVxuICBpc0JyYWNlcyh2YWx1ZV8zNjYpIHtcbiAgICByZXR1cm4gaXNCcmFjZXNfMzQ2KHRoaXNbc3ltV3JhcF8zMzddLCB2YWx1ZV8zNjYpO1xuICB9XG4gIGlzQnJhY2tldHModmFsdWVfMzY3KSB7XG4gICAgcmV0dXJuIGlzQnJhY2tldHNfMzQ3KHRoaXNbc3ltV3JhcF8zMzddLCB2YWx1ZV8zNjcpO1xuICB9XG4gIGlzUGFyZW5zKHZhbHVlXzM2OCkge1xuICAgIHJldHVybiBpc1BhcmVuc18zNDgodGhpc1tzeW1XcmFwXzMzN10sIHZhbHVlXzM2OCk7XG4gIH1cbiAgaXNEZWxpbWl0ZXIodmFsdWVfMzY5KSB7XG4gICAgcmV0dXJuIGlzRGVsaW1pdGVyXzM0OSh0aGlzW3N5bVdyYXBfMzM3XSwgdmFsdWVfMzY5KTtcbiAgfVxuICBsaW5lTnVtYmVyKCkge1xuICAgIHJldHVybiBnZXRMaW5lTnVtYmVyXzM1MCh0aGlzW3N5bVdyYXBfMzM3XSk7XG4gIH1cbiAgdmFsKCkge1xuICAgIHJldHVybiBnZXRWYWxfMzUxKHRoaXNbc3ltV3JhcF8zMzddKTtcbiAgfVxuICBpbm5lcigpIHtcbiAgICBsZXQgc3R4XzM3MCA9IHRoaXNbc3ltV3JhcF8zMzddO1xuICAgIGlmICghaXNEZWxpbWl0ZXJfMzQ5KHN0eF8zNzAsIG51bGwpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4gb25seSBnZXQgaW5uZXIgc3ludGF4IG9uIGEgZGVsaW1pdGVyXCIpO1xuICAgIH1cbiAgICBsZXQgZW5mXzM3MSA9IG5ldyBFbmZvcmVzdGVyKHN0eF8zNzAuaW5uZXIoKSwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIHJldHVybiBuZXcgTWFjcm9Db250ZXh0KGVuZl8zNzEsIFwiaW5uZXJcIiwgdGhpcy5jb250ZXh0KTtcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIHVud3JhcCh4XzM3Mikge1xuICBpZiAoeF8zNzIgaW5zdGFuY2VvZiBTeW50YXhPclRlcm1XcmFwcGVyKSB7XG4gICAgcmV0dXJuIHhfMzcyW3N5bVdyYXBfMzM3XTtcbiAgfVxuICByZXR1cm4geF8zNzI7XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYWNyb0NvbnRleHQge1xuICBjb25zdHJ1Y3RvcihlbmZfMzczLCBuYW1lXzM3NCwgY29udGV4dF8zNzUsIHVzZVNjb3BlXzM3NiwgaW50cm9kdWNlZFNjb3BlXzM3Nykge1xuICAgIHRoaXMuX2VuZiA9IGVuZl8zNzM7XG4gICAgdGhpcy5uYW1lID0gbmFtZV8zNzQ7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dF8zNzU7XG4gICAgaWYgKHVzZVNjb3BlXzM3NiAmJiBpbnRyb2R1Y2VkU2NvcGVfMzc3KSB7XG4gICAgICB0aGlzLm5vU2NvcGVzID0gZmFsc2U7XG4gICAgICB0aGlzLnVzZVNjb3BlID0gdXNlU2NvcGVfMzc2O1xuICAgICAgdGhpcy5pbnRyb2R1Y2VkU2NvcGUgPSBpbnRyb2R1Y2VkU2NvcGVfMzc3O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm5vU2NvcGVzID0gdHJ1ZTtcbiAgICB9XG4gICAgdGhpc1tTeW1ib2wuaXRlcmF0b3JdID0gKCkgPT4gdGhpcztcbiAgfVxuICBuZXh0KHR5cGVfMzc4ID0gXCJTeW50YXhcIikge1xuICAgIGlmICh0aGlzLl9lbmYucmVzdC5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4ge2RvbmU6IHRydWUsIHZhbHVlOiBudWxsfTtcbiAgICB9XG4gICAgbGV0IHZhbHVlXzM3OTtcbiAgICBzd2l0Y2ggKHR5cGVfMzc4KSB7XG4gICAgICBjYXNlIFwiQXNzaWdubWVudEV4cHJlc3Npb25cIjpcbiAgICAgIGNhc2UgXCJleHByXCI6XG4gICAgICAgIHZhbHVlXzM3OSA9IHRoaXMuX2VuZi5lbmZvcmVzdEV4cHJlc3Npb25Mb29wKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkV4cHJlc3Npb25cIjpcbiAgICAgICAgdmFsdWVfMzc5ID0gdGhpcy5fZW5mLmVuZm9yZXN0RXhwcmVzc2lvbigpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJTeW50YXhcIjpcbiAgICAgICAgdmFsdWVfMzc5ID0gdGhpcy5fZW5mLmFkdmFuY2UoKTtcbiAgICAgICAgaWYgKCF0aGlzLm5vU2NvcGVzKSB7XG4gICAgICAgICAgdmFsdWVfMzc5ID0gdmFsdWVfMzc5LmFkZFNjb3BlKHRoaXMudXNlU2NvcGUpLmFkZFNjb3BlKHRoaXMuaW50cm9kdWNlZFNjb3BlLCB0aGlzLmNvbnRleHQuYmluZGluZ3MsIHtmbGlwOiB0cnVlfSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHRlcm0gdHlwZTogXCIgKyB0eXBlXzM3OCk7XG4gICAgfVxuICAgIHJldHVybiB7ZG9uZTogZmFsc2UsIHZhbHVlOiBuZXcgU3ludGF4T3JUZXJtV3JhcHBlcih2YWx1ZV8zNzksIHRoaXMuY29udGV4dCl9O1xuICB9XG59XG4iXX0=