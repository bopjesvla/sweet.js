"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _immutable = require("immutable");

var _enforester = require("./enforester");

var _termExpander = require("./term-expander.js");

var _termExpander2 = _interopRequireDefault(_termExpander);

var _bindingMap = require("./binding-map.js");

var _bindingMap2 = _interopRequireDefault(_bindingMap);

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

var _shiftReader = require("./shift-reader");

var _shiftReader2 = _interopRequireDefault(_shiftReader);

var _ramda = require("ramda");

var _ = _interopRequireWildcard(_ramda);

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _ramdaFantasy = require("ramda-fantasy");

var _symbol = require("./symbol");

var _transforms = require("./transforms");

var _errors = require("./errors");

var _loadSyntax = require("./load-syntax");

var _loadSyntax2 = _interopRequireDefault(_loadSyntax);

var _scope = require("./scope");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Just_877 = _ramdaFantasy.Maybe.Just;
var Nothing_878 = _ramdaFantasy.Maybe.Nothing;
var registerSyntax_879 = function registerSyntax_879(stx_884, context_885) {
  var newBinding_886 = (0, _symbol.gensym)(stx_884.val());
  context_885.env.set(newBinding_886.toString(), new _transforms.VarBindingTransform(stx_884));
  context_885.bindings.add(stx_884, { binding: newBinding_886, phase: 0, skipDup: true });
};
var registerBindings_880 = _.cond([[_terms.isBindingIdentifier, function (_ref, context_887) {
  var name = _ref.name;

  registerSyntax_879(name, context_887);
}], [_terms.isBindingPropertyIdentifier, function (_ref2, context_888) {
  var binding = _ref2.binding;

  registerBindings_880(binding, context_888);
}], [_terms.isBindingPropertyProperty, function (_ref3, context_889) {
  var binding = _ref3.binding;

  registerBindings_880(binding, context_889);
}], [_terms.isArrayBinding, function (_ref4, context_890) {
  var elements = _ref4.elements;
  var restElement = _ref4.restElement;

  if (restElement != null) {
    registerBindings_880(restElement, context_890);
  }
  elements.forEach(function (el_891) {
    if (el_891 != null) {
      registerBindings_880(el_891, context_890);
    }
  });
}], [_terms.isObjectBinding, function (_ref5, context_892) {
  var properties = _ref5.properties;
}], [_.T, function (binding_893) {
  return (0, _errors.assert)(false, "not implemented yet for: " + binding_893.type);
}]]);
var removeScope_881 = _.cond([[_terms.isBindingIdentifier, function (_ref6, scope_894) {
  var name = _ref6.name;
  return new _terms2.default("BindingIdentifier", { name: name.removeScope(scope_894) });
}], [_terms.isArrayBinding, function (_ref7, scope_895) {
  var elements = _ref7.elements;
  var restElement = _ref7.restElement;

  return new _terms2.default("ArrayBinding", { elements: elements.map(function (el_896) {
      return el_896 == null ? null : removeScope_881(el_896, scope_895);
    }), restElement: restElement == null ? null : removeScope_881(restElement, scope_895) });
}], [_terms.isBindingPropertyIdentifier, function (_ref8, scope_897) {
  var binding = _ref8.binding;
  var init = _ref8.init;
  return new _terms2.default("BindingPropertyIdentifier", { binding: removeScope_881(binding, scope_897), init: init });
}], [_terms.isBindingPropertyProperty, function (_ref9, scope_898) {
  var binding = _ref9.binding;
  var name = _ref9.name;
  return new _terms2.default("BindingPropertyProperty", { binding: removeScope_881(binding, scope_898), name: name });
}], [_terms.isObjectBinding, function (_ref10, scope_899) {
  var properties = _ref10.properties;
  return new _terms2.default("ObjectBinding", { properties: properties.map(function (prop_900) {
      return removeScope_881(prop_900, scope_899);
    }) });
}], [_.T, function (binding_901) {
  return (0, _errors.assert)(false, "not implemented yet for: " + binding_901.type);
}]]);
function findNameInExports_882(name_902, exp_903) {
  var foundNames_904 = exp_903.reduce(function (acc_905, e_906) {
    if (e_906.declaration) {
      return acc_905.concat(e_906.declaration.declarators.reduce(function (acc_907, decl_908) {
        if (decl_908.binding.name.val() === name_902.val()) {
          return acc_907.concat(decl_908.binding.name);
        }
        return acc_907;
      }, (0, _immutable.List)()));
    }
    return acc_905;
  }, (0, _immutable.List)());
  (0, _errors.assert)(foundNames_904.size <= 1, "expecting no more than 1 matching name in exports");
  return foundNames_904.get(0);
}
function bindImports_883(impTerm_909, exModule_910, context_911) {
  var names_912 = [];
  impTerm_909.namedImports.forEach(function (specifier_913) {
    var name_914 = specifier_913.binding.name;
    var exportName_915 = findNameInExports_882(name_914, exModule_910.exportEntries);
    if (exportName_915 != null) {
      var newBinding = (0, _symbol.gensym)(name_914.val());
      context_911.bindings.addForward(name_914, exportName_915, newBinding);
      if (context_911.store.has(exportName_915.resolve())) {
        names_912.push(name_914);
      }
    }
  });
  return (0, _immutable.List)(names_912);
}

var TokenExpander = (function () {
  function TokenExpander(context_916) {
    _classCallCheck(this, TokenExpander);

    this.context = context_916;
  }

  _createClass(TokenExpander, [{
    key: "expand",
    value: function expand(stxl_917) {
      var result_918 = (0, _immutable.List)();
      if (stxl_917.size === 0) {
        return result_918;
      }
      var prev_919 = (0, _immutable.List)();
      var enf_920 = new _enforester.Enforester(stxl_917, prev_919, this.context);
      var self_921 = this;
      while (!enf_920.done) {
        var term = _.pipe(_.bind(enf_920.enforest, enf_920), _.cond([[_terms.isVariableDeclarationStatement, function (term_922) {
          term_922.declaration.declarators = term_922.declaration.declarators.map(function (decl_923) {
            return new _terms2.default("VariableDeclarator", { binding: removeScope_881(decl_923.binding, self_921.context.useScope), init: decl_923.init });
          });
          if ((0, _terms.isSyntaxDeclaration)(term_922.declaration)) {
            (function () {
              var scope = (0, _scope.freshScope)("nonrec");
              term_922.declaration.declarators.forEach(function (decl_924) {
                var name_925 = decl_924.binding.name;
                var nameAdded_926 = name_925.addScope(scope);
                var nameRemoved_927 = name_925.removeScope(self_921.context.currentScope[self_921.context.currentScope.length - 1]);
                var newBinding_928 = (0, _symbol.gensym)(name_925.val());
                self_921.context.bindings.addForward(nameAdded_926, nameRemoved_927, newBinding_928);
                decl_924.init = decl_924.init.addScope(scope, self_921.context.bindings);
              });
            })();
          }
          if ((0, _terms.isSyntaxDeclaration)(term_922.declaration) || (0, _terms.isSyntaxrecDeclaration)(term_922.declaration)) {
            term_922.declaration.declarators.forEach(function (decl_929) {
              registerBindings_880(decl_929.binding, self_921.context);
              (0, _loadSyntax2.default)(decl_929, self_921.context, self_921.context.env);
            });
            return Nothing_878();
          } else {
            term_922.declaration.declarators.forEach(function (decl_930) {
              return registerBindings_880(decl_930.binding, self_921.context);
            });
          }
          return Just_877(term_922);
        }], [_terms.isFunctionWithName, function (term_931) {
          term_931.name = removeScope_881(term_931.name, self_921.context.useScope);
          registerBindings_880(term_931.name, self_921.context);
          return Just_877(term_931);
        }], [_terms.isImport, function (term_932) {
          var mod_933 = self_921.context.modules.load(term_932.moduleSpecifier.val(), self_921.context);
          if (term_932.forSyntax) {
            console.log("import for syntax is not implemented yet");
          } else {
            mod_933.visit(self_921.context);
          }
          var boundNames_934 = bindImports_883(term_932, mod_933, self_921.context);
          if (boundNames_934.size === 0) {
            return Just_877(term_932);
          }
          return Nothing_878();
        }], [_terms.isEOF, Nothing_878], [_.T, Just_877]]), _ramdaFantasy.Maybe.maybe((0, _immutable.List)(), _.identity))();
        result_918 = result_918.concat(term);
      }
      return result_918;
    }
  }]);

  return TokenExpander;
})();

exports.default = TokenExpander;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3Rva2VuLWV4cGFuZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQU1hLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUWQsSUFBTSxRQUFRLEdBQUcsb0JBQU0sSUFBSSxDQUFDO0FBQzVCLElBQU0sV0FBVyxHQUFHLG9CQUFNLE9BQU8sQ0FBQztBQUNsQyxJQUFNLGtCQUFrQixHQUFHLFNBQXJCLGtCQUFrQixDQUFJLE9BQU8sRUFBRSxXQUFXLEVBQUs7QUFDbkQsTUFBSSxjQUFjLEdBQUcsb0JBQU8sT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDM0MsYUFBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxFQUFFLG9DQUF3QixPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ2pGLGFBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztDQUN2RixDQUFDO0FBQ0YsSUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsNkJBQXNCLGdCQUFTLFdBQVcsRUFBSztNQUF2QixJQUFJLFFBQUosSUFBSTs7QUFDN0Qsb0JBQWtCLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0NBQ3ZDLENBQUMsRUFBRSxxQ0FBOEIsaUJBQVksV0FBVyxFQUFLO01BQTFCLE9BQU8sU0FBUCxPQUFPOztBQUN6QyxzQkFBb0IsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7Q0FDNUMsQ0FBQyxFQUFFLG1DQUE0QixpQkFBWSxXQUFXLEVBQUs7TUFBMUIsT0FBTyxTQUFQLE9BQU87O0FBQ3ZDLHNCQUFvQixDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztDQUM1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QyxFQUFFO0FBQzdCLG1CQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztXQUMzQjtBQUNELGlCQUFPLFdBQVcsRUFBRSxDQUFDO1NBQ3RCLENBQUMsRUFBRSxlQUFRLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsb0JBQU0sS0FBSyxDQUFDLHNCQUFNLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNoRixrQkFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDdEM7QUFDRCxhQUFPLFVBQVUsQ0FBQztLQUNuQjs7O1NBMURrQixhQUFhOzs7a0JBQWIsYUFBYSIsImZpbGUiOiJ0b2tlbi1leHBhbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdH0gZnJvbSBcImltbXV0YWJsZVwiO1xuaW1wb3J0IHtlbmZvcmVzdEV4cHIsIEVuZm9yZXN0ZXJ9IGZyb20gXCIuL2VuZm9yZXN0ZXJcIjtcbmltcG9ydCBUZXJtRXhwYW5kZXIgZnJvbSBcIi4vdGVybS1leHBhbmRlci5qc1wiO1xuaW1wb3J0IEJpbmRpbmdNYXAgZnJvbSBcIi4vYmluZGluZy1tYXAuanNcIjtcbmltcG9ydCBFbnYgZnJvbSBcIi4vZW52XCI7XG5pbXBvcnQgUmVhZGVyIGZyb20gXCIuL3NoaWZ0LXJlYWRlclwiO1xuaW1wb3J0ICAqIGFzIF8gZnJvbSBcInJhbWRhXCI7XG5pbXBvcnQgVGVybSwge2lzRU9GLCBpc0JpbmRpbmdJZGVudGlmaWVyLCBpc0JpbmRpbmdQcm9wZXJ0eVByb3BlcnR5LCBpc0JpbmRpbmdQcm9wZXJ0eUlkZW50aWZpZXIsIGlzT2JqZWN0QmluZGluZywgaXNBcnJheUJpbmRpbmcsIGlzRnVuY3Rpb25EZWNsYXJhdGlvbiwgaXNGdW5jdGlvbkV4cHJlc3Npb24sIGlzRnVuY3Rpb25UZXJtLCBpc0Z1bmN0aW9uV2l0aE5hbWUsIGlzU3ludGF4RGVjbGFyYXRpb24sIGlzU3ludGF4cmVjRGVjbGFyYXRpb24sIGlzVmFyaWFibGVEZWNsYXJhdGlvbiwgaXNWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50LCBpc0ltcG9ydCwgaXNFeHBvcnR9IGZyb20gXCIuL3Rlcm1zXCI7XG5pbXBvcnQge01heWJlfSBmcm9tIFwicmFtZGEtZmFudGFzeVwiO1xuaW1wb3J0IHtnZW5zeW19IGZyb20gXCIuL3N5bWJvbFwiO1xuaW1wb3J0IHtWYXJCaW5kaW5nVHJhbnNmb3JtLCBDb21waWxldGltZVRyYW5zZm9ybX0gZnJvbSBcIi4vdHJhbnNmb3Jtc1wiO1xuaW1wb3J0IHtleHBlY3QsIGFzc2VydH0gZnJvbSBcIi4vZXJyb3JzXCI7XG5pbXBvcnQgbG9hZFN5bnRheCBmcm9tIFwiLi9sb2FkLXN5bnRheFwiO1xuaW1wb3J0IHtTY29wZSwgZnJlc2hTY29wZX0gZnJvbSBcIi4vc2NvcGVcIjtcbmNvbnN0IEp1c3RfODc3ID0gTWF5YmUuSnVzdDtcbmNvbnN0IE5vdGhpbmdfODc4ID0gTWF5YmUuTm90aGluZztcbmNvbnN0IHJlZ2lzdGVyU3ludGF4Xzg3OSA9IChzdHhfODg0LCBjb250ZXh0Xzg4NSkgPT4ge1xuICBsZXQgbmV3QmluZGluZ184ODYgPSBnZW5zeW0oc3R4Xzg4NC52YWwoKSk7XG4gIGNvbnRleHRfODg1LmVudi5zZXQobmV3QmluZGluZ184ODYudG9TdHJpbmcoKSwgbmV3IFZhckJpbmRpbmdUcmFuc2Zvcm0oc3R4Xzg4NCkpO1xuICBjb250ZXh0Xzg4NS5iaW5kaW5ncy5hZGQoc3R4Xzg4NCwge2JpbmRpbmc6IG5ld0JpbmRpbmdfODg2LCBwaGFzZTogMCwgc2tpcER1cDogdHJ1ZX0pO1xufTtcbmxldCByZWdpc3RlckJpbmRpbmdzXzg4MCA9IF8uY29uZChbW2lzQmluZGluZ0lkZW50aWZpZXIsICh7bmFtZX0sIGNvbnRleHRfODg3KSA9PiB7XG4gIHJlZ2lzdGVyU3ludGF4Xzg3OShuYW1lLCBjb250ZXh0Xzg4Nyk7XG59XSwgW2lzQmluZGluZ1Byb3BlcnR5SWRlbnRpZmllciwgKHtiaW5kaW5nfSwgY29udGV4dF84ODgpID0+IHtcbiAgcmVnaXN0ZXJCaW5kaW5nc184ODAoYmluZGluZywgY29udGV4dF84ODgpO1xufV0sIFtpc0JpbmRpbmdQcm9wZXJ0eVByb3BlcnR5LCAoe2JpbmRpbmd9LCBjb250ZXh0Xzg4OSkgPT4ge1xuICByZWdpc3RlckJpbmRpbmdzXzg4MChiaW5kaW5nLCBjb250ZXh0Xzg4OSk7XG59XSwgW2lzQXJyYXlCaW5kaW5nLCAoe2VsZW1lbnRzLCByZXN0RWxlbWVudH0sIGNvbnRleHRfODkwKSA9PiB7XG4gIGlmIChyZXN0RWxlbWVudCAhPSBudWxsKSB7XG4gICAgcmVnaXN0ZXJCaW5kaW5nc184ODAocmVzdEVsZW1lbnQsIGNvbnRleHRfODkwKTtcbiAgfVxuICBlbGVtZW50cy5mb3JFYWNoKGVsXzg5MSA9PiB7XG4gICAgaWYgKGVsXzg5MSAhPSBudWxsKSB7XG4gICAgICByZWdpc3RlckJpbmRpbmdzXzg4MChlbF84OTEsIGNvbnRleHRfODkwKTtcbiAgICB9XG4gIH0pO1xufV0sIFtpc09iamVjdEJpbmRpbmcsICh7cHJvcGVydGllc30sIGNvbnRleHRfODkyKSA9PiB7fV0sIFtfLlQsIGJpbmRpbmdfODkzID0+IGFzc2VydChmYWxzZSwgXCJub3QgaW1wbGVtZW50ZWQgeWV0IGZvcjogXCIgKyBiaW5kaW5nXzg5My50eXBlKV1dKTtcbmxldCByZW1vdmVTY29wZV84ODEgPSBfLmNvbmQoW1tpc0JpbmRpbmdJZGVudGlmaWVyLCAoe25hbWV9LCBzY29wZV84OTQpID0+IG5ldyBUZXJtKFwiQmluZGluZ0lkZW50aWZpZXJcIiwge25hbWU6IG5hbWUucmVtb3ZlU2NvcGUoc2NvcGVfODk0KX0pXSwgW2lzQXJyYXlCaW5kaW5nLCAoe2VsZW1lbnRzLCByZXN0RWxlbWVudH0sIHNjb3BlXzg5NSkgPT4ge1xuICByZXR1cm4gbmV3IFRlcm0oXCJBcnJheUJpbmRpbmdcIiwge2VsZW1lbnRzOiBlbGVtZW50cy5tYXAoZWxfODk2ID0+IGVsXzg5NiA9PSBudWxsID8gbnVsbCA6IHJlbW92ZVNjb3BlXzg4MShlbF84OTYsIHNjb3BlXzg5NSkpLCByZXN0RWxlbWVudDogcmVzdEVsZW1lbnQgPT0gbnVsbCA/IG51bGwgOiByZW1vdmVTY29wZV84ODEocmVzdEVsZW1lbnQsIHNjb3BlXzg5NSl9KTtcbn1dLCBbaXNCaW5kaW5nUHJvcGVydHlJZGVudGlmaWVyLCAoe2JpbmRpbmcsIGluaXR9LCBzY29wZV84OTcpID0+IG5ldyBUZXJtKFwiQmluZGluZ1Byb3BlcnR5SWRlbnRpZmllclwiLCB7YmluZGluZzogcmVtb3ZlU2NvcGVfODgxKGJpbmRpbmcsIHNjb3BlXzg5NyksIGluaXQ6IGluaXR9KV0sIFtpc0JpbmRpbmdQcm9wZXJ0eVByb3BlcnR5LCAoe2JpbmRpbmcsIG5hbWV9LCBzY29wZV84OTgpID0+IG5ldyBUZXJtKFwiQmluZGluZ1Byb3BlcnR5UHJvcGVydHlcIiwge2JpbmRpbmc6IHJlbW92ZVNjb3BlXzg4MShiaW5kaW5nLCBzY29wZV84OTgpLCBuYW1lOiBuYW1lfSldLCBbaXNPYmplY3RCaW5kaW5nLCAoe3Byb3BlcnRpZXN9LCBzY29wZV84OTkpID0+IG5ldyBUZXJtKFwiT2JqZWN0QmluZGluZ1wiLCB7cHJvcGVydGllczogcHJvcGVydGllcy5tYXAocHJvcF85MDAgPT4gcmVtb3ZlU2NvcGVfODgxKHByb3BfOTAwLCBzY29wZV84OTkpKX0pXSwgW18uVCwgYmluZGluZ185MDEgPT4gYXNzZXJ0KGZhbHNlLCBcIm5vdCBpbXBsZW1lbnRlZCB5ZXQgZm9yOiBcIiArIGJpbmRpbmdfOTAxLnR5cGUpXV0pO1xuZnVuY3Rpb24gZmluZE5hbWVJbkV4cG9ydHNfODgyKG5hbWVfOTAyLCBleHBfOTAzKSB7XG4gIGxldCBmb3VuZE5hbWVzXzkwNCA9IGV4cF85MDMucmVkdWNlKChhY2NfOTA1LCBlXzkwNikgPT4ge1xuICAgIGlmIChlXzkwNi5kZWNsYXJhdGlvbikge1xuICAgICAgcmV0dXJuIGFjY185MDUuY29uY2F0KGVfOTA2LmRlY2xhcmF0aW9uLmRlY2xhcmF0b3JzLnJlZHVjZSgoYWNjXzkwNywgZGVjbF85MDgpID0+IHtcbiAgICAgICAgaWYgKGRlY2xfOTA4LmJpbmRpbmcubmFtZS52YWwoKSA9PT0gbmFtZV85MDIudmFsKCkpIHtcbiAgICAgICAgICByZXR1cm4gYWNjXzkwNy5jb25jYXQoZGVjbF85MDguYmluZGluZy5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjXzkwNztcbiAgICAgIH0sIExpc3QoKSkpO1xuICAgIH1cbiAgICByZXR1cm4gYWNjXzkwNTtcbiAgfSwgTGlzdCgpKTtcbiAgYXNzZXJ0KGZvdW5kTmFtZXNfOTA0LnNpemUgPD0gMSwgXCJleHBlY3Rpbmcgbm8gbW9yZSB0aGFuIDEgbWF0Y2hpbmcgbmFtZSBpbiBleHBvcnRzXCIpO1xuICByZXR1cm4gZm91bmROYW1lc185MDQuZ2V0KDApO1xufVxuZnVuY3Rpb24gYmluZEltcG9ydHNfODgzKGltcFRlcm1fOTA5LCBleE1vZHVsZV85MTAsIGNvbnRleHRfOTExKSB7XG4gIGxldCBuYW1lc185MTIgPSBbXTtcbiAgaW1wVGVybV85MDkubmFtZWRJbXBvcnRzLmZvckVhY2goc3BlY2lmaWVyXzkxMyA9PiB7XG4gICAgbGV0IG5hbWVfOTE0ID0gc3BlY2lmaWVyXzkxMy5iaW5kaW5nLm5hbWU7XG4gICAgbGV0IGV4cG9ydE5hbWVfOTE1ID0gZmluZE5hbWVJbkV4cG9ydHNfODgyKG5hbWVfOTE0LCBleE1vZHVsZV85MTAuZXhwb3J0RW50cmllcyk7XG4gICAgaWYgKGV4cG9ydE5hbWVfOTE1ICE9IG51bGwpIHtcbiAgICAgIGxldCBuZXdCaW5kaW5nID0gZ2Vuc3ltKG5hbWVfOTE0LnZhbCgpKTtcbiAgICAgIGNvbnRleHRfOTExLmJpbmRpbmdzLmFkZEZvcndhcmQobmFtZV85MTQsIGV4cG9ydE5hbWVfOTE1LCBuZXdCaW5kaW5nKTtcbiAgICAgIGlmIChjb250ZXh0XzkxMS5zdG9yZS5oYXMoZXhwb3J0TmFtZV85MTUucmVzb2x2ZSgpKSkge1xuICAgICAgICBuYW1lc185MTIucHVzaChuYW1lXzkxNCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIExpc3QobmFtZXNfOTEyKTtcbn1cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRva2VuRXhwYW5kZXIge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0XzkxNikge1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRfOTE2O1xuICB9XG4gIGV4cGFuZChzdHhsXzkxNykge1xuICAgIGxldCByZXN1bHRfOTE4ID0gTGlzdCgpO1xuICAgIGlmIChzdHhsXzkxNy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gcmVzdWx0XzkxODtcbiAgICB9XG4gICAgbGV0IHByZXZfOTE5ID0gTGlzdCgpO1xuICAgIGxldCBlbmZfOTIwID0gbmV3IEVuZm9yZXN0ZXIoc3R4bF85MTcsIHByZXZfOTE5LCB0aGlzLmNvbnRleHQpO1xuICAgIGxldCBzZWxmXzkyMSA9IHRoaXM7XG4gICAgd2hpbGUgKCFlbmZfOTIwLmRvbmUpIHtcbiAgICAgIGxldCB0ZXJtID0gXy5waXBlKF8uYmluZChlbmZfOTIwLmVuZm9yZXN0LCBlbmZfOTIwKSwgXy5jb25kKFtbaXNWYXJpYWJsZURlY2xhcmF0aW9uU3RhdGVtZW50LCB0ZXJtXzkyMiA9PiB7XG4gICAgICAgIHRlcm1fOTIyLmRlY2xhcmF0aW9uLmRlY2xhcmF0b3JzID0gdGVybV85MjIuZGVjbGFyYXRpb24uZGVjbGFyYXRvcnMubWFwKGRlY2xfOTIzID0+IHtcbiAgICAgICAgICByZXR1cm4gbmV3IFRlcm0oXCJWYXJpYWJsZURlY2xhcmF0b3JcIiwge2JpbmRpbmc6IHJlbW92ZVNjb3BlXzg4MShkZWNsXzkyMy5iaW5kaW5nLCBzZWxmXzkyMS5jb250ZXh0LnVzZVNjb3BlKSwgaW5pdDogZGVjbF85MjMuaW5pdH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGlzU3ludGF4RGVjbGFyYXRpb24odGVybV85MjIuZGVjbGFyYXRpb24pKSB7XG4gICAgICAgICAgbGV0IHNjb3BlID0gZnJlc2hTY29wZShcIm5vbnJlY1wiKTtcbiAgICAgICAgICB0ZXJtXzkyMi5kZWNsYXJhdGlvbi5kZWNsYXJhdG9ycy5mb3JFYWNoKGRlY2xfOTI0ID0+IHtcbiAgICAgICAgICAgIGxldCBuYW1lXzkyNSA9IGRlY2xfOTI0LmJpbmRpbmcubmFtZTtcbiAgICAgICAgICAgIGxldCBuYW1lQWRkZWRfOTI2ID0gbmFtZV85MjUuYWRkU2NvcGUoc2NvcGUpO1xuICAgICAgICAgICAgbGV0IG5hbWVSZW1vdmVkXzkyNyA9IG5hbWVfOTI1LnJlbW92ZVNjb3BlKHNlbGZfOTIxLmNvbnRleHQuY3VycmVudFNjb3BlW3NlbGZfOTIxLmNvbnRleHQuY3VycmVudFNjb3BlLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgICAgIGxldCBuZXdCaW5kaW5nXzkyOCA9IGdlbnN5bShuYW1lXzkyNS52YWwoKSk7XG4gICAgICAgICAgICBzZWxmXzkyMS5jb250ZXh0LmJpbmRpbmdzLmFkZEZvcndhcmQobmFtZUFkZGVkXzkyNiwgbmFtZVJlbW92ZWRfOTI3LCBuZXdCaW5kaW5nXzkyOCk7XG4gICAgICAgICAgICBkZWNsXzkyNC5pbml0ID0gZGVjbF85MjQuaW5pdC5hZGRTY29wZShzY29wZSwgc2VsZl85MjEuY29udGV4dC5iaW5kaW5ncyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzU3ludGF4RGVjbGFyYXRpb24odGVybV85MjIuZGVjbGFyYXRpb24pIHx8IGlzU3ludGF4cmVjRGVjbGFyYXRpb24odGVybV85MjIuZGVjbGFyYXRpb24pKSB7XG4gICAgICAgICAgdGVybV85MjIuZGVjbGFyYXRpb24uZGVjbGFyYXRvcnMuZm9yRWFjaChkZWNsXzkyOSA9PiB7XG4gICAgICAgICAgICByZWdpc3RlckJpbmRpbmdzXzg4MChkZWNsXzkyOS5iaW5kaW5nLCBzZWxmXzkyMS5jb250ZXh0KTtcbiAgICAgICAgICAgIGxvYWRTeW50YXgoZGVjbF85MjksIHNlbGZfOTIxLmNvbnRleHQsIHNlbGZfOTIxLmNvbnRleHQuZW52KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gTm90aGluZ184NzgoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZXJtXzkyMi5kZWNsYXJhdGlvbi5kZWNsYXJhdG9ycy5mb3JFYWNoKGRlY2xfOTMwID0+IHJlZ2lzdGVyQmluZGluZ3NfODgwKGRlY2xfOTMwLmJpbmRpbmcsIHNlbGZfOTIxLmNvbnRleHQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSnVzdF84NzcodGVybV85MjIpO1xuICAgICAgfV0sIFtpc0Z1bmN0aW9uV2l0aE5hbWUsIHRlcm1fOTMxID0+IHtcbiAgICAgICAgdGVybV85MzEubmFtZSA9IHJlbW92ZVNjb3BlXzg4MSh0ZXJtXzkzMS5uYW1lLCBzZWxmXzkyMS5jb250ZXh0LnVzZVNjb3BlKTtcbiAgICAgICAgcmVnaXN0ZXJCaW5kaW5nc184ODAodGVybV85MzEubmFtZSwgc2VsZl85MjEuY29udGV4dCk7XG4gICAgICAgIHJldHVybiBKdXN0Xzg3Nyh0ZXJtXzkzMSk7XG4gICAgICB9XSwgW2lzSW1wb3J0LCB0ZXJtXzkzMiA9PiB7XG4gICAgICAgIGxldCBtb2RfOTMzID0gc2VsZl85MjEuY29udGV4dC5tb2R1bGVzLmxvYWQodGVybV85MzIubW9kdWxlU3BlY2lmaWVyLnZhbCgpLCBzZWxmXzkyMS5jb250ZXh0KTtcbiAgICAgICAgaWYgKHRlcm1fOTMyLmZvclN5bnRheCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW1wb3J0IGZvciBzeW50YXggaXMgbm90IGltcGxlbWVudGVkIHlldFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtb2RfOTMzLnZpc2l0KHNlbGZfOTIxLmNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBib3VuZE5hbWVzXzkzNCA9IGJpbmRJbXBvcnRzXzg4Myh0ZXJtXzkzMiwgbW9kXzkzMywgc2VsZl85MjEuY29udGV4dCk7XG4gICAgICAgIGlmIChib3VuZE5hbWVzXzkzNC5zaXplID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIEp1c3RfODc3KHRlcm1fOTMyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTm90aGluZ184NzgoKTtcbiAgICAgIH1dLCBbaXNFT0YsIE5vdGhpbmdfODc4XSwgW18uVCwgSnVzdF84NzddXSksIE1heWJlLm1heWJlKExpc3QoKSwgXy5pZGVudGl0eSkpKCk7XG4gICAgICByZXN1bHRfOTE4ID0gcmVzdWx0XzkxOC5jb25jYXQodGVybSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRfOTE4O1xuICB9XG59XG4iXX0=