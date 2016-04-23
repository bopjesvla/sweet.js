"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.freshScope = freshScope;
exports.Scope = Scope;

var _errors = require("./errors");

var _symbol = require("./symbol");

var scopeIndex_465 = 0;
function freshScope() {
  var name_466 = arguments.length <= 0 || arguments[0] === undefined ? "scope" : arguments[0];

  scopeIndex_465++;
  return (0, _symbol.Symbol)(name_466 + "_" + scopeIndex_465);
}
;
function Scope(name_467) {
  return (0, _symbol.Symbol)(name_467);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L3Njb3BlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBR2dCLFVBQVUsR0FBVixVQUFVO1FBS1YsS0FBSyxHQUFMLEtBQUs7Ozs7OztBQU5yQixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7QUFDaEIsU0FBUyxVQUFVLEdBQXFCO01BQXBCLFFBQVEseURBQUcsT0FBTzs7QUFDM0MsZ0JBQWMsRUFBRSxDQUFDO0FBQ2pCLFNBQU8sb0JBQU8sUUFBUSxHQUFHLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQztDQUNoRDtBQUNELENBQUM7QUFDTSxTQUFTLEtBQUssQ0FBQyxRQUFRLEVBQUU7QUFDOUIsU0FBTyxvQkFBTyxRQUFRLENBQUMsQ0FBQztDQUN6QiIsImZpbGUiOiJzY29wZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXhwZWN0LCBhc3NlcnR9IGZyb20gXCIuL2Vycm9yc1wiO1xuaW1wb3J0IHtTeW1ib2wsIGdlbnN5bX0gZnJvbSBcIi4vc3ltYm9sXCI7XG5sZXQgc2NvcGVJbmRleF80NjUgPSAwO1xuZXhwb3J0IGZ1bmN0aW9uIGZyZXNoU2NvcGUobmFtZV80NjYgPSBcInNjb3BlXCIpIHtcbiAgc2NvcGVJbmRleF80NjUrKztcbiAgcmV0dXJuIFN5bWJvbChuYW1lXzQ2NiArIFwiX1wiICsgc2NvcGVJbmRleF80NjUpO1xufVxuO1xuZXhwb3J0IGZ1bmN0aW9uIFNjb3BlKG5hbWVfNDY3KSB7XG4gIHJldHVybiBTeW1ib2wobmFtZV80NjcpO1xufVxuIl19