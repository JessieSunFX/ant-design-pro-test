export function nodedataFn() {
    return [
        {
            key: -6,
            icon: 'Norway',
            category: 'KeyComponent',
            title: '按键组件(收号)',
            script: '你好，数字1，2，3分别代表满意，一般和不满意，请输入',
            smsSwitch: 'on',
            keyFlag: 'ReceiveNumber',
            pressKeyArray: [
                {
                    key: '1',
                },
                {
                    key: '2',
                },
                {
                    key: '3',
                },
                {
                    key: '4',
                },
                {
                    key: '未识别',
                },
            ],
            receiveNumberDefaultArray: [
                {
                    intent: '收集到按键值',
                },
                {
                    intent: '未收集到按键值',
                },
            ],
            receiveNumberMin: 0,
            receiveNumberEnd: true,
            numberOfAttempts: 1,
            timeout: 0,
            loc: '-1450 -1110',
        },
        {
            key: 2,
            icon: 'Norway',
            category: 'KeyComponent',
            title: '按键组件(按键)',
            script: '你好，数字1，2，3分别代表满意，一般和不满意，请输入',
            smsSwitch: 'on',
            keyFlag: 'PressKey',
            pressKeyArray: [
                {
                    key: '1',
                },
                {
                    key: '2',
                },
                {
                    key: '3',
                },
                {
                    key: '4',
                },
                {
                    key: '未识别',
                },
            ],
            receiveNumberDefaultArray: [
                {
                    intent: '收集到按键值',
                },
                {
                    intent: '未收集到按键值',
                },
            ],
            receiveNumberMin: 0,
            receiveNumberEnd: true,
            numberOfAttempts: 1,
            timeout: 0,
            loc: '-1110 -1110',
        },
        {
            key: 1,
            icon: 'Russia',
            category: 'IntentComponent',
            title: '意图组件',
            script: '你好，数字1，2，3分别代表满意，一般和不满意，请输入',
            smsSwitch: 'on',
            intentionArray: [
                {
                    text: '同意',
                },
                {
                    text: '不同意',
                },
                {
                    text: '未理解',
                },
            ],
            timeout: 0,
            timeoutScript: '超时了',
            timeoutFollowUp: '超时后续流程',
            loc: '-1440 -1330',
        },
        {
            key: 3,
            icon: 'Ireland',
            category: 'ConditionComponent',
            title: '条件组件',
            conditionArray: [
                {
                    describe: 'age>=30',
                    leftVal: 'age',
                    condition: '>=',
                    rightVal: '30',
                },
                {
                    describe: 'age<100',
                    leftVal: 'age',
                    condition: '<',
                    rightVal: '100',
                },
            ],
            loc: '-1450 -900',
        },
        {
            key: 4,
            icon: 'Denmark',
            category: 'InterfaceComponent',
            title: '接口组件',
            interfaceInfo: {
                name: 'userService',
                protocol: 'webservice',
                url: 'http://www.xxxx.xxx/',
                requestParam: {
                    name: '张三',
                    age: '80',
                    location: 'xxx',
                },
                responseParam: {},
            },
            loc: '-490 -1360',
        },
        {
            key: -7,
            icon: 'Denmark',
            category: 'InterfaceComponent',
            title: '接口组件',
            interfaceInfo: {},
            loc: '-800 -1360',
        },
        {
            key: 5,
            icon: 'Argentina',
            category: 'TransferManualServiceComponent',
            title: '转人工组件',
            phoneNumber: '13111111111',
            loc: '-490 -1150',
        },
        {
            key: -8,
            icon: 'Argentina',
            category: 'TransferManualServiceComponent',
            title: '转人工组件',
            phoneNumber: '',
            loc: '-800 -1150',
        },
        {
            key: 6,
            icon: 'CzechRepublic',
            category: 'InfoCollectionComponent',
            title: '信息收集组件',
            script: '请问您的身份证号是多少？',
            variableName: 'userid',
            intentionArray: [
                {
                    text: '同意',
                },
                {
                    text: '不同意',
                },
                {
                    text: '未理解',
                },
            ],
            loc: '-470 -940',
        },
        {
            key: -10,
            icon: 'CzechRepublic',
            category: 'InfoCollectionComponent',
            title: '信息收集组件',
            script: '',
            variableName: 'userid',
            intentionArray: [
                {
                    text: '同意',
                },
                {
                    text: '不同意',
                },
                {
                    text: '未理解',
                },
            ],
            loc: '-800 -940',
        },
        {
            key: 7,
            icon: 'Georgia',
            title: '结束组件',
            category: 'EndComponent',
            name: '结束',
            loc: '-1380 -1430',
        },
        {
            key: 0,
            icon: 'Georgia',
            category: 'StartComponent',
            title: '开始组件',
            name: '开始',
            loc: '-1510 -1430',
        },
    ];

}

export function linkdataFn() {
    return [
        {
            from: 0,
            to: 1,
            fromPort: 'B',
            toPort: 'T',
            points: [
                -1510,
                -1382.761423749154,
                -1510,
                -1372.761423749154,
                -1510,
                -1355,
                -1440,
                -1355,
                -1440,
                -1337.238576250846,
                -1440,
                -1327.238576250846,
            ],
        },
        {
            from: 1,
            to: -6,
            fromPort: '同意',
            toPort: 'T',
            points: [
                -1506,
                -1163.226613360221,
                -1506,
                -1153.226613360221,
                -1506,
                -1156,
                -1506,
                -1156,
                -1506,
                -1140,
                -1450,
                -1140,
                -1450,
                -1117.238576250846,
                -1450,
                -1107.238576250846,
            ],
        },
        {
            from: 1,
            to: -6,
            fromPort: '不同意',
            toPort: 'T',
            points: [
                -1447.5,
                -1163.226613360221,
                -1447.5,
                -1153.226613360221,
                -1447.5,
                -1135.2325948055336,
                -1449.8333333333333,
                -1135.2325948055336,
                -1449.8333333333333,
                -1117.238576250846,
                -1449.8333333333333,
                -1107.238576250846,
            ],
        },
        {
            from: 1,
            to: -6,
            fromPort: '未理解',
            toPort: 'T',
            points: [
                -1381.5,
                -1163.226613360221,
                -1381.5,
                -1153.226613360221,
                -1381.5,
                -1156,
                -1381.5,
                -1156,
                -1381.5,
                -1140,
                -1449.75,
                -1140,
                -1449.75,
                -1117.238576250846,
                -1449.75,
                -1107.238576250846,
            ],
        },
        {
            from: -6,
            to: 2,
            fromPort: '收集到按键值',
            toPort: 'T',
            points: [
                -1513,
                -943.2266133602211,
                -1513,
                -933.2266133602211,
                -1513,
                -932,
                -1513,
                -932,
                -1513,
                -924,
                -1308,
                -924,
                -1308,
                -1140,
                -1110,
                -1140,
                -1110,
                -1117.238576250846,
                -1110,
                -1107.238576250846,
            ],
        },
        {
            from: -6,
            to: 2,
            fromPort: '未收集到按键值',
            toPort: 'T',
            points: [
                -1394.5,
                -943.2266133602211,
                -1394.5,
                -933.2266133602211,
                -1394.5,
                -932,
                -1394.5,
                -932,
                -1394.5,
                -924,
                -1308,
                -924,
                -1308,
                -1140,
                -1110.1666666666667,
                -1140,
                -1110.1666666666667,
                -1117.238576250846,
                -1110.1666666666667,
                -1107.238576250846,
            ],
        },
        {
            from: 2,
            to: 3,
            fromPort: '1',
            toPort: 'T',
            points: [
                -1187.694580078125,
                -943.2266133602211,
                -1187.694580078125,
                -933.2266133602211,
                -1187.694580078125,
                -932,
                -1187.694580078125,
                -932,
                -1187.694580078125,
                -924,
                -1450,
                -924,
                -1450,
                -907.238576250846,
                -1450,
                -897.238576250846,
            ],
        },
        {
            from: 2,
            to: 3,
            fromPort: '2',
            toPort: 'T',
            points: [
                -1157.898193359375,
                -943.2266133602211,
                -1157.898193359375,
                -933.2266133602211,
                -1157.898193359375,
                -932,
                -1157.898193359375,
                -932,
                -1157.898193359375,
                -924,
                -1449.8333333333333,
                -924,
                -1449.8333333333333,
                -907.238576250846,
                -1449.8333333333333,
                -897.238576250846,
            ],
        },
        {
            from: 2,
            to: 3,
            fromPort: '3',
            toPort: 'T',
            points: [
                -1128.101806640625,
                -943.2266133602211,
                -1128.101806640625,
                -933.2266133602211,
                -1128.101806640625,
                -932,
                -1128.101806640625,
                -932,
                -1128.101806640625,
                -924,
                -1449.75,
                -924,
                -1449.75,
                -907.238576250846,
                -1449.75,
                -897.238576250846,
            ],
        },
        {
            from: 2,
            to: 3,
            fromPort: '4',
            toPort: 'T',
            points: [
                -1098.305419921875,
                -943.2266133602211,
                -1098.305419921875,
                -933.2266133602211,
                -1098.305419921875,
                -932,
                -1098.305419921875,
                -932,
                -1098.305419921875,
                -924,
                -1449.7,
                -924,
                -1449.7,
                -907.238576250846,
                -1449.7,
                -897.238576250846,
            ],
        },
        {
            from: 3,
            to: 4,
            fromPort: 'age>=30',
            toPort: 'T',
            points: [
                -1492.45556640625,
                -801.2123311336585,
                -1492.45556640625,
                -791.2123311336585,
                -1492.45556640625,
                -788,
                -1492.45556640625,
                -788,
                -1492.45556640625,
                -780,
                -1636,
                -780,
                -1636,
                -1461,
                -489.83333333333337,
                -1461,
                -489.83333333333337,
                -1375.238576250846,
                -489.83333333333337,
                -1357.238576250846,
            ],
        },
        {
            from: 3,
            to: 4,
            fromPort: 'age<100',
            toPort: 'T',
            points: [
                -1406.3798828125,
                -801.2123311336585,
                -1406.3798828125,
                -791.2123311336585,
                -1406.3798828125,
                -788,
                -1406.3798828125,
                -788,
                -1406.3798828125,
                -780,
                -1635,
                -780,
                -1635,
                -1461,
                -490.00000000000006,
                -1461,
                -490.00000000000006,
                -1367.238576250846,
                -490.00000000000006,
                -1357.238576250846,
            ],
        },
        {
            from: 4,
            to: 5,
            fromPort: 'B',
            toPort: 'T',
            points: [
                -490,
                -1250.508839922721,
                -490,
                -1240.508839922721,
                -490.00000000000006,
                -1240.508839922721,
                -490.00000000000006,
                -1240.508839922721,
                -490.00000000000006,
                -1157.238576250846,
                -490.00000000000006,
                -1147.238576250846,
            ],
        },
        {
            from: 5,
            to: 6,
            fromPort: 'B',
            toPort: 'T',
            points: [
                -490,
                -1040.508839922721,
                -490,
                -1030.508839922721,
                -490,
                -988.8737080867836,
                -470,
                -988.8737080867836,
                -470,
                -947.238576250846,
                -470,
                -937.238576250846,
            ],
        },
        {
            from: 6,
            to: 7,
            fromPort: 'B',
            toPort: 'T',
            points: [
                -470,
                -795.7791035945961,
                -470,
                -785.7791035945961,
                -954,
                -785.7791035945961,
                -954,
                -1437.238576250846,
                -1380,
                -1437.238576250846,
                -1380,
                -1427.238576250846,
            ],
        },
        {
            from: 2,
            to: 5,
            fromPort: '未识别',
            toPort: 'T',
            points: [
                -1050.4072265625,
                -943.2266133602211,
                -1050.4072265625,
                -933.2266133602211,
                -1050.4072265625,
                -932,
                -1050.4072265625,
                -932,
                -1050.4072265625,
                -924,
                -1044,
                -924,
                -1044,
                -749,
                -247,
                -749,
                -247,
                -1211,
                -490.16666666666674,
                -1211,
                -490.16666666666674,
                -1157.238576250846,
                -490.16666666666674,
                -1147.238576250846,
            ],
        },
        {
            from: -7,
            to: -8,
            fromPort: 'B',
            toPort: 'T',
            points: [
                -800,
                -1250.508839922721,
                -800,
                -1240.508839922721,
                -800,
                -1240.508839922721,
                -800,
                -1240.508839922721,
                -800,
                -1157.238576250846,
                -800,
                -1147.238576250846,
            ],
        },
        {
            from: -8,
            to: -10,
            fromPort: 'B',
            toPort: 'T',
            points: [
                -800,
                -1040.508839922721,
                -800,
                -1030.508839922721,
                -800,
                -988.8737080867836,
                -800,
                -988.8737080867836,
                -800,
                -947.238576250846,
                -800,
                -937.238576250846,
            ],
        },
    ];
}

export function paletteNodeDataArrayFn() {
    return [
        {
            key: 0,
            icon: 'Georgia',
            category: 'StartComponent',
            title: '开始组件',
            name: '开始',
        },
        {
            key: 1,
            icon: 'Russia',
            category: 'IntentComponent',
            //意图组件名称
            title: '意图组件',
            //话术内容
            script: '你好，数字1，2，3分别代表满意，一般和不满意，请输入',
            //短信设置 on/off
            smsSwitch: 'on',
            //意图列表
            intentionArray: [
                {
                    text: '同意',
                },
                {
                    text: '不同意',
                },
                {
                    text: '未理解',
                },
            ],
            //超时时长 单位s
            timeout: 0,
            //超时话术
            timeoutScript: '超时了',
            //超时后续
            timeoutFollowUp: '超时后续流程', //title: "意图组件",
            //name: "Sergei Tarassenko",
            //nation: "Russia",
            //color: "lightsalmon",
            //headOf: "Division for Ocean Affairs and the Law of the Sea",
            //intentionArray: [{'text': '同意'}, {'text': '不同意'}, {'text': '未理解'}]
        },
        {
            key: 2,
            icon: 'Norway',
            category: 'KeyComponent',
            //按键组件名称
            title: '按键组件',
            //话术内容
            script: '你好，数字1，2，3分别代表满意，一般和不满意，请输入',
            //短信设置 on/off
            smsSwitch: 'on',
            //按键标记 PressKey/ReceiveNumber 按键/收号
            keyFlag: 'PressKey',
            //按键数据
            pressKeyArray: [
                {
                    key: '1',
                },
                {
                    key: '2',
                },
                {
                    key: '3',
                },
                {
                    key: '4',
                },
                {
                    key: '未识别',
                },
            ],
            //收号状态下，默认的语义配置
            receiveNumberDefaultArray: [
                {
                    intent: '收集到按键值',
                },
                {
                    intent: '未收集到按键值',
                },
            ],
            //收号最小位数
            receiveNumberMin: 0,
            //收号最大位数
            receiveNumberMax: 0,
            //收号是否#号结束
            receiveNumberEnd: true,
            //尝试次数 1/2
            numberOfAttempts: 1,
            //超时时间 单位s
            timeout: 0,
        },
        {
            key: 3,
            icon: 'Ireland',
            category: 'ConditionComponent',
            //条件组件名称
            title: '条件组件',
            //条件列表
            conditionArray: [
                {
                    describe: 'age>=30',
                    leftVal: 'age',
                    condition: '>=',
                    rightVal: '30',
                },
                {
                    describe: 'age<100',
                    leftVal: 'age',
                    condition: '<',
                    rightVal: '100',
                },
            ],
        },
        {
            key: 4,
            icon: 'Denmark',
            category: 'InterfaceComponent',
            //接口组件名称
            title: '接口组件',
            interfaceInfo: {
                name: 'userService',
                protocol: 'webservice',
                url: 'http://www.xxxx.xxx/',
                requestParam: {
                    name: '张三',
                    age: '80',
                    location: 'xxx',
                },
                responseParam: {}, //interfaceInfo: {}
            },
        },
        {
            key: 5,
            icon: 'Argentina',
            category: 'TransferManualServiceComponent',
            //转人工组件名称
            title: '转人工组件',
            //转人工号码
            //phoneNumber: ""
            phoneNumber: '13111111111',
        },
        {
            key: 6,
            icon: 'CzechRepublic',
            category: 'InfoCollectionComponent',
            //信息收集组件名称
            title: '信息收集组件',
            //话术内容
            //script: "请问您的身份证号是多少？",
            script: '',
            //变量名
            variableName: 'userid',
            intentionArray: [
                {
                    text: '同意',
                },
                {
                    text: '不同意',
                },
                {
                    text: '未理解',
                },
            ],
        },
        {
            key: 7,
            icon: 'Georgia',
            category: 'EndComponent',
            title: '结束组件',
            name: '结束',
        },
    ];
}