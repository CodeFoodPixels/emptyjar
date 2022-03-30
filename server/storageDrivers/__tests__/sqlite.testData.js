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
    query: "SELECT * from test_table",
    queryParams: []
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
    query: "SELECT * from test_table WHERE test_column LIKE ?",
    queryParams: ["hello"]
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
    query:
      "SELECT * from test_table WHERE (test_column LIKE ? OR test_column LIKE ? OR test_column LIKE ?)",
    queryParams: ["hello", "goodbye", "test"]
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
    query: "SELECT * from test_table WHERE test_column >= ?",
    queryParams: ["hello"]
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
    query: "SELECT * from test_table WHERE test_column = ?",
    queryParams: ["hello"]
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
    query: "SELECT * from test_table WHERE test_column LIKE ?",
    queryParams: ["%hello%"]
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
    query:
      "SELECT * from test_table WHERE test_true LIKE ? AND test_false LIKE ?",
    queryParams: [1, 0]
  },
  {
    name: "date",
    parameters: [
      {
        key: "test_date",
        value: new Date()
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
    query: "SELECT * from test_table WHERE test_date LIKE ?",
    queryParams: [1646272800]
  },
  {
    name: "conversions: page_hit_unique",
    parameters: undefined,
    returnData: [
      {
        page_hit_unique: 1
      },
      {
        page_hit_unique: 0
      }
    ],
    rows: [
      {
        page_hit_unique: true
      },
      {
        page_hit_unique: false
      }
    ],
    query: "SELECT * from test_table",
    queryParams: []
  },
  {
    name: "conversions: site_hit_unique",
    parameters: undefined,
    returnData: [
      {
        site_hit_unique: 1
      },
      {
        site_hit_unique: 0
      }
    ],
    rows: [
      {
        site_hit_unique: true
      },
      {
        site_hit_unique: false
      }
    ],
    query: "SELECT * from test_table",
    queryParams: []
  },
  {
    name: "conversions: timestamp",
    parameters: undefined,
    returnData: [
      {
        timestamp: 1646272800
      }
    ],
    rows: [
      {
        timestamp: "2022-03-03T02:00:00.000Z"
      }
    ],
    query: "SELECT * from test_table",
    queryParams: []
  }
];
