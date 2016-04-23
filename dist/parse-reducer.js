"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _shiftReducer = require("shift-reducer");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ParseReducer = (function (_CloneReducer) {
  _inherits(ParseReducer, _CloneReducer);

  function ParseReducer() {
    _classCallCheck(this, ParseReducer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ParseReducer).apply(this, arguments));
  }

  _createClass(ParseReducer, [{
    key: "reduceModule",
    value: function reduceModule(node_414, state_415) {
      return new _terms2.default("Module", { directives: state_415.directives.toArray(), items: state_415.items.toArray() });
    }
  }, {
    key: "reduceImport",
    value: function reduceImport(node_416, state_417) {
      var moduleSpecifier_418 = state_417.moduleSpecifier ? state_417.moduleSpecifier.val() : null;
      return new _terms2.default("Import", { defaultBinding: state_417.defaultBinding, namedImports: state_417.namedImports.toArray(), moduleSpecifier: moduleSpecifier_418, forSyntax: node_416.forSyntax });
    }
  }, {
    key: "reduceImportNamespace",
    value: function reduceImportNamespace(node_419, state_420) {
      var moduleSpecifier_421 = state_420.moduleSpecifier ? state_420.moduleSpecifier.val() : null;
      return new _terms2.default("ImportNamespace", { defaultBinding: state_420.defaultBinding, namespaceBinding: state_420.namespaceBinding, moduleSpecifier: moduleSpecifier_421, forSyntax: node_419.forSyntax });
    }
  }, {
    key: "reduceExport",
    value: function reduceExport(node_422, state_423) {
      return new _terms2.default("Export", { declaration: state_423.declaration });
    }
  }, {
    key: "reduceExportAllFrom",
    value: function reduceExportAllFrom(node_424, state_425) {
      var moduleSpecifier_426 = state_425.moduleSpecifier ? state_425.moduleSpecifier.val() : null;
      return new _terms2.default("ExportAllFrom", { moduleSpecifier: moduleSpecifier_426 });
    }
  }, {
    key: "reduceExportFrom",
    value: function reduceExportFrom(node_427, state_428) {
      var moduleSpecifier_429 = state_428.moduleSpecifier ? state_428.moduleSpecifier.val() : null;
      return new _terms2.default("ExportFrom", { moduleSpecifier: moduleSpecifier_429, namedExports: state_428.namedExports.toArray() });
    }
  }, {
    key: "reduceExportSpecifier",
    value: function reduceExportSpecifier(node_430, state_431) {
      var name_432 = state_431.name,
          exportedName_433 = state_431.exportedName;
      if (name_432 == null) {
        name_432 = exportedName_433.resolve();
        exportedName_433 = exportedName_433.val();
      } else {
        name_432 = name_432.resolve();
        exportedName_433 = exportedName_433.val();
      }
      return new _terms2.default("ExportSpecifier", { name: name_432, exportedName: exportedName_433 });
    }
  }, {
    key: "reduceImportSpecifier",
    value: function reduceImportSpecifier(node_434, state_435) {
      var name_436 = state_435.name ? state_435.name.resolve() : null;
      return new _terms2.default("ImportSpecifier", { name: name_436, binding: state_435.binding });
    }
  }, {
    key: "reduceIdentifierExpression",
    value: function reduceIdentifierExpression(node_437, state_438) {
      return new _terms2.default("IdentifierExpression", { name: node_437.name.resolve() });
    }
  }, {
    key: "reduceLiteralNumericExpression",
    value: function reduceLiteralNumericExpression(node_439, state_440) {
      return new _terms2.default("LiteralNumericExpression", { value: node_439.value.val() });
    }
  }, {
    key: "reduceLiteralBooleanExpression",
    value: function reduceLiteralBooleanExpression(node_441, state_442) {
      return new _terms2.default("LiteralBooleanExpression", { value: node_441.value.val() === "true" });
    }
  }, {
    key: "reduceLiteralStringExpression",
    value: function reduceLiteralStringExpression(node_443, state_444) {
      return new _terms2.default("LiteralStringExpression", { value: node_443.value.token.str });
    }
  }, {
    key: "reduceCallExpression",
    value: function reduceCallExpression(node_445, state_446) {
      return new _terms2.default("CallExpression", { callee: state_446.callee, arguments: state_446.arguments.toArray() });
    }
  }, {
    key: "reduceFunctionBody",
    value: function reduceFunctionBody(node_447, state_448) {
      return new _terms2.default("FunctionBody", { directives: state_448.directives.toArray(), statements: state_448.statements.toArray() });
    }
  }, {
    key: "reduceFormalParameters",
    value: function reduceFormalParameters(node_449, state_450) {
      return new _terms2.default("FormalParameters", { items: state_450.items.toArray(), rest: state_450.rest });
    }
  }, {
    key: "reduceBindingIdentifier",
    value: function reduceBindingIdentifier(node_451, state_452) {
      return new _terms2.default("BindingIdentifier", { name: node_451.name.resolve() });
    }
  }, {
    key: "reduceBinaryExpression",
    value: function reduceBinaryExpression(node_453, state_454) {
      return new _terms2.default("BinaryExpression", { left: state_454.left, operator: node_453.operator.val(), right: state_454.right });
    }
  }, {
    key: "reduceObjectExpression",
    value: function reduceObjectExpression(node_455, state_456) {
      return new _terms2.default("ObjectExpression", { properties: state_456.properties.toArray() });
    }
  }, {
    key: "reduceVariableDeclaration",
    value: function reduceVariableDeclaration(node_457, state_458) {
      return new _terms2.default("VariableDeclaration", { kind: state_458.kind, declarators: state_458.declarators.toArray() });
    }
  }, {
    key: "reduceStaticPropertyName",
    value: function reduceStaticPropertyName(node_459, state_460) {
      return new _terms2.default("StaticPropertyName", { value: node_459.value.val().toString() });
    }
  }, {
    key: "reduceArrayExpression",
    value: function reduceArrayExpression(node_461, state_462) {
      return new _terms2.default("ArrayExpression", { elements: state_462.elements.toArray() });
    }
  }, {
    key: "reduceStaticMemberExpression",
    value: function reduceStaticMemberExpression(node_463, state_464) {
      return new _terms2.default("StaticMemberExpression", { object: state_464.object, property: state_464.property.val() });
    }
  }]);

  return ParseReducer;
})(_shiftReducer.CloneReducer);

exports.default = ParseReducer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3BhcnNlLXJlZHVjZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUVxQixZQUFZO1lBQVosWUFBWTs7V0FBWixZQUFZOzBCQUFaLFlBQVk7O2tFQUFaLFlBQVk7OztlQUFaLFlBQVk7O2lDQUNsQixRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQ2hDLGFBQU8sb0JBQVMsUUFBUSxFQUFFLEVBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQyxDQUFDO0tBQzNHOzs7aUNBQ1ksUUFBUSxFQUFFLFNBQVMsRUFBRTtBQUNoQyxVQUFJLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDN0YsYUFBTyxvQkFBUyxRQUFRLEVBQUUsRUFBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsU0FBUyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO0tBQzVMOzs7MENBQ3FCLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDekMsVUFBSSxtQkFBbUIsR0FBRyxTQUFTLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQzdGLGFBQU8sb0JBQVMsaUJBQWlCLEVBQUUsRUFBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztLQUNuTTs7O2lDQUNZLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDaEMsYUFBTyxvQkFBUyxRQUFRLEVBQUUsRUFBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVcsRUFBQyxDQUFDLENBQUM7S0FDakU7Ozt3Q0FDbUIsUUFBUSxFQUFFLFNBQVMsRUFBRTtBQUN2QyxVQUFJLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDN0YsYUFBTyxvQkFBUyxlQUFlLEVBQUUsRUFBQyxlQUFlLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQyxDQUFDO0tBQzFFOzs7cUNBQ2dCLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDcEMsVUFBSSxtQkFBbUIsR0FBRyxTQUFTLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQzdGLGFBQU8sb0JBQVMsWUFBWSxFQUFFLEVBQUMsZUFBZSxFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBRSxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQztLQUN2SDs7OzBDQUNxQixRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQ3pDLFVBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJO1VBQUUsZ0JBQWdCLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQztBQUN6RSxVQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUU7QUFDcEIsZ0JBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN0Qyx3QkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztPQUMzQyxNQUFNO0FBQ0wsZ0JBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDOUIsd0JBQWdCLEdBQUcsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLENBQUM7T0FDM0M7QUFDRCxhQUFPLG9CQUFTLGlCQUFpQixFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO0tBQ3RGOzs7MENBQ3FCLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDekMsVUFBSSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztBQUNoRSxhQUFPLG9CQUFTLGlCQUFpQixFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUM7S0FDbEY7OzsrQ0FDMEIsUUFBUSxFQUFFLFNBQVMsRUFBRTtBQUM5QyxhQUFPLG9CQUFTLHNCQUFzQixFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQyxDQUFDO0tBQzFFOzs7bURBQzhCLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDbEQsYUFBTyxvQkFBUywwQkFBMEIsRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFDLENBQUMsQ0FBQztLQUM1RTs7O21EQUM4QixRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQ2xELGFBQU8sb0JBQVMsMEJBQTBCLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxNQUFNLEVBQUMsQ0FBQyxDQUFDO0tBQ3ZGOzs7a0RBQzZCLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDakQsYUFBTyxvQkFBUyx5QkFBeUIsRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDO0tBQy9FOzs7eUNBQ29CLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDeEMsYUFBTyxvQkFBUyxnQkFBZ0IsRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQztLQUN6Rzs7O3VDQUNrQixRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQ3RDLGFBQU8sb0JBQVMsY0FBYyxFQUFFLEVBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUMsQ0FBQyxDQUFDO0tBQzNIOzs7MkNBQ3NCLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDMUMsYUFBTyxvQkFBUyxrQkFBa0IsRUFBRSxFQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztLQUMvRjs7OzRDQUN1QixRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQzNDLGFBQU8sb0JBQVMsbUJBQW1CLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLENBQUM7S0FDdkU7OzsyQ0FDc0IsUUFBUSxFQUFFLFNBQVMsRUFBRTtBQUMxQyxhQUFPLG9CQUFTLGtCQUFrQixFQUFFLEVBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO0tBQ3hIOzs7MkNBQ3NCLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDMUMsYUFBTyxvQkFBUyxrQkFBa0IsRUFBRSxFQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQztLQUNuRjs7OzhDQUN5QixRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQzdDLGFBQU8sb0JBQVMscUJBQXFCLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsRUFBQyxDQUFDLENBQUM7S0FDOUc7Ozs2Q0FDd0IsUUFBUSxFQUFFLFNBQVMsRUFBRTtBQUM1QyxhQUFPLG9CQUFTLG9CQUFvQixFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUMsQ0FBQyxDQUFDO0tBQ2pGOzs7MENBQ3FCLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDekMsYUFBTyxvQkFBUyxpQkFBaUIsRUFBRSxFQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFDLENBQUMsQ0FBQztLQUM5RTs7O2lEQUM0QixRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQ2hELGFBQU8sb0JBQVMsd0JBQXdCLEVBQUUsRUFBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBQyxDQUFDLENBQUM7S0FDM0c7OztTQS9Fa0IsWUFBWTs7O2tCQUFaLFlBQVkiLCJmaWxlIjoicGFyc2UtcmVkdWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUZXJtIGZyb20gXCIuL3Rlcm1zXCI7XG5pbXBvcnQge0Nsb25lUmVkdWNlcn0gZnJvbSBcInNoaWZ0LXJlZHVjZXJcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlUmVkdWNlciBleHRlbmRzIENsb25lUmVkdWNlciB7XG4gIHJlZHVjZU1vZHVsZShub2RlXzQxNCwgc3RhdGVfNDE1KSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiTW9kdWxlXCIsIHtkaXJlY3RpdmVzOiBzdGF0ZV80MTUuZGlyZWN0aXZlcy50b0FycmF5KCksIGl0ZW1zOiBzdGF0ZV80MTUuaXRlbXMudG9BcnJheSgpfSk7XG4gIH1cbiAgcmVkdWNlSW1wb3J0KG5vZGVfNDE2LCBzdGF0ZV80MTcpIHtcbiAgICBsZXQgbW9kdWxlU3BlY2lmaWVyXzQxOCA9IHN0YXRlXzQxNy5tb2R1bGVTcGVjaWZpZXIgPyBzdGF0ZV80MTcubW9kdWxlU3BlY2lmaWVyLnZhbCgpIDogbnVsbDtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJJbXBvcnRcIiwge2RlZmF1bHRCaW5kaW5nOiBzdGF0ZV80MTcuZGVmYXVsdEJpbmRpbmcsIG5hbWVkSW1wb3J0czogc3RhdGVfNDE3Lm5hbWVkSW1wb3J0cy50b0FycmF5KCksIG1vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyXzQxOCwgZm9yU3ludGF4OiBub2RlXzQxNi5mb3JTeW50YXh9KTtcbiAgfVxuICByZWR1Y2VJbXBvcnROYW1lc3BhY2Uobm9kZV80MTksIHN0YXRlXzQyMCkge1xuICAgIGxldCBtb2R1bGVTcGVjaWZpZXJfNDIxID0gc3RhdGVfNDIwLm1vZHVsZVNwZWNpZmllciA/IHN0YXRlXzQyMC5tb2R1bGVTcGVjaWZpZXIudmFsKCkgOiBudWxsO1xuICAgIHJldHVybiBuZXcgVGVybShcIkltcG9ydE5hbWVzcGFjZVwiLCB7ZGVmYXVsdEJpbmRpbmc6IHN0YXRlXzQyMC5kZWZhdWx0QmluZGluZywgbmFtZXNwYWNlQmluZGluZzogc3RhdGVfNDIwLm5hbWVzcGFjZUJpbmRpbmcsIG1vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyXzQyMSwgZm9yU3ludGF4OiBub2RlXzQxOS5mb3JTeW50YXh9KTtcbiAgfVxuICByZWR1Y2VFeHBvcnQobm9kZV80MjIsIHN0YXRlXzQyMykge1xuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydFwiLCB7ZGVjbGFyYXRpb246IHN0YXRlXzQyMy5kZWNsYXJhdGlvbn0pO1xuICB9XG4gIHJlZHVjZUV4cG9ydEFsbEZyb20obm9kZV80MjQsIHN0YXRlXzQyNSkge1xuICAgIGxldCBtb2R1bGVTcGVjaWZpZXJfNDI2ID0gc3RhdGVfNDI1Lm1vZHVsZVNwZWNpZmllciA/IHN0YXRlXzQyNS5tb2R1bGVTcGVjaWZpZXIudmFsKCkgOiBudWxsO1xuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydEFsbEZyb21cIiwge21vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyXzQyNn0pO1xuICB9XG4gIHJlZHVjZUV4cG9ydEZyb20obm9kZV80MjcsIHN0YXRlXzQyOCkge1xuICAgIGxldCBtb2R1bGVTcGVjaWZpZXJfNDI5ID0gc3RhdGVfNDI4Lm1vZHVsZVNwZWNpZmllciA/IHN0YXRlXzQyOC5tb2R1bGVTcGVjaWZpZXIudmFsKCkgOiBudWxsO1xuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydEZyb21cIiwge21vZHVsZVNwZWNpZmllcjogbW9kdWxlU3BlY2lmaWVyXzQyOSwgbmFtZWRFeHBvcnRzOiBzdGF0ZV80MjgubmFtZWRFeHBvcnRzLnRvQXJyYXkoKX0pO1xuICB9XG4gIHJlZHVjZUV4cG9ydFNwZWNpZmllcihub2RlXzQzMCwgc3RhdGVfNDMxKSB7XG4gICAgbGV0IG5hbWVfNDMyID0gc3RhdGVfNDMxLm5hbWUsIGV4cG9ydGVkTmFtZV80MzMgPSBzdGF0ZV80MzEuZXhwb3J0ZWROYW1lO1xuICAgIGlmIChuYW1lXzQzMiA9PSBudWxsKSB7XG4gICAgICBuYW1lXzQzMiA9IGV4cG9ydGVkTmFtZV80MzMucmVzb2x2ZSgpO1xuICAgICAgZXhwb3J0ZWROYW1lXzQzMyA9IGV4cG9ydGVkTmFtZV80MzMudmFsKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWVfNDMyID0gbmFtZV80MzIucmVzb2x2ZSgpO1xuICAgICAgZXhwb3J0ZWROYW1lXzQzMyA9IGV4cG9ydGVkTmFtZV80MzMudmFsKCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVGVybShcIkV4cG9ydFNwZWNpZmllclwiLCB7bmFtZTogbmFtZV80MzIsIGV4cG9ydGVkTmFtZTogZXhwb3J0ZWROYW1lXzQzM30pO1xuICB9XG4gIHJlZHVjZUltcG9ydFNwZWNpZmllcihub2RlXzQzNCwgc3RhdGVfNDM1KSB7XG4gICAgbGV0IG5hbWVfNDM2ID0gc3RhdGVfNDM1Lm5hbWUgPyBzdGF0ZV80MzUubmFtZS5yZXNvbHZlKCkgOiBudWxsO1xuICAgIHJldHVybiBuZXcgVGVybShcIkltcG9ydFNwZWNpZmllclwiLCB7bmFtZTogbmFtZV80MzYsIGJpbmRpbmc6IHN0YXRlXzQzNS5iaW5kaW5nfSk7XG4gIH1cbiAgcmVkdWNlSWRlbnRpZmllckV4cHJlc3Npb24obm9kZV80MzcsIHN0YXRlXzQzOCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIklkZW50aWZpZXJFeHByZXNzaW9uXCIsIHtuYW1lOiBub2RlXzQzNy5uYW1lLnJlc29sdmUoKX0pO1xuICB9XG4gIHJlZHVjZUxpdGVyYWxOdW1lcmljRXhwcmVzc2lvbihub2RlXzQzOSwgc3RhdGVfNDQwKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiTGl0ZXJhbE51bWVyaWNFeHByZXNzaW9uXCIsIHt2YWx1ZTogbm9kZV80MzkudmFsdWUudmFsKCl9KTtcbiAgfVxuICByZWR1Y2VMaXRlcmFsQm9vbGVhbkV4cHJlc3Npb24obm9kZV80NDEsIHN0YXRlXzQ0Mikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkxpdGVyYWxCb29sZWFuRXhwcmVzc2lvblwiLCB7dmFsdWU6IG5vZGVfNDQxLnZhbHVlLnZhbCgpID09PSBcInRydWVcIn0pO1xuICB9XG4gIHJlZHVjZUxpdGVyYWxTdHJpbmdFeHByZXNzaW9uKG5vZGVfNDQzLCBzdGF0ZV80NDQpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJMaXRlcmFsU3RyaW5nRXhwcmVzc2lvblwiLCB7dmFsdWU6IG5vZGVfNDQzLnZhbHVlLnRva2VuLnN0cn0pO1xuICB9XG4gIHJlZHVjZUNhbGxFeHByZXNzaW9uKG5vZGVfNDQ1LCBzdGF0ZV80NDYpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJDYWxsRXhwcmVzc2lvblwiLCB7Y2FsbGVlOiBzdGF0ZV80NDYuY2FsbGVlLCBhcmd1bWVudHM6IHN0YXRlXzQ0Ni5hcmd1bWVudHMudG9BcnJheSgpfSk7XG4gIH1cbiAgcmVkdWNlRnVuY3Rpb25Cb2R5KG5vZGVfNDQ3LCBzdGF0ZV80NDgpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJGdW5jdGlvbkJvZHlcIiwge2RpcmVjdGl2ZXM6IHN0YXRlXzQ0OC5kaXJlY3RpdmVzLnRvQXJyYXkoKSwgc3RhdGVtZW50czogc3RhdGVfNDQ4LnN0YXRlbWVudHMudG9BcnJheSgpfSk7XG4gIH1cbiAgcmVkdWNlRm9ybWFsUGFyYW1ldGVycyhub2RlXzQ0OSwgc3RhdGVfNDUwKSB7XG4gICAgcmV0dXJuIG5ldyBUZXJtKFwiRm9ybWFsUGFyYW1ldGVyc1wiLCB7aXRlbXM6IHN0YXRlXzQ1MC5pdGVtcy50b0FycmF5KCksIHJlc3Q6IHN0YXRlXzQ1MC5yZXN0fSk7XG4gIH1cbiAgcmVkdWNlQmluZGluZ0lkZW50aWZpZXIobm9kZV80NTEsIHN0YXRlXzQ1Mikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmRpbmdJZGVudGlmaWVyXCIsIHtuYW1lOiBub2RlXzQ1MS5uYW1lLnJlc29sdmUoKX0pO1xuICB9XG4gIHJlZHVjZUJpbmFyeUV4cHJlc3Npb24obm9kZV80NTMsIHN0YXRlXzQ1NCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIkJpbmFyeUV4cHJlc3Npb25cIiwge2xlZnQ6IHN0YXRlXzQ1NC5sZWZ0LCBvcGVyYXRvcjogbm9kZV80NTMub3BlcmF0b3IudmFsKCksIHJpZ2h0OiBzdGF0ZV80NTQucmlnaHR9KTtcbiAgfVxuICByZWR1Y2VPYmplY3RFeHByZXNzaW9uKG5vZGVfNDU1LCBzdGF0ZV80NTYpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJPYmplY3RFeHByZXNzaW9uXCIsIHtwcm9wZXJ0aWVzOiBzdGF0ZV80NTYucHJvcGVydGllcy50b0FycmF5KCl9KTtcbiAgfVxuICByZWR1Y2VWYXJpYWJsZURlY2xhcmF0aW9uKG5vZGVfNDU3LCBzdGF0ZV80NTgpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJWYXJpYWJsZURlY2xhcmF0aW9uXCIsIHtraW5kOiBzdGF0ZV80NTgua2luZCwgZGVjbGFyYXRvcnM6IHN0YXRlXzQ1OC5kZWNsYXJhdG9ycy50b0FycmF5KCl9KTtcbiAgfVxuICByZWR1Y2VTdGF0aWNQcm9wZXJ0eU5hbWUobm9kZV80NTksIHN0YXRlXzQ2MCkge1xuICAgIHJldHVybiBuZXcgVGVybShcIlN0YXRpY1Byb3BlcnR5TmFtZVwiLCB7dmFsdWU6IG5vZGVfNDU5LnZhbHVlLnZhbCgpLnRvU3RyaW5nKCl9KTtcbiAgfVxuICByZWR1Y2VBcnJheUV4cHJlc3Npb24obm9kZV80NjEsIHN0YXRlXzQ2Mikge1xuICAgIHJldHVybiBuZXcgVGVybShcIkFycmF5RXhwcmVzc2lvblwiLCB7ZWxlbWVudHM6IHN0YXRlXzQ2Mi5lbGVtZW50cy50b0FycmF5KCl9KTtcbiAgfVxuICByZWR1Y2VTdGF0aWNNZW1iZXJFeHByZXNzaW9uKG5vZGVfNDYzLCBzdGF0ZV80NjQpIHtcbiAgICByZXR1cm4gbmV3IFRlcm0oXCJTdGF0aWNNZW1iZXJFeHByZXNzaW9uXCIsIHtvYmplY3Q6IHN0YXRlXzQ2NC5vYmplY3QsIHByb3BlcnR5OiBzdGF0ZV80NjQucHJvcGVydHkudmFsKCl9KTtcbiAgfVxufVxuIl19