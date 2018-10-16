let cellValueToString: TypeInfo.cellValueToStringHandler = [%raw
  row => "{ return String(row.value); }"
];

let cellValueRaw: TypeInfo.cellValueToStringHandler = [%raw
  row => "{ return row.value; }"
];

let thcCreator = (~header, ~accessor) =>
  TypeInfo.theaderCell(~header, ~accessor, ~cell=cellValueRaw);

let thcCreatorBool = (~header, ~accessor) =>
  TypeInfo.theaderCell(~header, ~accessor, ~cell=cellValueToString) /* http://2ality.com/2018/01/lists-arrays-reasonml.html */;

let filterArray = (~f, arr) =>
  arr |> ArrayLabels.to_list |> ListLabels.filter(~f) |> ArrayLabels.of_list;

let existsArray = (~f, arr) =>
  arr |> ArrayLabels.to_list |> ListLabels.exists(~f);