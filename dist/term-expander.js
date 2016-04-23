"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _immutable = require("immutable");

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _scope = require("./scope");

var _applyScopeInParamsReducer = require("./apply-scope-in-params-reducer");

var _applyScopeInParamsReducer2 = _interopRequireDefault(_applyScopeInParamsReducer);

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _expander = require("./expander");

var _expander2 = _interopRequireDefault(_expander);

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _serializer = require("./serializer");

var _enforester = require("./enforester");

var _errors = require("./errors");

var _templateProcessor = require("./template-processor.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TermExpander = (function () {
  function TermExpander(context_723) {
    _classCallCheck(this, TermExpander);

    this.context = context_723;
  }

  _createClass(TermExpander, [{
    key: "expand",
    value: function expand(term_724) {
      var field_725 = "expand" + term_724.type;
      if (typeof this[field_725] === "function") {
        return this[field_725](term_724);
      }
      (0, _errors.assert)(false, "expand not implemented yet for: " + term_724.type);
    }
  }, {
    key: "expandTemplateExpression",
    value: function expandTemplateExpression(term_726) {
      return new _terms2.default("TemplateExpression", { tag: term_726.tag == null ? null : this.expand(term_726.tag), elements: term_726.elements.toArray() });
    }
  }, {
    key: "expandBreakStatement",
    value: function expandBreakStatement(term_727) {
      return new _terms2.default("BreakStatement", { label: term_727.label ? term_727.label.val() : null });
    }
  }, {
    key: "expandDoWhileStatement",
    value: function expandDoWhileStatement(term_728) {
      return new _terms2.default("DoWhileStatement", { body: this.expand(term_728.body), test: this.expand(term_728.test) });
    }
  }, {
    key: "expandWithStatement",
    value: function expandWithStatement(term_729) {
      return new _terms2.default("WithStatement", { body: this.expand(term_729.body), object: this.expand(term_729.object) });
    }
  }, {
    key: "expandDebuggerStatement",
    value: function expandDebuggerStatement(term_730) {
      return term_730;
    }
  }, {
    key: "expandContinueStatement",
    value: function expandContinueStatement(term_731) {
      return new _terms2.default("ContinueStatement", { label: term_731.label ? term_731.label.val() : null });
    }
  }, {
    key: "expandSwitchStatementWithDefault",
    value: function expandSwitchStatementWithDefault(term_732) {
      var _this = this;

      return new _terms2.default("SwitchStatementWithDefault", { discriminant: this.expand(term_732.discriminant), preDefaultCases: term_732.preDefaultCases.map(function (c_733) {
          return _this.expand(c_733);
        }).toArray(), defaultCase: this.expand(term_732.defaultCase), postDefaultCases: term_732.postDefaultCases.map(function (c_734) {
          return _this.expand(c_734);
        }).toArray() });
    }
  }, {
    key: "expandComputedMemberExpression",
    value: function expandComputedMemberExpression(term_735) {
      return new _terms2.default("ComputedMemberExpression", { object: this.expand(term_735.object), expression: this.expand(term_735.expression) });
    }
  }, {
    key: "expandSwitchStatement",
    value: function expandSwitchStatement(term_736) {
      var _this2 = this;

      return new _terms2.default("SwitchStatement", { discriminant: this.expand(term_736.discriminant), cases: term_736.cases.map(function (c_737) {
          return _this2.expand(c_737);
        }).toArray() });
    }
  }, {
    key: "expandFormalParameters",
    value: function expandFormalParameters(term_738) {
      var _this3 = this;

      var rest_739 = term_738.rest == null ? null : this.expand(term_738.rest);
      return new _terms2.default("FormalParameters", { items: term_738.items.map(function (i_740) {
          return _this3.expand(i_740);
        }), rest: rest_739 });
    }
  }, {
    key: "expandArrowExpression",
    value: function expandArrowExpression(term_741) {
      return this.doFunctionExpansion(term_741, "ArrowExpression");
    }
  }, {
    key: "expandSwitchDefault",
    value: function expandSwitchDefault(term_742) {
      var _this4 = this;

      return new _terms2.default("SwitchDefault", { consequent: term_742.consequent.map(function (c_743) {
          return _this4.expand(c_743);
        }).toArray() });
    }
  }, {
    key: "expandSwitchCase",
    value: function expandSwitchCase(term_744) {
      var _this5 = this;

      return new _terms2.default("SwitchCase", { test: this.expand(term_744.test), consequent: term_744.consequent.map(function (c_745) {
          return _this5.expand(c_745);
        }).toArray() });
    }
  }, {
    key: "expandForInStatement",
    value: function expandForInStatement(term_746) {
      return new _terms2.default("ForInStatement", { left: this.expand(term_746.left), right: this.expand(term_746.right), body: this.expand(term_746.body) });
    }
  }, {
    key: "expandTryCatchStatement",
    value: function expandTryCatchStatement(term_747) {
      return new _terms2.default("TryCatchStatement", { body: this.expand(term_747.body), catchClause: this.expand(term_747.catchClause) });
    }
  }, {
    key: "expandTryFinallyStatement",
    value: function expandTryFinallyStatement(term_748) {
      var catchClause_749 = term_748.catchClause == null ? null : this.expand(term_748.catchClause);
      return new _terms2.default("TryFinallyStatement", { body: this.expand(term_748.body), catchClause: catchClause_749, finalizer: this.expand(term_748.finalizer) });
    }
  }, {
    key: "expandCatchClause",
    value: function expandCatchClause(term_750) {
      return new _terms2.default("CatchClause", { binding: this.expand(term_750.binding), body: this.expand(term_750.body) });
    }
  }, {
    key: "expandThrowStatement",
    value: function expandThrowStatement(term_751) {
      return new _terms2.default("ThrowStatement", { expression: this.expand(term_751.expression) });
    }
  }, {
    key: "expandForOfStatement",
    value: function expandForOfStatement(term_752) {
      return new _terms2.default("ForOfStatement", { left: this.expand(term_752.left), right: this.expand(term_752.right), body: this.expand(term_752.body) });
    }
  }, {
    key: "expandBindingIdentifier",
    value: function expandBindingIdentifier(term_753) {
      return term_753;
    }
  }, {
    key: "expandBindingPropertyIdentifier",
    value: function expandBindingPropertyIdentifier(term_754) {
      return term_754;
    }
  }, {
    key: "expandBindingPropertyProperty",
    value: function expandBindingPropertyProperty(term_755) {
      return new _terms2.default("BindingPropertyProperty", { name: this.expand(term_755.name), binding: this.expand(term_755.binding) });
    }
  }, {
    key: "expandComputedPropertyName",
    value: function expandComputedPropertyName(term_756) {
      return new _terms2.default("ComputedPropertyName", { expression: this.expand(term_756.expression) });
    }
  }, {
    key: "expandObjectBinding",
    value: function expandObjectBinding(term_757) {
      var _this6 = this;

      return new _terms2.default("ObjectBinding", { properties: term_757.properties.map(function (t_758) {
          return _this6.expand(t_758);
        }).toArray() });
    }
  }, {
    key: "expandArrayBinding",
    value: function expandArrayBinding(term_759) {
      var _this7 = this;

      var restElement_760 = term_759.restElement == null ? null : this.expand(term_759.restElement);
      return new _terms2.default("ArrayBinding", { elements: term_759.elements.map(function (t_761) {
          return t_761 == null ? null : _this7.expand(t_761);
        }).toArray(), restElement: restElement_760 });
    }
  }, {
    key: "expandBindingWithDefault",
    value: function expandBindingWithDefault(term_762) {
      return new _terms2.default("BindingWithDefault", { binding: this.expand(term_762.binding), init: this.expand(term_762.init) });
    }
  }, {
    key: "expandShorthandProperty",
    value: function expandShorthandProperty(term_763) {
      return new _terms2.default("DataProperty", { name: new _terms2.default("StaticPropertyName", { value: term_763.name }), expression: new _terms2.default("IdentifierExpression", { name: term_763.name }) });
    }
  }, {
    key: "expandForStatement",
    value: function expandForStatement(term_764) {
      var init_765 = term_764.init == null ? null : this.expand(term_764.init);
      var test_766 = term_764.test == null ? null : this.expand(term_764.test);
      var update_767 = term_764.update == null ? null : this.expand(term_764.update);
      var body_768 = this.expand(term_764.body);
      return new _terms2.default("ForStatement", { init: init_765, test: test_766, update: update_767, body: body_768 });
    }
  }, {
    key: "expandYieldExpression",
    value: function expandYieldExpression(term_769) {
      var expr_770 = term_769.expression == null ? null : this.expand(term_769.expression);
      return new _terms2.default("YieldExpression", { expression: expr_770 });
    }
  }, {
    key: "expandYieldGeneratorExpression",
    value: function expandYieldGeneratorExpression(term_771) {
      var expr_772 = term_771.expression == null ? null : this.expand(term_771.expression);
      return new _terms2.default("YieldGeneratorExpression", { expression: expr_772 });
    }
  }, {
    key: "expandWhileStatement",
    value: function expandWhileStatement(term_773) {
      return new _terms2.default("WhileStatement", { test: this.expand(term_773.test), body: this.expand(term_773.body) });
    }
  }, {
    key: "expandIfStatement",
    value: function expandIfStatement(term_774) {
      var consequent_775 = term_774.consequent == null ? null : this.expand(term_774.consequent);
      var alternate_776 = term_774.alternate == null ? null : this.expand(term_774.alternate);
      return new _terms2.default("IfStatement", { test: this.expand(term_774.test), consequent: consequent_775, alternate: alternate_776 });
    }
  }, {
    key: "expandBlockStatement",
    value: function expandBlockStatement(term_777) {
      return new _terms2.default("BlockStatement", { block: this.expand(term_777.block) });
    }
  }, {
    key: "expandBlock",
    value: function expandBlock(term_778) {
      var _this8 = this;

      return new _terms2.default("Block", { statements: term_778.statements.map(function (s_779) {
          return _this8.expand(s_779);
        }).toArray() });
    }
  }, {
    key: "expandVariableDeclarationStatement",
    value: function expandVariableDeclarationStatement(term_780) {
      return new _terms2.default("VariableDeclarationStatement", { declaration: this.expand(term_780.declaration) });
    }
  }, {
    key: "expandReturnStatement",
    value: function expandReturnStatement(term_781) {
      if (term_781.expression == null) {
        return term_781;
      }
      return new _terms2.default("ReturnStatement", { expression: this.expand(term_781.expression) });
    }
  }, {
    key: "expandClassDeclaration",
    value: function expandClassDeclaration(term_782) {
      var _this9 = this;

      return new _terms2.default("ClassDeclaration", { name: term_782.name == null ? null : this.expand(term_782.name), super: term_782.super == null ? null : this.expand(term_782.super), elements: term_782.elements.map(function (el_783) {
          return _this9.expand(el_783);
        }).toArray() });
    }
  }, {
    key: "expandClassExpression",
    value: function expandClassExpression(term_784) {
      var _this10 = this;

      return new _terms2.default("ClassExpression", { name: term_784.name == null ? null : this.expand(term_784.name), super: term_784.super == null ? null : this.expand(term_784.super), elements: term_784.elements.map(function (el_785) {
          return _this10.expand(el_785);
        }).toArray() });
    }
  }, {
    key: "expandClassElement",
    value: function expandClassElement(term_786) {
      return new _terms2.default("ClassElement", { isStatic: term_786.isStatic, method: this.expand(term_786.method) });
    }
  }, {
    key: "expandThisExpression",
    value: function expandThisExpression(term_787) {
      return term_787;
    }
  }, {
    key: "expandSyntaxTemplate",
    value: function expandSyntaxTemplate(term_788) {
      var _this11 = this;

      var expander_789 = new _expander2.default(this.context);
      var r_790 = (0, _templateProcessor.processTemplate)(term_788.template.inner());
      var str_791 = _syntax2.default.fromString(_serializer.serializer.write(r_790.template));
      var callee_792 = new _terms2.default("IdentifierExpression", { name: _syntax2.default.fromIdentifier("syntaxTemplate") });
      var expandedInterps_793 = r_790.interp.map(function (i_795) {
        var enf_796 = new _enforester.Enforester(i_795, (0, _immutable.List)(), _this11.context);
        return _this11.expand(enf_796.enforest("expression"));
      });
      var args_794 = _immutable.List.of(new _terms2.default("LiteralStringExpression", { value: str_791 })).concat(expandedInterps_793);
      return new _terms2.default("CallExpression", { callee: callee_792, arguments: args_794 });
    }
  }, {
    key: "expandSyntaxQuote",
    value: function expandSyntaxQuote(term_797) {
      var str_798 = new _terms2.default("LiteralStringExpression", { value: _syntax2.default.fromString(_serializer.serializer.write(term_797.name)) });
      return new _terms2.default("TemplateExpression", { tag: term_797.template.tag, elements: term_797.template.elements.push(str_798).push(new _terms2.default("TemplateElement", { rawValue: "" })).toArray() });
    }
  }, {
    key: "expandStaticMemberExpression",
    value: function expandStaticMemberExpression(term_799) {
      return new _terms2.default("StaticMemberExpression", { object: this.expand(term_799.object), property: term_799.property });
    }
  }, {
    key: "expandArrayExpression",
    value: function expandArrayExpression(term_800) {
      var _this12 = this;

      return new _terms2.default("ArrayExpression", { elements: term_800.elements.map(function (t_801) {
          return t_801 == null ? t_801 : _this12.expand(t_801);
        }) });
    }
  }, {
    key: "expandImport",
    value: function expandImport(term_802) {
      return term_802;
    }
  }, {
    key: "expandImportNamespace",
    value: function expandImportNamespace(term_803) {
      return term_803;
    }
  }, {
    key: "expandExport",
    value: function expandExport(term_804) {
      return new _terms2.default("Export", { declaration: this.expand(term_804.declaration) });
    }
  }, {
    key: "expandExportDefault",
    value: function expandExportDefault(term_805) {
      return new _terms2.default("ExportDefault", { body: this.expand(term_805.body) });
    }
  }, {
    key: "expandExportFrom",
    value: function expandExportFrom(term_806) {
      return term_806;
    }
  }, {
    key: "expandExportAllFrom",
    value: function expandExportAllFrom(term_807) {
      return term_807;
    }
  }, {
    key: "expandExportSpecifier",
    value: function expandExportSpecifier(term_808) {
      return term_808;
    }
  }, {
    key: "expandStaticPropertyName",
    value: function expandStaticPropertyName(term_809) {
      return term_809;
    }
  }, {
    key: "expandDataProperty",
    value: function expandDataProperty(term_810) {
      return new _terms2.default("DataProperty", { name: this.expand(term_810.name), expression: this.expand(term_810.expression) });
    }
  }, {
    key: "expandObjectExpression",
    value: function expandObjectExpression(term_811) {
      var _this13 = this;

      return new _terms2.default("ObjectExpression", { properties: term_811.properties.map(function (t_812) {
          return _this13.expand(t_812);
        }) });
    }
  }, {
    key: "expandVariableDeclarator",
    value: function expandVariableDeclarator(term_813) {
      var init_814 = term_813.init == null ? null : this.expand(term_813.init);
      return new _terms2.default("VariableDeclarator", { binding: this.expand(term_813.binding), init: init_814 });
    }
  }, {
    key: "expandVariableDeclaration",
    value: function expandVariableDeclaration(term_815) {
      var _this14 = this;

      return new _terms2.default("VariableDeclaration", { kind: term_815.kind, declarators: term_815.declarators.map(function (d_816) {
          return _this14.expand(d_816);
        }) });
    }
  }, {
    key: "expandParenthesizedExpression",
    value: function expandParenthesizedExpression(term_817) {
      if (term_817.inner.size === 0) {
        throw new Error("unexpected end of input");
      }
      var enf_818 = new _enforester.Enforester(term_817.inner, (0, _immutable.List)(), this.context);
      var lookahead_819 = enf_818.peek();
      var t_820 = enf_818.enforestExpression();
      if (t_820 == null || enf_818.rest.size > 0) {
        throw enf_818.createError(lookahead_819, "unexpected syntax");
      }
      return this.expand(t_820);
    }
  }, {
    key: "expandUnaryExpression",
    value: function expandUnaryExpression(term_821) {
      return new _terms2.default("UnaryExpression", { operator: term_821.operator, operand: this.expand(term_821.operand) });
    }
  }, {
    key: "expandUpdateExpression",
    value: function expandUpdateExpression(term_822) {
      return new _terms2.default("UpdateExpression", { isPrefix: term_822.isPrefix, operator: term_822.operator, operand: this.expand(term_822.operand) });
    }
  }, {
    key: "expandBinaryExpression",
    value: function expandBinaryExpression(term_823) {
      var left_824 = this.expand(term_823.left);
      var right_825 = this.expand(term_823.right);
      return new _terms2.default("BinaryExpression", { left: left_824, operator: term_823.operator, right: right_825 });
    }
  }, {
    key: "expandConditionalExpression",
    value: function expandConditionalExpression(term_826) {
      return new _terms2.default("ConditionalExpression", { test: this.expand(term_826.test), consequent: this.expand(term_826.consequent), alternate: this.expand(term_826.alternate) });
    }
  }, {
    key: "expandNewTargetExpression",
    value: function expandNewTargetExpression(term_827) {
      return term_827;
    }
  }, {
    key: "expandNewExpression",
    value: function expandNewExpression(term_828) {
      var _this15 = this;

      var callee_829 = this.expand(term_828.callee);
      var enf_830 = new _enforester.Enforester(term_828.arguments, (0, _immutable.List)(), this.context);
      var args_831 = enf_830.enforestArgumentList().map(function (arg_832) {
        return _this15.expand(arg_832);
      });
      return new _terms2.default("NewExpression", { callee: callee_829, arguments: args_831.toArray() });
    }
  }, {
    key: "expandSuper",
    value: function expandSuper(term_833) {
      return term_833;
    }
  }, {
    key: "expandCallExpression",
    value: function expandCallExpression(term_834) {
      var _this16 = this;

      var callee_835 = this.expand(term_834.callee);
      var enf_836 = new _enforester.Enforester(term_834.arguments, (0, _immutable.List)(), this.context);
      var args_837 = enf_836.enforestArgumentList().map(function (arg_838) {
        return _this16.expand(arg_838);
      });
      return new _terms2.default("CallExpression", { callee: callee_835, arguments: args_837 });
    }
  }, {
    key: "expandSpreadElement",
    value: function expandSpreadElement(term_839) {
      return new _terms2.default("SpreadElement", { expression: this.expand(term_839.expression) });
    }
  }, {
    key: "expandExpressionStatement",
    value: function expandExpressionStatement(term_840) {
      var child_841 = this.expand(term_840.expression);
      return new _terms2.default("ExpressionStatement", { expression: child_841 });
    }
  }, {
    key: "expandLabeledStatement",
    value: function expandLabeledStatement(term_842) {
      return new _terms2.default("LabeledStatement", { label: term_842.label.val(), body: this.expand(term_842.body) });
    }
  }, {
    key: "doFunctionExpansion",
    value: function doFunctionExpansion(term_843, type_844) {
      var _this17 = this;

      var scope_845 = (0, _scope.freshScope)("fun");
      var red_846 = new _applyScopeInParamsReducer2.default(scope_845, this.context);
      var params_847 = undefined;
      if (type_844 !== "Getter" && type_844 !== "Setter") {
        params_847 = red_846.transform(term_843.params);
        params_847 = this.expand(params_847);
      }
      this.context.currentScope.push(scope_845);
      var expander_848 = new _expander2.default(this.context);
      var markedBody_849 = undefined,
          bodyTerm_850 = undefined;
      if (term_843.body instanceof _terms2.default) {
        bodyTerm_850 = this.expand(term_843.body.addScope(scope_845, this.context.bindings));
      } else {
        markedBody_849 = term_843.body.map(function (b_851) {
          return b_851.addScope(scope_845, _this17.context.bindings);
        });
        bodyTerm_850 = new _terms2.default("FunctionBody", { directives: (0, _immutable.List)(), statements: expander_848.expand(markedBody_849) });
      }
      this.context.currentScope.pop();
      if (type_844 === "Getter") {
        return new _terms2.default(type_844, { name: this.expand(term_843.name), body: bodyTerm_850 });
      } else if (type_844 === "Setter") {
        return new _terms2.default(type_844, { name: this.expand(term_843.name), param: term_843.param, body: bodyTerm_850 });
      }
      return new _terms2.default(type_844, { name: term_843.name, isGenerator: term_843.isGenerator, params: params_847, body: bodyTerm_850 });
    }
  }, {
    key: "expandMethod",
    value: function expandMethod(term_852) {
      return this.doFunctionExpansion(term_852, "Method");
    }
  }, {
    key: "expandSetter",
    value: function expandSetter(term_853) {
      return this.doFunctionExpansion(term_853, "Setter");
    }
  }, {
    key: "expandGetter",
    value: function expandGetter(term_854) {
      return this.doFunctionExpansion(term_854, "Getter");
    }
  }, {
    key: "expandFunctionDeclaration",
    value: function expandFunctionDeclaration(term_855) {
      return this.doFunctionExpansion(term_855, "FunctionDeclaration");
    }
  }, {
    key: "expandFunctionExpression",
    value: function expandFunctionExpression(term_856) {
      return this.doFunctionExpansion(term_856, "FunctionExpression");
    }
  }, {
    key: "expandCompoundAssignmentExpression",
    value: function expandCompoundAssignmentExpression(term_857) {
      return new _terms2.default("CompoundAssignmentExpression", { binding: this.expand(term_857.binding), operator: term_857.operator, expression: this.expand(term_857.expression) });
    }
  }, {
    key: "expandAssignmentExpression",
    value: function expandAssignmentExpression(term_858) {
      return new _terms2.default("AssignmentExpression", { binding: this.expand(term_858.binding), expression: this.expand(term_858.expression) });
    }
  }, {
    key: "expandEmptyStatement",
    value: function expandEmptyStatement(term_859) {
      return term_859;
    }
  }, {
    key: "expandLiteralBooleanExpression",
    value: function expandLiteralBooleanExpression(term_860) {
      return term_860;
    }
  }, {
    key: "expandLiteralNumericExpression",
    value: function expandLiteralNumericExpression(term_861) {
      return term_861;
    }
  }, {
    key: "expandLiteralInfinityExpression",
    value: function expandLiteralInfinityExpression(term_862) {
      return term_862;
    }
  }, {
    key: "expandIdentifierExpression",
    value: function expandIdentifierExpression(term_863) {
      var trans_864 = this.context.env.get(term_863.name.resolve());
      if (trans_864) {
        return new _terms2.default("IdentifierExpression", { name: trans_864.id });
      }
      return term_863;
    }
  }, {
    key: "expandLiteralNullExpression",
    value: function expandLiteralNullExpression(term_865) {
      return term_865;
    }
  }, {
    key: "expandLiteralStringExpression",
    value: function expandLiteralStringExpression(term_866) {
      return term_866;
    }
  }, {
    key: "expandLiteralRegExpExpression",
    value: function expandLiteralRegExpExpression(term_867) {
      return term_867;
    }
  }]);

  return TermExpander;
})();

exports.default = TermExpander;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3Rlcm0tZXhwYW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXcUIsWUFBWTtBQUMvQixXQURtQixZQUFZLENBQ25CLFdBQVcsRUFBRTswQkFETixZQUFZOztBQUU3QixRQUFJLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQztHQUM1Qjs7ZUFIa0IsWUFBWTs7MkJBSXhCLFFBQVEsRUFBRTtBQUNmLFVBQUksU0FBUyxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3pDLFVBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssVUFBVSxFQUFFO0FBQ3pDLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ2xDO0FBQ0QsMEJBQU8sS0FBSyxFQUFFLGtDQUFrQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuRTs7OzZDQUN3QixRQUFRLEVBQUU7QUFDakMsYUFBTyxvQkFBUyxvQkFBb0IsRUFBRSxFQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQyxDQUFDO0tBQzlJOzs7eUNBQ29CLFFBQVEsRUFBRTtBQUM3QixhQUFPLG9CQUFTLGdCQUFnQixFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUMsQ0FBQyxDQUFDO0tBQzFGOzs7MkNBQ3NCLFFBQVEsRUFBRTtBQUMvQixhQUFPLG9CQUFTLGtCQUFrQixFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFN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QVUsQ0FBQyxFQUFDLENBQUMsQ0FBQztLQUNqSTs7O3lDQUNvQixRQUFRLEVBQUU7QUFDN0IsYUFBTyxRQUFRLENBQUM7S0FDakI7OzttREFDOEIsUUFBUSxFQUFFO0FBQ3ZDLGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7bURBQzhCLFFBQVEsRUFBRTtBQUN2QyxhQUFPLFFBQVEsQ0FBQztLQUNqQjs7O29EQUMrQixRQUFRLEVBQUU7QUFDeEMsYUFBTyxRQUFRLENBQUM7S0FDakI7OzsrQ0FDMEIsUUFBUSxFQUFFO0FBQ25DLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDOUQsVUFBSSxTQUFTLEVBQUU7QUFDYixlQUFPLG9CQUFTLHNCQUFzQixFQUFFLEVBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDO09BQy9EO0FBQ0QsYUFBTyxRQUFRLENBQUM7S0FDakI7OztnREFDMkIsUUFBUSxFQUFFO0FBQ3BDLGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7a0RBQzZCLFFBQVEsRUFBRTtBQUN0QyxhQUFPLFFBQVEsQ0FBQztLQUNqQjs7O2tEQUM2QixRQUFRLEVBQUU7QUFDdEMsYUFBTyxRQUFRLENBQUM7S0FDakI7OztTQTNVa0IsWUFBWTs7O2tCQUFaLFlBQVkiLCJmaWxlIjoidGVybS1leHBhbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IFRlcm0sIHtpc0VPRiwgaXNCaW5kaW5nSWRlbnRpZmllciwgaXNGdW5jdGlvbkRlY2xhcmF0aW9uLCBpc0Z1bmN0aW9uRXhwcmVzc2lvbiwgaXNGdW5jdGlvblRlcm0sIGlzRnVuY3Rpb25XaXRoTmFtZSwgaXNTeW50YXhEZWNsYXJhdGlvbiwgaXNWYXJpYWJsZURlY2xhcmF0aW9uLCBpc1ZhcmlhYmxlRGVjbGFyYXRpb25TdGF0ZW1lbnQsIGlzSW1wb3J0LCBpc0V4cG9ydH0gZnJvbSBcIi4vdGVybXNcIjtcbmltcG9ydCB7U2NvcGUsIGZyZXNoU2NvcGV9IGZyb20gXCIuL3Njb3BlXCI7XG5pbXBvcnQgQXBwbHlTY29wZUluUGFyYW1zUmVkdWNlciBmcm9tIFwiLi9hcHBseS1zY29wZS1pbi1wYXJhbXMtcmVkdWNlclwiO1xuaW1wb3J0IHJlZHVjZXIsIHtNb25vaWRhbFJlZHVjZXJ9IGZyb20gXCJzaGlmdC1yZWR1Y2VyXCI7XG5pbXBvcnQgRXhwYW5kZXIgZnJvbSBcIi4vZXhwYW5kZXJcIjtcbmltcG9ydCBTeW50YXggZnJvbSBcIi4vc3ludGF4XCI7XG5pbXBvcnQge3NlcmlhbGl6ZXIsIG1ha2VEZXNlcmlhbGl6ZXJ9IGZyb20gXCIuL3NlcmlhbGl6ZXJcIjtcbmltcG9ydCB7ZW5mb3Jlc3RFeHByLCBFbmZvcmVzdGVyfSBmcm9tIFwiLi9lbmZvcmVzdGVyXCI7XG5pbXBvcnQge2Fzc2VydH0gZnJvbSBcIi4vZXJyb3JzXCI7XG5pbXBvcnQge3Byb2Nlc3NUZW1wbGF0ZX0gZnJvbSBcIi4vdGVtcGxhdGUtcHJvY2Vzc29yLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJtRXhwYW5kZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0XzcyMykge1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRfNzIzO1xuICB9XG4gIGV4cGFuZCh0ZXJtXzcyNCkge1xuICAgIGxldCBmaWVsZF83MjUgPSBcImV4cGFuZFwiICsgdGVybV83MjQudHlwZTtcbiAgICBpZiAodHlwZW9mIHRoaXNbZmllbGRfNzI1XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gdGhpc1tmaWVsZF83MjVdKHRlcm1fNzI0KTtcbiAgICB9XG4gICAgYXNzZXJ0KGZhbHNlLCBcImV4cGFuZCBub3QgaW1wbGVtZW50ZWQgeWV0IGZvcjogXCIgKyB0ZXJtXzcyNC50eXBlKTtcbiAgfVxuICBleHBhbmRUZW1wbGF0ZUV4cHJlc3Npb24odGVybV83MjYpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJUZW1wbGF0ZUV4cHJlc3Npb25cIiwge3RhZzogdGVybV83MjYudGFnID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV83MjYudGFnKSwgZWxlbWVudHM6IHRlcm1fNzI2LmVsZW1lbnRzLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZEJyZWFrU3RhdGVtZW50KHRlcm1fNzI3KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQnJlYWtTdGF0ZW1lbnRcIiwge2xhYmVsOiB0ZXJtXzcyNy5sYWJlbCA/IHRlcm1fNzI3LmxhYmVsLnZhbCgpIDogbnVsbH0pO1xuICB9XG4gIGV4cGFuZERvV2hpbGVTdGF0ZW1lbnQodGVybV83MjgpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJEb1doaWxlU3RhdGVtZW50XCIsIHtib2R5OiB0aGlzLmV4cGFuZCh0ZXJtXzcyOC5ib2R5KSwgdGVzdDogdGhpcy5leHBhbmQodGVybV83MjgudGVzdCl9KTtcbiAgfVxuICBleHBhbmRXaXRoU3RhdGVtZW50KHRlcm1fNzI5KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiV2l0aFN0YXRlbWVudFwiLCB7Ym9keTogdGhpcy5leHBhbmQodGVybV83MjkuYm9keSksIG9iamVjdDogdGhpcy5leHBhbmQodGVybV83Mjkub2JqZWN0KX0pO1xuICB9XG4gIGV4cGFuZERlYnVnZ2VyU3RhdGVtZW50KHRlcm1fNzMwKSB7XG4gICAgcmV0dXJuIHRlcm1fNzMwO1xuICB9XG4gIGV4cGFuZENvbnRpbnVlU3RhdGVtZW50KHRlcm1fNzMxKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ29udGludWVTdGF0ZW1lbnRcIiwge2xhYmVsOiB0ZXJtXzczMS5sYWJlbCA/IHRlcm1fNzMxLmxhYmVsLnZhbCgpIDogbnVsbH0pO1xuICB9XG4gIGV4cGFuZFN3aXRjaFN0YXRlbWVudFdpdGhEZWZhdWx0KHRlcm1fNzMyKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiU3dpdGNoU3RhdGVtZW50V2l0aERlZmF1bHRcIiwge2Rpc2NyaW1pbmFudDogdGhpcy5leHBhbmQodGVybV83MzIuZGlzY3JpbWluYW50KSwgcHJlRGVmYXVsdENhc2VzOiB0ZXJtXzczMi5wcmVEZWZhdWx0Q2FzZXMubWFwKGNfNzMzID0+IHRoaXMuZXhwYW5kKGNfNzMzKSkudG9BcnJheSgpLCBkZWZhdWx0Q2FzZTogdGhpcy5leHBhbmQodGVybV83MzIuZGVmYXVsdENhc2UpLCBwb3N0RGVmYXVsdENhc2VzOiB0ZXJtXzczMi5wb3N0RGVmYXVsdENhc2VzLm1hcChjXzczNCA9PiB0aGlzLmV4cGFuZChjXzczNCkpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZENvbXB1dGVkTWVtYmVyRXhwcmVzc2lvbih0ZXJtXzczNSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbXB1dGVkTWVtYmVyRXhwcmVzc2lvblwiLCB7b2JqZWN0OiB0aGlzLmV4cGFuZCh0ZXJtXzczNS5vYmplY3QpLCBleHByZXNzaW9uOiB0aGlzLmV4cGFuZCh0ZXJtXzczNS5leHByZXNzaW9uKX0pO1xuICB9XG4gIGV4cGFuZFN3aXRjaFN0YXRlbWVudCh0ZXJtXzczNikge1xuICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaFN0YXRlbWVudFwiLCB7ZGlzY3JpbWluYW50OiB0aGlzLmV4cGFuZCh0ZXJtXzczNi5kaXNjcmltaW5hbnQpLCBjYXNlczogdGVybV83MzYuY2FzZXMubWFwKGNfNzM3ID0+IHRoaXMuZXhwYW5kKGNfNzM3KSkudG9BcnJheSgpfSk7XG4gIH1cbiAgZXhwYW5kRm9ybWFsUGFyYW1ldGVycyh0ZXJtXzczOCkge1xuICAgIGxldCByZXN0XzczOSA9IHRlcm1fNzM4LnJlc3QgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzczOC5yZXN0KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJGb3JtYWxQYXJhbWV0ZXJzXCIsIHtpdGVtczogdGVybV83MzguaXRlbXMubWFwKGlfNzQwID0+IHRoaXMuZXhwYW5kKGlfNzQwKSksIHJlc3Q6IHJlc3RfNzM5fSk7XG4gIH1cbiAgZXhwYW5kQXJyb3dFeHByZXNzaW9uKHRlcm1fNzQxKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9GdW5jdGlvbkV4cGFuc2lvbih0ZXJtXzc0MSwgXCJBcnJvd0V4cHJlc3Npb25cIik7XG4gIH1cbiAgZXhwYW5kU3dpdGNoRGVmYXVsdCh0ZXJtXzc0Mikge1xuICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaERlZmF1bHRcIiwge2NvbnNlcXVlbnQ6IHRlcm1fNzQyLmNvbnNlcXVlbnQubWFwKGNfNzQzID0+IHRoaXMuZXhwYW5kKGNfNzQzKSkudG9BcnJheSgpfSk7XG4gIH1cbiAgZXhwYW5kU3dpdGNoQ2FzZSh0ZXJtXzc0NCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIlN3aXRjaENhc2VcIiwge3Rlc3Q6IHRoaXMuZXhwYW5kKHRlcm1fNzQ0LnRlc3QpLCBjb25zZXF1ZW50OiB0ZXJtXzc0NC5jb25zZXF1ZW50Lm1hcChjXzc0NSA9PiB0aGlzLmV4cGFuZChjXzc0NSkpLnRvQXJyYXkoKX0pO1xuICB9XG4gIGV4cGFuZEZvckluU3RhdGVtZW50KHRlcm1fNzQ2KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRm9ySW5TdGF0ZW1lbnRcIiwge2xlZnQ6IHRoaXMuZXhwYW5kKHRlcm1fNzQ2LmxlZnQpLCByaWdodDogdGhpcy5leHBhbmQodGVybV83NDYucmlnaHQpLCBib2R5OiB0aGlzLmV4cGFuZCh0ZXJtXzc0Ni5ib2R5KX0pO1xuICB9XG4gIGV4cGFuZFRyeUNhdGNoU3RhdGVtZW50KHRlcm1fNzQ3KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVHJ5Q2F0Y2hTdGF0ZW1lbnRcIiwge2JvZHk6IHRoaXMuZXhwYW5kKHRlcm1fNzQ3LmJvZHkpLCBjYXRjaENsYXVzZTogdGhpcy5leHBhbmQodGVybV83NDcuY2F0Y2hDbGF1c2UpfSk7XG4gIH1cbiAgZXhwYW5kVHJ5RmluYWxseVN0YXRlbWVudCh0ZXJtXzc0OCkge1xuICAgIGxldCBjYXRjaENsYXVzZV83NDkgPSB0ZXJtXzc0OC5jYXRjaENsYXVzZSA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fNzQ4LmNhdGNoQ2xhdXNlKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJUcnlGaW5hbGx5U3RhdGVtZW50XCIsIHtib2R5OiB0aGlzLmV4cGFuZCh0ZXJtXzc0OC5ib2R5KSwgY2F0Y2hDbGF1c2U6IGNhdGNoQ2xhdXNlXzc0OSwgZmluYWxpemVyOiB0aGlzLmV4cGFuZCh0ZXJtXzc0OC5maW5hbGl6ZXIpfSk7XG4gIH1cbiAgZXhwYW5kQ2F0Y2hDbGF1c2UodGVybV83NTApIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJDYXRjaENsYXVzZVwiLCB7YmluZGluZzogdGhpcy5leHBhbmQodGVybV83NTAuYmluZGluZyksIGJvZHk6IHRoaXMuZXhwYW5kKHRlcm1fNzUwLmJvZHkpfSk7XG4gIH1cbiAgZXhwYW5kVGhyb3dTdGF0ZW1lbnQodGVybV83NTEpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJUaHJvd1N0YXRlbWVudFwiLCB7ZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV83NTEuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRGb3JPZlN0YXRlbWVudCh0ZXJtXzc1Mikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkZvck9mU3RhdGVtZW50XCIsIHtsZWZ0OiB0aGlzLmV4cGFuZCh0ZXJtXzc1Mi5sZWZ0KSwgcmlnaHQ6IHRoaXMuZXhwYW5kKHRlcm1fNzUyLnJpZ2h0KSwgYm9keTogdGhpcy5leHBhbmQodGVybV83NTIuYm9keSl9KTtcbiAgfVxuICBleHBhbmRCaW5kaW5nSWRlbnRpZmllcih0ZXJtXzc1Mykge1xuICAgIHJldHVybiB0ZXJtXzc1MztcbiAgfVxuICBleHBhbmRCaW5kaW5nUHJvcGVydHlJZGVudGlmaWVyKHRlcm1fNzU0KSB7XG4gICAgcmV0dXJuIHRlcm1fNzU0O1xuICB9XG4gIGV4cGFuZEJpbmRpbmdQcm9wZXJ0eVByb3BlcnR5KHRlcm1fNzU1KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluZGluZ1Byb3BlcnR5UHJvcGVydHlcIiwge25hbWU6IHRoaXMuZXhwYW5kKHRlcm1fNzU1Lm5hbWUpLCBiaW5kaW5nOiB0aGlzLmV4cGFuZCh0ZXJtXzc1NS5iaW5kaW5nKX0pO1xuICB9XG4gIGV4cGFuZENvbXB1dGVkUHJvcGVydHlOYW1lKHRlcm1fNzU2KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ29tcHV0ZWRQcm9wZXJ0eU5hbWVcIiwge2V4cHJlc3Npb246IHRoaXMuZXhwYW5kKHRlcm1fNzU2LmV4cHJlc3Npb24pfSk7XG4gIH1cbiAgZXhwYW5kT2JqZWN0QmluZGluZyh0ZXJtXzc1Nykge1xuICAgIHJldHVybiBuZXcgVGVybShcIk9iamVjdEJpbmRpbmdcIiwge3Byb3BlcnRpZXM6IHRlcm1fNzU3LnByb3BlcnRpZXMubWFwKHRfNzU4ID0+IHRoaXMuZXhwYW5kKHRfNzU4KSkudG9BcnJheSgpfSk7XG4gIH1cbiAgZXhwYW5kQXJyYXlCaW5kaW5nKHRlcm1fNzU5KSB7XG4gICAgbGV0IHJlc3RFbGVtZW50Xzc2MCA9IHRlcm1fNzU5LnJlc3RFbGVtZW50ID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV83NTkucmVzdEVsZW1lbnQpO1xuICAgIHJldHVybiBuZXcgVGVybShcIkFycmF5QmluZGluZ1wiLCB7ZWxlbWVudHM6IHRlcm1fNzU5LmVsZW1lbnRzLm1hcCh0Xzc2MSA9PiB0Xzc2MSA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRfNzYxKSkudG9BcnJheSgpLCByZXN0RWxlbWVudDogcmVzdEVsZW1lbnRfNzYwfSk7XG4gIH1cbiAgZXhwYW5kQmluZGluZ1dpdGhEZWZhdWx0KHRlcm1fNzYyKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluZGluZ1dpdGhEZWZhdWx0XCIsIHtiaW5kaW5nOiB0aGlzLmV4cGFuZCh0ZXJtXzc2Mi5iaW5kaW5nKSwgaW5pdDogdGhpcy5leHBhbmQodGVybV83NjIuaW5pdCl9KTtcbiAgfVxuICBleHBhbmRTaG9ydGhhbmRQcm9wZXJ0eSh0ZXJtXzc2Mykge1xuICAgIHJldHVybiBuZXcgVGVybShcIkRhdGFQcm9wZXJ0eVwiLCB7bmFtZTogbmV3IFRlcm0oXCJTdGF0aWNQcm9wZXJ0eU5hbWVcIiwge3ZhbHVlOiB0ZXJtXzc2My5uYW1lfSksIGV4cHJlc3Npb246IG5ldyBUZXJtKFwiSWRlbnRpZmllckV4cHJlc3Npb25cIiwge25hbWU6IHRlcm1fNzYzLm5hbWV9KX0pO1xuICB9XG4gIGV4cGFuZEZvclN0YXRlbWVudCh0ZXJtXzc2NCkge1xuICAgIGxldCBpbml0Xzc2NSA9IHRlcm1fNzY0LmluaXQgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzc2NC5pbml0KTtcbiAgICBsZXQgdGVzdF83NjYgPSB0ZXJtXzc2NC50ZXN0ID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV83NjQudGVzdCk7XG4gICAgbGV0IHVwZGF0ZV83NjcgPSB0ZXJtXzc2NC51cGRhdGUgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzc2NC51cGRhdGUpO1xuICAgIGxldCBib2R5Xzc2OCA9IHRoaXMuZXhwYW5kKHRlcm1fNzY0LmJvZHkpO1xuICAgIHJldHVybiBuZXcgVGVybShcIkZvclN0YXRlbWVudFwiLCB7aW5pdDogaW5pdF83NjUsIHRlc3Q6IHRlc3RfNzY2LCB1cGRhdGU6IHVwZGF0ZV83NjcsIGJvZHk6IGJvZHlfNzY4fSk7XG4gIH1cbiAgZXhwYW5kWWllbGRFeHByZXNzaW9uKHRlcm1fNzY5KSB7XG4gICAgbGV0IGV4cHJfNzcwID0gdGVybV83NjkuZXhwcmVzc2lvbiA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fNzY5LmV4cHJlc3Npb24pO1xuICAgIHJldHVybiBuZXcgVGVybShcIllpZWxkRXhwcmVzc2lvblwiLCB7ZXhwcmVzc2lvbjogZXhwcl83NzB9KTtcbiAgfVxuICBleHBhbmRZaWVsZEdlbmVyYXRvckV4cHJlc3Npb24odGVybV83NzEpIHtcbiAgICBsZXQgZXhwcl83NzIgPSB0ZXJtXzc3MS5leHByZXNzaW9uID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV83NzEuZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiWWllbGRHZW5lcmF0b3JFeHByZXNzaW9uXCIsIHtleHByZXNzaW9uOiBleHByXzc3Mn0pO1xuICB9XG4gIGV4cGFuZFdoaWxlU3RhdGVtZW50KHRlcm1fNzczKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiV2hpbGVTdGF0ZW1lbnRcIiwge3Rlc3Q6IHRoaXMuZXhwYW5kKHRlcm1fNzczLnRlc3QpLCBib2R5OiB0aGlzLmV4cGFuZCh0ZXJtXzc3My5ib2R5KX0pO1xuICB9XG4gIGV4cGFuZElmU3RhdGVtZW50KHRlcm1fNzc0KSB7XG4gICAgbGV0IGNvbnNlcXVlbnRfNzc1ID0gdGVybV83NzQuY29uc2VxdWVudCA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fNzc0LmNvbnNlcXVlbnQpO1xuICAgIGxldCBhbHRlcm5hdGVfNzc2ID0gdGVybV83NzQuYWx0ZXJuYXRlID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV83NzQuYWx0ZXJuYXRlKTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJJZlN0YXRlbWVudFwiLCB7dGVzdDogdGhpcy5leHBhbmQodGVybV83NzQudGVzdCksIGNvbnNlcXVlbnQ6IGNvbnNlcXVlbnRfNzc1LCBhbHRlcm5hdGU6IGFsdGVybmF0ZV83NzZ9KTtcbiAgfVxuICBleHBhbmRCbG9ja1N0YXRlbWVudCh0ZXJtXzc3Nykge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJsb2NrU3RhdGVtZW50XCIsIHtibG9jazogdGhpcy5leHBhbmQodGVybV83NzcuYmxvY2spfSk7XG4gIH1cbiAgZXhwYW5kQmxvY2sodGVybV83NzgpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJCbG9ja1wiLCB7c3RhdGVtZW50czogdGVybV83Nzguc3RhdGVtZW50cy5tYXAoc183NzkgPT4gdGhpcy5leHBhbmQoc183NzkpKS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50KHRlcm1fNzgwKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVmFyaWFibGVEZWNsYXJhdGlvblN0YXRlbWVudFwiLCB7ZGVjbGFyYXRpb246IHRoaXMuZXhwYW5kKHRlcm1fNzgwLmRlY2xhcmF0aW9uKX0pO1xuICB9XG4gIGV4cGFuZFJldHVyblN0YXRlbWVudCh0ZXJtXzc4MSkge1xuICAgIGlmICh0ZXJtXzc4MS5leHByZXNzaW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiB0ZXJtXzc4MTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiUmV0dXJuU3RhdGVtZW50XCIsIHtleHByZXNzaW9uOiB0aGlzLmV4cGFuZCh0ZXJtXzc4MS5leHByZXNzaW9uKX0pO1xuICB9XG4gIGV4cGFuZENsYXNzRGVjbGFyYXRpb24odGVybV83ODIpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJDbGFzc0RlY2xhcmF0aW9uXCIsIHtuYW1lOiB0ZXJtXzc4Mi5uYW1lID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV83ODIubmFtZSksIHN1cGVyOiB0ZXJtXzc4Mi5zdXBlciA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fNzgyLnN1cGVyKSwgZWxlbWVudHM6IHRlcm1fNzgyLmVsZW1lbnRzLm1hcChlbF83ODMgPT4gdGhpcy5leHBhbmQoZWxfNzgzKSkudG9BcnJheSgpfSk7XG4gIH1cbiAgZXhwYW5kQ2xhc3NFeHByZXNzaW9uKHRlcm1fNzg0KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2xhc3NFeHByZXNzaW9uXCIsIHtuYW1lOiB0ZXJtXzc4NC5uYW1lID09IG51bGwgPyBudWxsIDogdGhpcy5leHBhbmQodGVybV83ODQubmFtZSksIHN1cGVyOiB0ZXJtXzc4NC5zdXBlciA9PSBudWxsID8gbnVsbCA6IHRoaXMuZXhwYW5kKHRlcm1fNzg0LnN1cGVyKSwgZWxlbWVudHM6IHRlcm1fNzg0LmVsZW1lbnRzLm1hcChlbF83ODUgPT4gdGhpcy5leHBhbmQoZWxfNzg1KSkudG9BcnJheSgpfSk7XG4gIH1cbiAgZXhwYW5kQ2xhc3NFbGVtZW50KHRlcm1fNzg2KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2xhc3NFbGVtZW50XCIsIHtpc1N0YXRpYzogdGVybV83ODYuaXNTdGF0aWMsIG1ldGhvZDogdGhpcy5leHBhbmQodGVybV83ODYubWV0aG9kKX0pO1xuICB9XG4gIGV4cGFuZFRoaXNFeHByZXNzaW9uKHRlcm1fNzg3KSB7XG4gICAgcmV0dXJuIHRlcm1fNzg3O1xuICB9XG4gIGV4cGFuZFN5bnRheFRlbXBsYXRlKHRlcm1fNzg4KSB7XG4gICAgbGV0IGV4cGFuZGVyXzc4OSA9IG5ldyBFeHBhbmRlcih0aGlzLmNvbnRleHQpO1xuICAgIGxldCByXzc5MCA9IHByb2Nlc3NUZW1wbGF0ZSh0ZXJtXzc4OC50ZW1wbGF0ZS5pbm5lcigpKTtcbiAgICBsZXQgc3RyXzc5MSA9IFN5bnRheC5mcm9tU3RyaW5nKHNlcmlhbGl6ZXIud3JpdGUocl83OTAudGVtcGxhdGUpKTtcbiAgICBsZXQgY2FsbGVlXzc5MiA9IG5ldyBUZXJtKFwiSWRlbnRpZmllckV4cHJlc3Npb25cIiwge25hbWU6IFN5bnRheC5mcm9tSWRlbnRpZmllcihcInN5bnRheFRlbXBsYXRlXCIpfSk7XG4gICAgbGV0IGV4cGFuZGVkSW50ZXJwc183OTMgPSByXzc5MC5pbnRlcnAubWFwKGlfNzk1ID0+IHtcbiAgICAgIGxldCBlbmZfNzk2ID0gbmV3IEVuZm9yZXN0ZXIoaV83OTUsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICAgIHJldHVybiB0aGlzLmV4cGFuZChlbmZfNzk2LmVuZm9yZXN0KFwiZXhwcmVzc2lvblwiKSk7XG4gICAgfSk7XG4gICAgbGV0IGFyZ3NfNzk0ID0gTGlzdC5vZihuZXcgVGVybShcIkxpdGVyYWxTdHJpbmdFeHByZXNzaW9uXCIsIHt2YWx1ZTogc3RyXzc5MX0pKS5jb25jYXQoZXhwYW5kZWRJbnRlcnBzXzc5Myk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2FsbEV4cHJlc3Npb25cIiwge2NhbGxlZTogY2FsbGVlXzc5MiwgYXJndW1lbnRzOiBhcmdzXzc5NH0pO1xuICB9XG4gIGV4cGFuZFN5bnRheFF1b3RlKHRlcm1fNzk3KSB7XG4gICAgbGV0IHN0cl83OTggPSBuZXcgVGVybShcIkxpdGVyYWxTdHJpbmdFeHByZXNzaW9uXCIsIHt2YWx1ZTogU3ludGF4LmZyb21TdHJpbmcoc2VyaWFsaXplci53cml0ZSh0ZXJtXzc5Ny5uYW1lKSl9KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJUZW1wbGF0ZUV4cHJlc3Npb25cIiwge3RhZzogdGVybV83OTcudGVtcGxhdGUudGFnLCBlbGVtZW50czogdGVybV83OTcudGVtcGxhdGUuZWxlbWVudHMucHVzaChzdHJfNzk4KS5wdXNoKG5ldyBUZXJtKFwiVGVtcGxhdGVFbGVtZW50XCIsIHtyYXdWYWx1ZTogXCJcIn0pKS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRTdGF0aWNNZW1iZXJFeHByZXNzaW9uKHRlcm1fNzk5KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiU3RhdGljTWVtYmVyRXhwcmVzc2lvblwiLCB7b2JqZWN0OiB0aGlzLmV4cGFuZCh0ZXJtXzc5OS5vYmplY3QpLCBwcm9wZXJ0eTogdGVybV83OTkucHJvcGVydHl9KTtcbiAgfVxuICBleHBhbmRBcnJheUV4cHJlc3Npb24odGVybV84MDApIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJBcnJheUV4cHJlc3Npb25cIiwge2VsZW1lbnRzOiB0ZXJtXzgwMC5lbGVtZW50cy5tYXAodF84MDEgPT4gdF84MDEgPT0gbnVsbCA/IHRfODAxIDogdGhpcy5leHBhbmQodF84MDEpKX0pO1xuICB9XG4gIGV4cGFuZEltcG9ydCh0ZXJtXzgwMikge1xuICAgIHJldHVybiB0ZXJtXzgwMjtcbiAgfVxuICBleHBhbmRJbXBvcnROYW1lc3BhY2UodGVybV84MDMpIHtcbiAgICByZXR1cm4gdGVybV84MDM7XG4gIH1cbiAgZXhwYW5kRXhwb3J0KHRlcm1fODA0KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwb3J0XCIsIHtkZWNsYXJhdGlvbjogdGhpcy5leHBhbmQodGVybV84MDQuZGVjbGFyYXRpb24pfSk7XG4gIH1cbiAgZXhwYW5kRXhwb3J0RGVmYXVsdCh0ZXJtXzgwNSkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydERlZmF1bHRcIiwge2JvZHk6IHRoaXMuZXhwYW5kKHRlcm1fODA1LmJvZHkpfSk7XG4gIH1cbiAgZXhwYW5kRXhwb3J0RnJvbSh0ZXJtXzgwNikge1xuICAgIHJldHVybiB0ZXJtXzgwNjtcbiAgfVxuICBleHBhbmRFeHBvcnRBbGxGcm9tKHRlcm1fODA3KSB7XG4gICAgcmV0dXJuIHRlcm1fODA3O1xuICB9XG4gIGV4cGFuZEV4cG9ydFNwZWNpZmllcih0ZXJtXzgwOCkge1xuICAgIHJldHVybiB0ZXJtXzgwODtcbiAgfVxuICBleHBhbmRTdGF0aWNQcm9wZXJ0eU5hbWUodGVybV84MDkpIHtcbiAgICByZXR1cm4gdGVybV84MDk7XG4gIH1cbiAgZXhwYW5kRGF0YVByb3BlcnR5KHRlcm1fODEwKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRGF0YVByb3BlcnR5XCIsIHtuYW1lOiB0aGlzLmV4cGFuZCh0ZXJtXzgxMC5uYW1lKSwgZXhwcmVzc2lvbjogdGhpcy5leHBhbmQodGVybV84MTAuZXhwcmVzc2lvbil9KTtcbiAgfVxuICBleHBhbmRPYmplY3RFeHByZXNzaW9uKHRlcm1fODExKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiT2JqZWN0RXhwcmVzc2lvblwiLCB7cHJvcGVydGllczogdGVybV84MTEucHJvcGVydGllcy5tYXAodF84MTIgPT4gdGhpcy5leHBhbmQodF84MTIpKX0pO1xuICB9XG4gIGV4cGFuZFZhcmlhYmxlRGVjbGFyYXRvcih0ZXJtXzgxMykge1xuICAgIGxldCBpbml0XzgxNCA9IHRlcm1fODEzLmluaXQgPT0gbnVsbCA/IG51bGwgOiB0aGlzLmV4cGFuZCh0ZXJtXzgxMy5pbml0KTtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJWYXJpYWJsZURlY2xhcmF0b3JcIiwge2JpbmRpbmc6IHRoaXMuZXhwYW5kKHRlcm1fODEzLmJpbmRpbmcpLCBpbml0OiBpbml0XzgxNH0pO1xuICB9XG4gIGV4cGFuZFZhcmlhYmxlRGVjbGFyYXRpb24odGVybV84MTUpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJWYXJpYWJsZURlY2xhcmF0aW9uXCIsIHtraW5kOiB0ZXJtXzgxNS5raW5kLCBkZWNsYXJhdG9yczogdGVybV84MTUuZGVjbGFyYXRvcnMubWFwKGRfODE2ID0+IHRoaXMuZXhwYW5kKGRfODE2KSl9KTtcbiAgfVxuICBleHBhbmRQYXJlbnRoZXNpemVkRXhwcmVzc2lvbih0ZXJtXzgxNykge1xuICAgIGlmICh0ZXJtXzgxNy5pbm5lci5zaXplID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ1bmV4cGVjdGVkIGVuZCBvZiBpbnB1dFwiKTtcbiAgICB9XG4gICAgbGV0IGVuZl84MTggPSBuZXcgRW5mb3Jlc3Rlcih0ZXJtXzgxNy5pbm5lciwgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBsb29rYWhlYWRfODE5ID0gZW5mXzgxOC5wZWVrKCk7XG4gICAgbGV0IHRfODIwID0gZW5mXzgxOC5lbmZvcmVzdEV4cHJlc3Npb24oKTtcbiAgICBpZiAodF84MjAgPT0gbnVsbCB8fCBlbmZfODE4LnJlc3Quc2l6ZSA+IDApIHtcbiAgICAgIHRocm93IGVuZl84MTguY3JlYXRlRXJyb3IobG9va2FoZWFkXzgxOSwgXCJ1bmV4cGVjdGVkIHN5bnRheFwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5kKHRfODIwKTtcbiAgfVxuICBleHBhbmRVbmFyeUV4cHJlc3Npb24odGVybV84MjEpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJVbmFyeUV4cHJlc3Npb25cIiwge29wZXJhdG9yOiB0ZXJtXzgyMS5vcGVyYXRvciwgb3BlcmFuZDogdGhpcy5leHBhbmQodGVybV84MjEub3BlcmFuZCl9KTtcbiAgfVxuICBleHBhbmRVcGRhdGVFeHByZXNzaW9uKHRlcm1fODIyKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiVXBkYXRlRXhwcmVzc2lvblwiLCB7aXNQcmVmaXg6IHRlcm1fODIyLmlzUHJlZml4LCBvcGVyYXRvcjogdGVybV84MjIub3BlcmF0b3IsIG9wZXJhbmQ6IHRoaXMuZXhwYW5kKHRlcm1fODIyLm9wZXJhbmQpfSk7XG4gIH1cbiAgZXhwYW5kQmluYXJ5RXhwcmVzc2lvbih0ZXJtXzgyMykge1xuICAgIGxldCBsZWZ0XzgyNCA9IHRoaXMuZXhwYW5kKHRlcm1fODIzLmxlZnQpO1xuICAgIGxldCByaWdodF84MjUgPSB0aGlzLmV4cGFuZCh0ZXJtXzgyMy5yaWdodCk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQmluYXJ5RXhwcmVzc2lvblwiLCB7bGVmdDogbGVmdF84MjQsIG9wZXJhdG9yOiB0ZXJtXzgyMy5vcGVyYXRvciwgcmlnaHQ6IHJpZ2h0XzgyNX0pO1xuICB9XG4gIGV4cGFuZENvbmRpdGlvbmFsRXhwcmVzc2lvbih0ZXJtXzgyNikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbmRpdGlvbmFsRXhwcmVzc2lvblwiLCB7dGVzdDogdGhpcy5leHBhbmQodGVybV84MjYudGVzdCksIGNvbnNlcXVlbnQ6IHRoaXMuZXhwYW5kKHRlcm1fODI2LmNvbnNlcXVlbnQpLCBhbHRlcm5hdGU6IHRoaXMuZXhwYW5kKHRlcm1fODI2LmFsdGVybmF0ZSl9KTtcbiAgfVxuICBleHBhbmROZXdUYXJnZXRFeHByZXNzaW9uKHRlcm1fODI3KSB7XG4gICAgcmV0dXJuIHRlcm1fODI3O1xuICB9XG4gIGV4cGFuZE5ld0V4cHJlc3Npb24odGVybV84MjgpIHtcbiAgICBsZXQgY2FsbGVlXzgyOSA9IHRoaXMuZXhwYW5kKHRlcm1fODI4LmNhbGxlZSk7XG4gICAgbGV0IGVuZl84MzAgPSBuZXcgRW5mb3Jlc3Rlcih0ZXJtXzgyOC5hcmd1bWVudHMsIExpc3QoKSwgdGhpcy5jb250ZXh0KTtcbiAgICBsZXQgYXJnc184MzEgPSBlbmZfODMwLmVuZm9yZXN0QXJndW1lbnRMaXN0KCkubWFwKGFyZ184MzIgPT4gdGhpcy5leHBhbmQoYXJnXzgzMikpO1xuICAgIHJldHVybiBuZXcgVGVybShcIk5ld0V4cHJlc3Npb25cIiwge2NhbGxlZTogY2FsbGVlXzgyOSwgYXJndW1lbnRzOiBhcmdzXzgzMS50b0FycmF5KCl9KTtcbiAgfVxuICBleHBhbmRTdXBlcih0ZXJtXzgzMykge1xuICAgIHJldHVybiB0ZXJtXzgzMztcbiAgfVxuICBleHBhbmRDYWxsRXhwcmVzc2lvbih0ZXJtXzgzNCkge1xuICAgIGxldCBjYWxsZWVfODM1ID0gdGhpcy5leHBhbmQodGVybV84MzQuY2FsbGVlKTtcbiAgICBsZXQgZW5mXzgzNiA9IG5ldyBFbmZvcmVzdGVyKHRlcm1fODM0LmFyZ3VtZW50cywgTGlzdCgpLCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBhcmdzXzgzNyA9IGVuZl84MzYuZW5mb3Jlc3RBcmd1bWVudExpc3QoKS5tYXAoYXJnXzgzOCA9PiB0aGlzLmV4cGFuZChhcmdfODM4KSk7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiQ2FsbEV4cHJlc3Npb25cIiwge2NhbGxlZTogY2FsbGVlXzgzNSwgYXJndW1lbnRzOiBhcmdzXzgzN30pO1xuICB9XG4gIGV4cGFuZFNwcmVhZEVsZW1lbnQodGVybV84MzkpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTcHJlYWRFbGVtZW50XCIsIHtleHByZXNzaW9uOiB0aGlzLmV4cGFuZCh0ZXJtXzgzOS5leHByZXNzaW9uKX0pO1xuICB9XG4gIGV4cGFuZEV4cHJlc3Npb25TdGF0ZW1lbnQodGVybV84NDApIHtcbiAgICBsZXQgY2hpbGRfODQxID0gdGhpcy5leHBhbmQodGVybV84NDAuZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRXhwcmVzc2lvblN0YXRlbWVudFwiLCB7ZXhwcmVzc2lvbjogY2hpbGRfODQxfSk7XG4gIH1cbiAgZXhwYW5kTGFiZWxlZFN0YXRlbWVudCh0ZXJtXzg0Mikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkxhYmVsZWRTdGF0ZW1lbnRcIiwge2xhYmVsOiB0ZXJtXzg0Mi5sYWJlbC52YWwoKSwgYm9keTogdGhpcy5leHBhbmQodGVybV84NDIuYm9keSl9KTtcbiAgfVxuICBkb0Z1bmN0aW9uRXhwYW5zaW9uKHRlcm1fODQzLCB0eXBlXzg0NCkge1xuICAgIGxldCBzY29wZV84NDUgPSBmcmVzaFNjb3BlKFwiZnVuXCIpO1xuICAgIGxldCByZWRfODQ2ID0gbmV3IEFwcGx5U2NvcGVJblBhcmFtc1JlZHVjZXIoc2NvcGVfODQ1LCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBwYXJhbXNfODQ3O1xuICAgIGlmICh0eXBlXzg0NCAhPT0gXCJHZXR0ZXJcIiAmJiB0eXBlXzg0NCAhPT0gXCJTZXR0ZXJcIikge1xuICAgICAgcGFyYW1zXzg0NyA9IHJlZF84NDYudHJhbnNmb3JtKHRlcm1fODQzLnBhcmFtcyk7XG4gICAgICBwYXJhbXNfODQ3ID0gdGhpcy5leHBhbmQocGFyYW1zXzg0Nyk7XG4gICAgfVxuICAgIHRoaXMuY29udGV4dC5jdXJyZW50U2NvcGUucHVzaChzY29wZV84NDUpO1xuICAgIGxldCBleHBhbmRlcl84NDggPSBuZXcgRXhwYW5kZXIodGhpcy5jb250ZXh0KTtcbiAgICBsZXQgbWFya2VkQm9keV84NDksIGJvZHlUZXJtXzg1MDtcbiAgICBpZiAodGVybV84NDMuYm9keSBpbnN0YW5jZW9mIFRlcm0pIHtcbiAgICAgIGJvZHlUZXJtXzg1MCA9IHRoaXMuZXhwYW5kKHRlcm1fODQzLmJvZHkuYWRkU2NvcGUoc2NvcGVfODQ1LCB0aGlzLmNvbnRleHQuYmluZGluZ3MpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFya2VkQm9keV84NDkgPSB0ZXJtXzg0My5ib2R5Lm1hcChiXzg1MSA9PiBiXzg1MS5hZGRTY29wZShzY29wZV84NDUsIHRoaXMuY29udGV4dC5iaW5kaW5ncykpO1xuICAgICAgYm9keVRlcm1fODUwID0gbmV3IFRlcm0oXCJGdW5jdGlvbkJvZHlcIiwge2RpcmVjdGl2ZXM6IExpc3QoKSwgc3RhdGVtZW50czogZXhwYW5kZXJfODQ4LmV4cGFuZChtYXJrZWRCb2R5Xzg0OSl9KTtcbiAgICB9XG4gICAgdGhpcy5jb250ZXh0LmN1cnJlbnRTY29wZS5wb3AoKTtcbiAgICBpZiAodHlwZV84NDQgPT09IFwiR2V0dGVyXCIpIHtcbiAgICAgIHJldHVybiBuZXcgVGVybSh0eXBlXzg0NCwge25hbWU6IHRoaXMuZXhwYW5kKHRlcm1fODQzLm5hbWUpLCBib2R5OiBib2R5VGVybV84NTB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVfODQ0ID09PSBcIlNldHRlclwiKSB7XG4gICAgICByZXR1cm4gbmV3IFRlcm0odHlwZV84NDQsIHtuYW1lOiB0aGlzLmV4cGFuZCh0ZXJtXzg0My5uYW1lKSwgcGFyYW06IHRlcm1fODQzLnBhcmFtLCBib2R5OiBib2R5VGVybV84NTB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBUZXJtKHR5cGVfODQ0LCB7bmFtZTogdGVybV84NDMubmFtZSwgaXNHZW5lcmF0b3I6IHRlcm1fODQzLmlzR2VuZXJhdG9yLCBwYXJhbXM6IHBhcmFtc184NDcsIGJvZHk6IGJvZHlUZXJtXzg1MH0pO1xuICB9XG4gIGV4cGFuZE1ldGhvZCh0ZXJtXzg1Mikge1xuICAgIHJldHVybiB0aGlzLmRvRnVuY3Rpb25FeHBhbnNpb24odGVybV84NTIsIFwiTWV0aG9kXCIpO1xuICB9XG4gIGV4cGFuZFNldHRlcih0ZXJtXzg1Mykge1xuICAgIHJldHVybiB0aGlzLmRvRnVuY3Rpb25FeHBhbnNpb24odGVybV84NTMsIFwiU2V0dGVyXCIpO1xuICB9XG4gIGV4cGFuZEdldHRlcih0ZXJtXzg1NCkge1xuICAgIHJldHVybiB0aGlzLmRvRnVuY3Rpb25FeHBhbnNpb24odGVybV84NTQsIFwiR2V0dGVyXCIpO1xuICB9XG4gIGV4cGFuZEZ1bmN0aW9uRGVjbGFyYXRpb24odGVybV84NTUpIHtcbiAgICByZXR1cm4gdGhpcy5kb0Z1bmN0aW9uRXhwYW5zaW9uKHRlcm1fODU1LCBcIkZ1bmN0aW9uRGVjbGFyYXRpb25cIik7XG4gIH1cbiAgZXhwYW5kRnVuY3Rpb25FeHByZXNzaW9uKHRlcm1fODU2KSB7XG4gICAgcmV0dXJuIHRoaXMuZG9GdW5jdGlvbkV4cGFuc2lvbih0ZXJtXzg1NiwgXCJGdW5jdGlvbkV4cHJlc3Npb25cIik7XG4gIH1cbiAgZXhwYW5kQ29tcG91bmRBc3NpZ25tZW50RXhwcmVzc2lvbih0ZXJtXzg1Nykge1xuICAgIHJldHVybiBuZXcgVGVybShcIkNvbXBvdW5kQXNzaWdubWVudEV4cHJlc3Npb25cIiwge2JpbmRpbmc6IHRoaXMuZXhwYW5kKHRlcm1fODU3LmJpbmRpbmcpLCBvcGVyYXRvcjogdGVybV84NTcub3BlcmF0b3IsIGV4cHJlc3Npb246IHRoaXMuZXhwYW5kKHRlcm1fODU3LmV4cHJlc3Npb24pfSk7XG4gIH1cbiAgZXhwYW5kQXNzaWdubWVudEV4cHJlc3Npb24odGVybV84NTgpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJBc3NpZ25tZW50RXhwcmVzc2lvblwiLCB7YmluZGluZzogdGhpcy5leHBhbmQodGVybV84NTguYmluZGluZyksIGV4cHJlc3Npb246IHRoaXMuZXhwYW5kKHRlcm1fODU4LmV4cHJlc3Npb24pfSk7XG4gIH1cbiAgZXhwYW5kRW1wdHlTdGF0ZW1lbnQodGVybV84NTkpIHtcbiAgICByZXR1cm4gdGVybV84NTk7XG4gIH1cbiAgZXhwYW5kTGl0ZXJhbEJvb2xlYW5FeHByZXNzaW9uKHRlcm1fODYwKSB7XG4gICAgcmV0dXJuIHRlcm1fODYwO1xuICB9XG4gIGV4cGFuZExpdGVyYWxOdW1lcmljRXhwcmVzc2lvbih0ZXJtXzg2MSkge1xuICAgIHJldHVybiB0ZXJtXzg2MTtcbiAgfVxuICBleHBhbmRMaXRlcmFsSW5maW5pdHlFeHByZXNzaW9uKHRlcm1fODYyKSB7XG4gICAgcmV0dXJuIHRlcm1fODYyO1xuICB9XG4gIGV4cGFuZElkZW50aWZpZXJFeHByZXNzaW9uKHRlcm1fODYzKSB7XG4gICAgbGV0IHRyYW5zXzg2NCA9IHRoaXMuY29udGV4dC5lbnYuZ2V0KHRlcm1fODYzLm5hbWUucmVzb2x2ZSgpKTtcbiAgICBpZiAodHJhbnNfODY0KSB7XG4gICAgICByZXR1cm4gbmV3IFRlcm0oXCJJZGVudGlmaWVyRXhwcmVzc2lvblwiLCB7bmFtZTogdHJhbnNfODY0LmlkfSk7XG4gICAgfVxuICAgIHJldHVybiB0ZXJtXzg2MztcbiAgfVxuICBleHBhbmRMaXRlcmFsTnVsbEV4cHJlc3Npb24odGVybV84NjUpIHtcbiAgICByZXR1cm4gdGVybV84NjU7XG4gIH1cbiAgZXhwYW5kTGl0ZXJhbFN0cmluZ0V4cHJlc3Npb24odGVybV84NjYpIHtcbiAgICByZXR1cm4gdGVybV84NjY7XG4gIH1cbiAgZXhwYW5kTGl0ZXJhbFJlZ0V4cEV4cHJlc3Npb24odGVybV84NjcpIHtcbiAgICByZXR1cm4gdGVybV84Njc7XG4gIH1cbn1cbiJdfQ==