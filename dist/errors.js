"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expect = expect;
exports.assert = assert;
function expect(cond_295, message_296, offendingSyntax_297, rest_298) {
  if (!cond_295) {
    var ctx = "";
    if (rest_298) {
      var _ctx = rest_298.slice(0, 20).map(function (s_299) {
        if (s_299 === offendingSyntax_297) {
          return "__" + s_299.val() + "__";
        }
        return s_299.val();
      }).join(" ");
    }
    throw new Error("[error]: " + message_296 + "\n" + ctx);
  }
}
function assert(cond_300, message_301) {
  if (!cond_300) {
    throw new Error("[assertion error]: " + message_301);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3N3ZWV0L2Vycm9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUFnQjtRQWNBO0FBZFQsU0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCLFdBQTFCLEVBQXVDLG1CQUF2QyxFQUE0RCxRQUE1RCxFQUFzRTtBQUMzRSxNQUFJLENBQUMsUUFBRCxFQUFXO0FBQ2IsUUFBSSxNQUFNLEVBQU4sQ0FEUztBQUViLFFBQUksUUFBSixFQUFjO0FBQ1osVUFBSSxPQUFNLFNBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0IsRUFBbEIsRUFBc0IsR0FBdEIsQ0FBMEIsaUJBQVM7QUFDM0MsWUFBSSxVQUFVLG1CQUFWLEVBQStCO0FBQ2pDLGlCQUFPLE9BQU8sTUFBTSxHQUFOLEVBQVAsR0FBcUIsSUFBckIsQ0FEMEI7U0FBbkM7QUFHQSxlQUFPLE1BQU0sR0FBTixFQUFQLENBSjJDO09BQVQsQ0FBMUIsQ0FLUCxJQUxPLENBS0YsR0FMRSxDQUFOLENBRFE7S0FBZDtBQVFBLFVBQU0sSUFBSSxLQUFKLENBQVUsY0FBYyxXQUFkLEdBQTRCLElBQTVCLEdBQW1DLEdBQW5DLENBQWhCLENBVmE7R0FBZjtDQURLO0FBY0EsU0FBUyxNQUFULENBQWdCLFFBQWhCLEVBQTBCLFdBQTFCLEVBQXVDO0FBQzVDLE1BQUksQ0FBQyxRQUFELEVBQVc7QUFDYixVQUFNLElBQUksS0FBSixDQUFVLHdCQUF3QixXQUF4QixDQUFoQixDQURhO0dBQWY7Q0FESyIsImZpbGUiOiJlcnJvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZXhwZWN0KGNvbmRfMjk1LCBtZXNzYWdlXzI5Niwgb2ZmZW5kaW5nU3ludGF4XzI5NywgcmVzdF8yOTgpIHtcbiAgaWYgKCFjb25kXzI5NSkge1xuICAgIGxldCBjdHggPSBcIlwiO1xuICAgIGlmIChyZXN0XzI5OCkge1xuICAgICAgbGV0IGN0eCA9IHJlc3RfMjk4LnNsaWNlKDAsIDIwKS5tYXAoc18yOTkgPT4ge1xuICAgICAgICBpZiAoc18yOTkgPT09IG9mZmVuZGluZ1N5bnRheF8yOTcpIHtcbiAgICAgICAgICByZXR1cm4gXCJfX1wiICsgc18yOTkudmFsKCkgKyBcIl9fXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNfMjk5LnZhbCgpO1xuICAgICAgfSkuam9pbihcIiBcIik7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihcIltlcnJvcl06IFwiICsgbWVzc2FnZV8yOTYgKyBcIlxcblwiICsgY3R4KTtcbiAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydChjb25kXzMwMCwgbWVzc2FnZV8zMDEpIHtcbiAgaWYgKCFjb25kXzMwMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlthc3NlcnRpb24gZXJyb3JdOiBcIiArIG1lc3NhZ2VfMzAxKTtcbiAgfVxufVxuIl19