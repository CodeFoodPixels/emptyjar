module.exports = [
  {
    name: "no parameters",
    parameters: undefined,
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: {}
  },
  {
    name: "string parameter",
    parameters: [
      {
        key: "test_column",
        value: "hello"
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_column: /hello/i }] }
  },
  {
    name: "string array",
    parameters: [
      {
        key: "test_column",
        value: ["hello", "goodbye", "test"]
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_column: { $in: ["hello", "goodbye", "test"] } }] }
  },
  {
    name: "specified operator",
    parameters: [
      {
        key: "test_column",
        value: "hello",
        operator: ">"
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_column: { $gt: "hello" } }] }
  },
  {
    name: "specified operator",
    parameters: [
      {
        key: "test_column",
        value: "hello",
        operator: "<"
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_column: { $lt: "hello" } }] }
  },
  {
    name: "specified operator",
    parameters: [
      {
        key: "test_column",
        value: "hello",
        operator: "<="
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_column: { $lte: "hello" } }] }
  },
  {
    name: "specified operator",
    parameters: [
      {
        key: "test_column",
        value: "hello",
        operator: ">="
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_column: { $gte: "hello" } }] }
  },
  {
    name: "strict equality",
    parameters: [
      {
        key: "test_column",
        value: "hello",
        strictEquality: true
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_column: "hello" }] }
  },
  {
    name: "wildcard",
    parameters: [
      {
        key: "test_column",
        value: "*hello*",
        wildcardMatch: true,
        wildcardCharacter: "*"
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_column: { $regex: /.*hello*/ } }] }
  },
  {
    name: "wildcard array",
    parameters: [
      {
        key: "test_column",
        value: ["*hello*", "*goodbye*", "*ahoy*"],
        wildcardMatch: true,
        wildcardCharacter: "*"
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: {
      $and: [{ test_column: { $in: [/.*hello*/, /.*goodbye*/, /.*ahoy*/] } }]
    }
  },
  {
    name: "boolean",
    parameters: [
      {
        key: "test_true",
        value: true
      },
      {
        key: "test_false",
        value: false
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_true: true }, { test_false: false }] }
  },
  {
    name: "date",
    parameters: [
      {
        key: "test_date",
        value: new Date("2022-03-03T02:00:00.000Z")
      }
    ],
    returnData: [
      {
        test_column: "hello"
      }
    ],
    rows: [
      {
        test_column: "hello"
      }
    ],
    query: { $and: [{ test_date: new Date("2022-03-03T02:00:00.000Z") }] }
  }
];
