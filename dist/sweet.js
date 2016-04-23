"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expand = expand;
exports.parse = parse;
exports.compile = compile;

var _shiftReader = require("./shift-reader");

var _shiftReader2 = _interopRequireDefault(_shiftReader);

var _expander = require("./expander");

var _expander2 = _interopRequireDefault(_expander);

var _immutable = require("immutable");

var _syntax = require("./syntax");

var _syntax2 = _interopRequireDefault(_syntax);

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

var _shiftReducer = require("shift-reducer");

var _shiftReducer2 = _interopRequireDefault(_shiftReducer);

var _parseReducer = require("./parse-reducer");

var _parseReducer2 = _interopRequireDefault(_parseReducer);

var _shiftCodegen = require("shift-codegen");

var _shiftCodegen2 = _interopRequireDefault(_shiftCodegen);

var _scope = require("./scope");

var _bindingMap = require("./binding-map.js");

var _bindingMap2 = _interopRequireDefault(_bindingMap);

var _terms = require("./terms");

var _terms2 = _interopRequireDefault(_terms);

var _modules = require("./modules");

var _babelCore = require("babel-core");

var _nodeModuleResolver = require("./node-module-resolver");

var _nodeModuleResolver2 = _interopRequireDefault(_nodeModuleResolver);

var _nodeModuleLoader = require("./node-module-loader");

var _nodeModuleLoader2 = _interopRequireDefault(_nodeModuleLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function expand(source_619) {
  var options_620 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var reader_621 = new _shiftReader2.default(source_619);
  var stxl_622 = reader_621.read();
  var scope_623 = (0, _scope.freshScope)("top");
  var bindings_624 = new _bindingMap2.default();
  var expander_625 = new _expander2.default({ env: new _env2.default(), store: new _env2.default(), bindings: bindings_624, cwd: options_620.cwd || process.cwd(), filename: options_620.filename, modules: new _modules.Modules(), currentScope: [scope_623], transform: options_620.transform || _babelCore.transform, moduleResolver: options_620.moduleResolver || _nodeModuleResolver2.default, moduleLoader: options_620.moduleLoader || _nodeModuleLoader2.default });
  var exStxl_626 = expander_625.expand(stxl_622.map(function (s_627) {
    return s_627.addScope(scope_623, bindings_624);
  }));
  return new _terms2.default("Module", { directives: (0, _immutable.List)(), items: exStxl_626 });
}
function parse(source_628) {
  var options_629 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _shiftReducer2.default)(new _parseReducer2.default(), expand(source_628, options_629));
}
function compile(source_630) {
  var options_631 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var ast_632 = parse(source_630, options_631);
  var gen_633 = (0, _shiftCodegen2.default)(ast_632, new _shiftCodegen.FormattedCodeGen());
  return options_631.transform && !options_631.noBabel ? options_631.transform(gen_633, { babelrc: true, filename: options_631.filename }) : { code: gen_633 };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3N3ZWV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBZWdCLE1BQU0sR0FBTixNQUFNO1FBU04sS0FBSyxHQUFMLEtBQUs7UUFHTCxPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFaaEIsU0FBUyxNQUFNLENBQUMsVUFBVSxFQUFvQjtNQUFsQixXQUFXLHlEQUFHLEVBQUU7O0FBQ2pELE1BQUksVUFBVSxHQUFHLDBCQUFXLFVBQVUsQ0FBQyxDQUFDO0FBQ3hDLE1BQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNqQyxNQUFJLFNBQVMsR0FBRyx1QkFBVyxLQUFLLENBQUMsQ0FBQztBQUNsQyxNQUFJLFlBQVksR0FBRywwQkFBYyxDQUFDO0FBQ2xDLE1BQUksWUFBWSxHQUFHLHVCQUFhLEVBQUMsR0FBRyxFQUFFLG1CQUFPLEVBQUUsS0FBSyxFQUFFLG1CQUFPLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLHNCQUFXLEVBQUUsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxTQUFTLHdCQUFrQixFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsY0FBYyxnQ0FBZ0IsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDLFlBQVksOEJBQWMsRUFBQyxDQUFDLENBQUM7QUFDdFgsTUFBSSxVQUFVLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztXQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztHQUFBLENBQUMsQ0FBQyxDQUFDO0FBQ3JHLFNBQU8sb0JBQVMsUUFBUSxFQUFFLEVBQUMsVUFBVSxFQUFFLHNCQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7Q0FDcEU7QUFDTSxTQUFTLEtBQUssQ0FBQyxVQUFVLEVBQW9CO01BQWxCLFdBQVcseURBQUcsRUFBRTs7QUFDaEQsU0FBTyw0QkFBTyw0QkFBZ0IsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7Q0FDbEU7QUFDTSxTQUFTLE9BQU8sQ0FBQyxVQUFVLEVBQW9CO01BQWxCLFdBQVcseURBQUcsRUFBRTs7QUFDbEQsTUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM3QyxNQUFJLE9BQU8sR0FBRyw0QkFBUSxPQUFPLEVBQUUsb0NBQW9CLENBQUMsQ0FBQztBQUNyRCxTQUFPLFdBQVcsQ0FBQyxTQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBQyxDQUFDLEdBQUcsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUM7Q0FDMUoiLCJmaWxlIjoic3dlZXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhZGVyIGZyb20gXCIuL3NoaWZ0LXJlYWRlclwiO1xuaW1wb3J0IEV4cGFuZGVyIGZyb20gXCIuL2V4cGFuZGVyXCI7XG5pbXBvcnQge0xpc3R9IGZyb20gXCJpbW11dGFibGVcIjtcbmltcG9ydCBTeW50YXggZnJvbSBcIi4vc3ludGF4XCI7XG5pbXBvcnQgRW52IGZyb20gXCIuL2VudlwiO1xuaW1wb3J0IHJlZHVjZSBmcm9tIFwic2hpZnQtcmVkdWNlclwiO1xuaW1wb3J0IFBhcnNlUmVkdWNlciBmcm9tIFwiLi9wYXJzZS1yZWR1Y2VyXCI7XG5pbXBvcnQgY29kZWdlbiwge0Zvcm1hdHRlZENvZGVHZW59IGZyb20gXCJzaGlmdC1jb2RlZ2VuXCI7XG5pbXBvcnQge1Njb3BlLCBmcmVzaFNjb3BlfSBmcm9tIFwiLi9zY29wZVwiO1xuaW1wb3J0IEJpbmRpbmdNYXAgZnJvbSBcIi4vYmluZGluZy1tYXAuanNcIjtcbmltcG9ydCBUZXJtIGZyb20gXCIuL3Rlcm1zXCI7XG5pbXBvcnQge01vZHVsZXN9IGZyb20gXCIuL21vZHVsZXNcIjtcbmltcG9ydCB7dHJhbnNmb3JtIGFzIGJhYmVsVHJhbnNmb3JtfSBmcm9tIFwiYmFiZWwtY29yZVwiO1xuaW1wb3J0IG5vZGVSZXNvbHZlciBmcm9tIFwiLi9ub2RlLW1vZHVsZS1yZXNvbHZlclwiO1xuaW1wb3J0IG5vZGVMb2FkZXIgZnJvbSBcIi4vbm9kZS1tb2R1bGUtbG9hZGVyXCI7XG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kKHNvdXJjZV82MTksIG9wdGlvbnNfNjIwID0ge30pIHtcbiAgbGV0IHJlYWRlcl82MjEgPSBuZXcgUmVhZGVyKHNvdXJjZV82MTkpO1xuICBsZXQgc3R4bF82MjIgPSByZWFkZXJfNjIxLnJlYWQoKTtcbiAgbGV0IHNjb3BlXzYyMyA9IGZyZXNoU2NvcGUoXCJ0b3BcIik7XG4gIGxldCBiaW5kaW5nc182MjQgPSBuZXcgQmluZGluZ01hcDtcbiAgbGV0IGV4cGFuZGVyXzYyNSA9IG5ldyBFeHBhbmRlcih7ZW52OiBuZXcgRW52LCBzdG9yZTogbmV3IEVudiwgYmluZGluZ3M6IGJpbmRpbmdzXzYyNCwgY3dkOiBvcHRpb25zXzYyMC5jd2QgfHwgcHJvY2Vzcy5jd2QoKSwgZmlsZW5hbWU6IG9wdGlvbnNfNjIwLmZpbGVuYW1lLCBtb2R1bGVzOiBuZXcgTW9kdWxlcywgY3VycmVudFNjb3BlOiBbc2NvcGVfNjIzXSwgdHJhbnNmb3JtOiBvcHRpb25zXzYyMC50cmFuc2Zvcm0gfHwgYmFiZWxUcmFuc2Zvcm0sIG1vZHVsZVJlc29sdmVyOiBvcHRpb25zXzYyMC5tb2R1bGVSZXNvbHZlciB8fCBub2RlUmVzb2x2ZXIsIG1vZHVsZUxvYWRlcjogb3B0aW9uc182MjAubW9kdWxlTG9hZGVyIHx8IG5vZGVMb2FkZXJ9KTtcbiAgbGV0IGV4U3R4bF82MjYgPSBleHBhbmRlcl82MjUuZXhwYW5kKHN0eGxfNjIyLm1hcChzXzYyNyA9PiBzXzYyNy5hZGRTY29wZShzY29wZV82MjMsIGJpbmRpbmdzXzYyNCkpKTtcbiAgcmV0dXJuIG5ldyBUZXJtKFwiTW9kdWxlXCIsIHtkaXJlY3RpdmVzOiBMaXN0KCksIGl0ZW1zOiBleFN0eGxfNjI2fSk7XG59XG5leHBvcnQgZnVuY3Rpb24gcGFyc2Uoc291cmNlXzYyOCwgb3B0aW9uc182MjkgPSB7fSkge1xuICByZXR1cm4gcmVkdWNlKG5ldyBQYXJzZVJlZHVjZXIsIGV4cGFuZChzb3VyY2VfNjI4LCBvcHRpb25zXzYyOSkpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGUoc291cmNlXzYzMCwgb3B0aW9uc182MzEgPSB7fSkge1xuICBsZXQgYXN0XzYzMiA9IHBhcnNlKHNvdXJjZV82MzAsIG9wdGlvbnNfNjMxKTtcbiAgbGV0IGdlbl82MzMgPSBjb2RlZ2VuKGFzdF82MzIsIG5ldyBGb3JtYXR0ZWRDb2RlR2VuKTtcbiAgcmV0dXJuIG9wdGlvbnNfNjMxLnRyYW5zZm9ybSAmJiAhb3B0aW9uc182MzEubm9CYWJlbCA/IG9wdGlvbnNfNjMxLnRyYW5zZm9ybShnZW5fNjMzLCB7YmFiZWxyYzogdHJ1ZSwgZmlsZW5hbWU6IG9wdGlvbnNfNjMxLmZpbGVuYW1lfSkgOiB7Y29kZTogZ2VuXzYzM307XG59XG4iXX0=