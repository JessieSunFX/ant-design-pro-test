import React, { useRef, useEffect } from "react";

import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';
import Inspector from './DataInspector.js'

import './style.less';  // contains .diagram-component CSS
import './DataInspector.css';

// setup a few example class nodes and relationships
let nodedata = [
    { "key": -6, "icon": "Norway", "category": "KeyComponent", "title": "按键组件(收号)", "script": "你好，数字1，2，3分别代表满意，一般和不满意，请输入", "smsSwitch": "on", "keyFlag": "ReceiveNumber", "pressKeyArray": [{ "key": "1" }, { "key": "2" }, { "key": "3" }, { "key": "4" }, { "key": "未识别" }], "receiveNumberDefaultArray": [{ "intent": "收集到按键值" }, { "intent": "未收集到按键值" }], "receiveNumberMin": 0, "receiveNumberEnd": true, "numberOfAttempts": 1, "timeout": 0, "loc": "-1450 -1110" },
    { "key": 2, "icon": "Norway", "category": "KeyComponent", "title": "按键组件(按键)", "script": "你好，数字1，2，3分别代表满意，一般和不满意，请输入", "smsSwitch": "on", "keyFlag": "PressKey", "pressKeyArray": [{ "key": "1" }, { "key": "2" }, { "key": "3" }, { "key": "4" }, { "key": "未识别" }], "receiveNumberDefaultArray": [{ "intent": "收集到按键值" }, { "intent": "未收集到按键值" }], "receiveNumberMin": 0, "receiveNumberEnd": true, "numberOfAttempts": 1, "timeout": 0, "loc": "-1110 -1110" },
    { "key": 1, "icon": "Russia", "category": "IntentComponent", "title": "意图组件", "script": "你好，数字1，2，3分别代表满意，一般和不满意，请输入", "smsSwitch": "on", "intentionArray": [{ "text": "同意" }, { "text": "不同意" }, { "text": "未理解" }], "timeout": 0, "timeoutScript": "超时了", "timeoutFollowUp": "超时后续流程", "loc": "-1440 -1330" },
    { "key": 3, "icon": "Ireland", "category": "ConditionComponent", "title": "条件组件", "conditionArray": [{ "describe": "age>=30", "leftVal": "age", "condition": ">=", "rightVal": "30" }, { "describe": "age<100", "leftVal": "age", "condition": "<", "rightVal": "100" }], "loc": "-1450 -900" },
    { "key": 4, "icon": "Denmark", "category": "InterfaceComponent", "title": "接口组件", "interfaceInfo": { "name": "userService", "protocol": "webservice", "url": "http://www.xxxx.xxx/", "requestParam": { "name": "张三", "age": "80", "location": "xxx" }, "responseParam": {} }, "loc": "-490 -1360" },
    { "key": -7, "icon": "Denmark", "category": "InterfaceComponent", "title": "接口组件", "interfaceInfo": {}, "loc": "-800 -1360" },
    { "key": 5, "icon": "Argentina", "category": "TransferManualServiceComponent", "title": "转人工组件", "phoneNumber": "13111111111", "loc": "-490 -1150" },
    { "key": -8, "icon": "Argentina", "category": "TransferManualServiceComponent", "title": "转人工组件", "phoneNumber": "", "loc": "-800 -1150" },
    { "key": 6, "icon": "CzechRepublic", "category": "InfoCollectionComponent", "title": "信息收集组件", "script": "请问您的身份证号是多少？", "variableName": "userid", "intentionArray": [{ "text": "同意" }, { "text": "不同意" }, { "text": "未理解" }], "loc": "-470 -940" },
    { "key": -10, "icon": "CzechRepublic", "category": "InfoCollectionComponent", "title": "信息收集组件", "script": "", "variableName": "userid", "intentionArray": [{ "text": "同意" }, { "text": "不同意" }, { "text": "未理解" }], "loc": "-800 -940" },
    { "key": 7, "icon": "Georgia", "title": "结束组件", "category": "EndComponent", "name": "结束", "loc": "-1380 -1430" },
    { "key": 0, "icon": "Georgia", "category": "StartComponent", "title": "开始组件", "name": "开始", "loc": "-1510 -1430" }
];
let linkdata = [
    { "from": 0, "to": 1, "fromPort": "B", "toPort": "T", "points": [-1510, -1382.761423749154, -1510, -1372.761423749154, -1510, -1355, -1440, -1355, -1440, -1337.238576250846, -1440, -1327.238576250846] },
    { "from": 1, "to": -6, "fromPort": "同意", "toPort": "T", "points": [-1506, -1163.226613360221, -1506, -1153.226613360221, -1506, -1156, -1506, -1156, -1506, -1140, -1450, -1140, -1450, -1117.238576250846, -1450, -1107.238576250846] },
    { "from": 1, "to": -6, "fromPort": "不同意", "toPort": "T", "points": [-1447.5, -1163.226613360221, -1447.5, -1153.226613360221, -1447.5, -1135.2325948055336, -1449.8333333333333, -1135.2325948055336, -1449.8333333333333, -1117.238576250846, -1449.8333333333333, -1107.238576250846] },
    { "from": 1, "to": -6, "fromPort": "未理解", "toPort": "T", "points": [-1381.5, -1163.226613360221, -1381.5, -1153.226613360221, -1381.5, -1156, -1381.5, -1156, -1381.5, -1140, -1449.75, -1140, -1449.75, -1117.238576250846, -1449.75, -1107.238576250846] },
    { "from": -6, "to": 2, "fromPort": "收集到按键值", "toPort": "T", "points": [-1513, -943.2266133602211, -1513, -933.2266133602211, -1513, -932, -1513, -932, -1513, -924, -1308, -924, -1308, -1140, -1110, -1140, -1110, -1117.238576250846, -1110, -1107.238576250846] },
    { "from": -6, "to": 2, "fromPort": "未收集到按键值", "toPort": "T", "points": [-1394.5, -943.2266133602211, -1394.5, -933.2266133602211, -1394.5, -932, -1394.5, -932, -1394.5, -924, -1308, -924, -1308, -1140, -1110.1666666666667, -1140, -1110.1666666666667, -1117.238576250846, -1110.1666666666667, -1107.238576250846] },
    { "from": 2, "to": 3, "fromPort": "1", "toPort": "T", "points": [-1187.694580078125, -943.2266133602211, -1187.694580078125, -933.2266133602211, -1187.694580078125, -932, -1187.694580078125, -932, -1187.694580078125, -924, -1450, -924, -1450, -907.238576250846, -1450, -897.238576250846] },
    { "from": 2, "to": 3, "fromPort": "2", "toPort": "T", "points": [-1157.898193359375, -943.2266133602211, -1157.898193359375, -933.2266133602211, -1157.898193359375, -932, -1157.898193359375, -932, -1157.898193359375, -924, -1449.8333333333333, -924, -1449.8333333333333, -907.238576250846, -1449.8333333333333, -897.238576250846] },
    { "from": 2, "to": 3, "fromPort": "3", "toPort": "T", "points": [-1128.101806640625, -943.2266133602211, -1128.101806640625, -933.2266133602211, -1128.101806640625, -932, -1128.101806640625, -932, -1128.101806640625, -924, -1449.75, -924, -1449.75, -907.238576250846, -1449.75, -897.238576250846] },
    { "from": 2, "to": 3, "fromPort": "4", "toPort": "T", "points": [-1098.305419921875, -943.2266133602211, -1098.305419921875, -933.2266133602211, -1098.305419921875, -932, -1098.305419921875, -932, -1098.305419921875, -924, -1449.7, -924, -1449.7, -907.238576250846, -1449.7, -897.238576250846] },
    { "from": 3, "to": 4, "fromPort": "age>=30", "toPort": "T", "points": [-1492.45556640625, -801.2123311336585, -1492.45556640625, -791.2123311336585, -1492.45556640625, -788, -1492.45556640625, -788, -1492.45556640625, -780, -1636, -780, -1636, -1461, -489.83333333333337, -1461, -489.83333333333337, -1375.238576250846, -489.83333333333337, -1357.238576250846] },
    { "from": 3, "to": 4, "fromPort": "age<100", "toPort": "T", "points": [-1406.3798828125, -801.2123311336585, -1406.3798828125, -791.2123311336585, -1406.3798828125, -788, -1406.3798828125, -788, -1406.3798828125, -780, -1635, -780, -1635, -1461, -490.00000000000006, -1461, -490.00000000000006, -1367.238576250846, -490.00000000000006, -1357.238576250846] },
    { "from": 4, "to": 5, "fromPort": "B", "toPort": "T", "points": [-490, -1250.508839922721, -490, -1240.508839922721, -490.00000000000006, -1240.508839922721, -490.00000000000006, -1240.508839922721, -490.00000000000006, -1157.238576250846, -490.00000000000006, -1147.238576250846] },
    { "from": 5, "to": 6, "fromPort": "B", "toPort": "T", "points": [-490, -1040.508839922721, -490, -1030.508839922721, -490, -988.8737080867836, -470, -988.8737080867836, -470, -947.238576250846, -470, -937.238576250846] },
    { "from": 6, "to": 7, "fromPort": "B", "toPort": "T", "points": [-470, -795.7791035945961, -470, -785.7791035945961, -954, -785.7791035945961, -954, -1437.238576250846, -1380, -1437.238576250846, -1380, -1427.238576250846] },
    { "from": 2, "to": 5, "fromPort": "未识别", "toPort": "T", "points": [-1050.4072265625, -943.2266133602211, -1050.4072265625, -933.2266133602211, -1050.4072265625, -932, -1050.4072265625, -932, -1050.4072265625, -924, -1044, -924, -1044, -749, -247, -749, -247, -1211, -490.16666666666674, -1211, -490.16666666666674, -1157.238576250846, -490.16666666666674, -1147.238576250846] },
    { "from": -7, "to": -8, "fromPort": "B", "toPort": "T", "points": [-800, -1250.508839922721, -800, -1240.508839922721, -800, -1240.508839922721, -800, -1240.508839922721, -800, -1157.238576250846, -800, -1147.238576250846] },
    { "from": -8, "to": -10, "fromPort": "B", "toPort": "T", "points": [-800, -1040.508839922721, -800, -1030.508839922721, -800, -988.8737080867836, -800, -988.8737080867836, -800, -947.238576250846, -800, -937.238576250846] }
];

/**
 * This function is responsible for setting up the diagram's initial properties and any templates.
 */
const $ = go.GraphObject.make;

// define the Node templates for regular nodes
var mt8 = new go.Margin(8, 0, 0, 0);
var mr8 = new go.Margin(0, 8, 0, 0);
var ml8 = new go.Margin(0, 0, 0, 8);

var lineMinWidth = 240;

function theIconFlagConverter(icon: any) {
    // return "./icon/" + icon + ".png";
    return "https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
}

const diagram =
    $(go.Diagram,
        {
            //margin: new go.Margin(0, 0, 0, 0),
            allowDrop: true, // 允许拖拽
            allowCopy: true, // 禁止复制
            //scrollsPageOnFocus: true,// 滚动页焦点
            isReadOnly: false,// 禁止编辑
            // "draggingTool.dragsLink": true, // 拖动工具拖动链接
            "draggingTool.isGridSnapEnabled": true, // 拖动工具已启用网格捕捉
            "animationManager.isEnabled": false, // 取消加载动画
            "linkingTool.isUnconnectedLinkValid": false, // 链接工具未连接链接有效
            "linkingTool.portGravity": 200, // 链接工具端口重力
            "relinkingTool.isUnconnectedLinkValid": true, // 重新连接工具未连接链接有效
            "relinkingTool.portGravity": 250, // 重新连接工具端口重力
            "relinkingTool.fromHandleArchetype":
                $(go.Shape, "Diamond", {
                    segmentIndex: 0,
                    cursor: "pointer",
                    desiredSize: new go.Size(8, 8),
                    fill: "tomato",
                    stroke: "darkred",
                }),
            "relinkingTool.toHandleArchetype":
                $(go.Shape, "Diamond", {
                    segmentIndex: -1,
                    cursor: "pointer",
                    desiredSize: new go.Size(8, 8),
                    fill: "darkred",
                    stroke: "tomato"
                }),
            "linkReshapingTool.handleArchetype":
                $(go.Shape, "Diamond", {
                    desiredSize: new go.Size(7, 7),
                    fill: "lightblue",
                    stroke: "deepskyblue"
                }),
            "rotatingTool.snapAngleMultiple": 15,//角度
            "rotatingTool.snapAngleEpsilon": 15,
            "undoManager.isEnabled": true//键盘事件
        });
function initDiagram() {


    // show visibility or access as a single character at the beginning of each property or method
    function convertVisibility(v: any) {
        switch (v) {
            case "public": return "+";
            case "private": return "-";
            case "protected": return "#";
            case "package": return "~";
            default: return v;
        }
    }
    // the item template for properties
    var propertyTemplate =
        $(go.Panel, "Horizontal",
            // property visibility/access
            $(go.TextBlock,
                { isMultiline: false, editable: false, width: 12 },
                new go.Binding("text", "visibility", convertVisibility)),
            // property name, underlined if scope=="class" to indicate static property
            $(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
            // property type, if known
            $(go.TextBlock, "",
                new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
            $(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "type").makeTwoWay()),
            // property default value, if any
            $(go.TextBlock,
                { isMultiline: false, editable: false },
                new go.Binding("text", "default", function (s) { return s ? " = " + s : ""; }))
        );
    // the item template for methods
    var methodTemplate =
        $(go.Panel, "Horizontal",
            // method visibility/access
            $(go.TextBlock,
                { isMultiline: false, editable: false, width: 12 },
                new go.Binding("text", "visibility", convertVisibility)),
            // method name, underlined if scope=="class" to indicate static method
            $(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
            // method parameters
            $(go.TextBlock, "()",
                // this does not permit adding/editing/removing of parameters via inplace edits
                new go.Binding("text", "parameters", function (parr) {
                    var s = "(";
                    for (var i = 0; i < parr.length; i++) {
                        var param = parr[i];
                        if (i > 0) s += ", ";
                        s += param.name + ": " + param.type;
                    }
                    return s + ")";
                })),
            // method return type, if any
            $(go.TextBlock, "",
                new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
            $(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "type").makeTwoWay())
        );

    // define a simple Node template
    diagram.nodeTemplate =
        $(go.Node, 'Auto',  // the Shape will go around the TextBlock
            {
                locationSpot: go.Spot.Center,
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides
            },
            $(go.Shape, { fill: "lightyellow" }),
            $(go.Panel, "Table",
                { defaultRowSeparatorStroke: "black" },
                // header
                $(go.TextBlock,
                    {
                        row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
                        font: "bold 12pt sans-serif",
                        isMultiline: false, editable: true
                    },
                    new go.Binding("text", "name").makeTwoWay()),
                // properties
                $(go.TextBlock, "Properties",
                    { row: 1, font: "italic 10pt sans-serif" },
                    new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("PROPERTIES")),
                $(go.Panel, "Vertical", { name: "PROPERTIES" },
                    new go.Binding("itemArray", "properties"),
                    {
                        row: 1, margin: 3, stretch: go.GraphObject.Fill,
                        defaultAlignment: go.Spot.Left, background: "lightyellow",
                        itemTemplate: propertyTemplate
                    }
                ),
                $("PanelExpanderButton", "PROPERTIES",
                    { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
                    new go.Binding("visible", "properties", function (arr) { return arr.length > 0; })),
                // methods
                $(go.TextBlock, "Methods",
                    { row: 2, font: "italic 10pt sans-serif" },
                    new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("METHODS")),
                $(go.Panel, "Vertical", { name: "METHODS" },
                    new go.Binding("itemArray", "methods"),
                    {
                        row: 2, margin: 3, stretch: go.GraphObject.Fill,
                        defaultAlignment: go.Spot.Left, background: "lightyellow",
                        itemTemplate: methodTemplate
                    }
                ),
                $("PanelExpanderButton", "METHODS",
                    { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
                    new go.Binding("visible", "methods", function (arr) { return arr.length > 0; }))
            )

        );
    // helper definitions for node templates
    function nodeStyle() {
        return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                // the Node.location is at the center of each node
                locationSpot: go.Spot.Center
            }
        ];
    }

    const roundedRectangleParams = {
        parameter1: 2,  // set the rounded corner
        spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight  // make content go all the way to inside edges of rounded corners
    };

    function textStyle(field: any) {
        return [
            {
                font: "15px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
                visible: false  // only show textblocks when there is corresponding data for them
            },
            new go.Binding("visible", field, function (val) {
                return val !== undefined;
            })
        ];
    }

    function nodeStatusConverter(s: any) {
        if (s == 1) return "green";
        if (s == 2) return "yellow";
        return "white";
    }
    function makePortOut(name: any, align: any, spot: any, output: any, input: any) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        return $(go.Shape,
            {
                fromMaxLinks: 1,
                fill: "transparent",  // changed to a color in the mouseEnter event handler
                strokeWidth: 0,  // no stroke
                width: NaN,  // if not stretching horizontally, just 8 wide
                height: 8,  // if not stretching vertically, just 8 tall
                alignment: align,  // align the port on the main Shape
                stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                portId: name,  // declare this object to be a "port"
                fromSpot: spot,  // declare where links may connect at this port
                fromLinkable: output,  // declare whether the user may draw links from here
                toSpot: spot,  // declare where links may connect at this port
                toLinkable: input,  // declare whether the user may draw links to here
                cursor: "pointer",  // show a different cursor to indicate potential link point
                mouseEnter: function (e: any, port: any) {  // the PORT argument will be this Shape
                    if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.2)";
                },
                mouseLeave: function (e: any, port: any) {
                    port.fill = "transparent";
                }
            });
    }

    // 开始组件
    diagram.nodeTemplateMap.add("StartComponent",
        $(go.Node, "Auto", nodeStyle(),
            {
                maxSize: new go.Size(100, 50),
                locationSpot: go.Spot.Top,
                isShadowed: true, shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)",
                selectionAdornmentTemplate:  // selection adornment to match shape of nodes
                    $(go.Adornment, "Auto",
                        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),
                        $(go.Placeholder)
                    ),  // end Adornment
            },
            $(go.Shape, "RoundedRectangle", // 边框
                { strokeWidth: 2, stroke: "#DEDEDE", fill: 'white' }
            ),
            $(go.Shape, "RoundedRectangle", // 接点增强显示
                { strokeWidth: 5, stroke: "white", fill: 'white' },
                new go.Binding("stroke", "status", nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(go.TextBlock, {
                font: "15px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
                textAlign: "center",
                margin: new go.Margin(0, 0, 0, 0),
                visible: true,
                editable: false,
                alignment: go.Spot.Center
            }, new go.Binding("text", "name")),
            makePortOut("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    );




    // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId,
    // the "align" is used to determine where to position the port relative to the body of the node,
    // the "spot" is used to control how links connect with the port and whether the port
    // stretches along the side of the node,
    // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
    function makePort(name: any, align: any, spot: any, output: any, input: any) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        return $(go.Shape,
            {
                fill: "transparent",  // changed to a color in the mouseEnter event handler
                strokeWidth: 0,  // no stroke
                width: 1,  // if not stretching horizontally, just 8 wide
                height: 1,  // if not stretching vertically, just 8 tall
                alignment: align,  // align the port on the main Shape
                stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                portId: name,  // declare this object to be a "port"
                fromSpot: spot,  // declare where links may connect at this port
                fromLinkable: output,  // declare whether the user may draw links from here
                toSpot: spot,  // declare where links may connect at this port
                toLinkable: input,  // declare whether the user may draw links to here
                cursor: "pointer",  // show a different cursor to indicate potential link point
                mouseEnter: function (e: any, port: any) {  // the PORT argument will be this Shape
                    if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                },
                mouseLeave: function (e: any, port: any) {
                    port.fill = "transparent";
                }
            });
    }

    // 意图组件
    diagram.nodeTemplateMap.add("IntentComponent",
        $(go.Node, "Auto", nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true, shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)",
                selectionAdornmentTemplate:  // selection adornment to match shape of nodes
                    $(go.Adornment, "Auto",
                        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),
                        $(go.Placeholder)
                    ),  // end Adornment
            },
            $(go.Shape, "RoundedRectangle", // 接点增强显示
                { strokeWidth: 5, stroke: "white", fill: 'white' },
                new go.Binding("stroke", "status", nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                { name: "SHAPE", fill: "#ffffff", strokeWidth: 0 },
                // bluish if highlighted, white otherwise
                new go.Binding("fill", "isHighlighted", function (h) {
                    return h ? "#e8eaf6" : "#ffffff";
                }).ofObject()
            ),
            $(go.Panel, "Vertical",
                $(go.Panel, "Horizontal",
                    { alignment: go.Spot.Left },
                    $(go.Picture,  // flag image, only visible if a nation is specified
                        { margin: mr8, visible: false, desiredSize: new go.Size(45, 45) },
                        new go.Binding("source", "icon", theIconFlagConverter),
                        new go.Binding("visible", "icon", function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(go.TextBlock, {
                        name: "TB",
                        textAlign: "left",
                        font: "12pt helvetica, arial, sans-serif",
                        stroke: "#A3A9AE",
                        editable: false
                    }, new go.Binding("text", "title")),
                    $("Button", {
                        visible: false,
                        alignment: go.Spot.Right,
                        //alignmentFocus: go.Spot.Right,
                        click: function (e, obj) {
                            // 删除该接点
                            var node = obj.part;
                            if (node !== null) {
                                diagram.startTransaction("remove dept");
                                diagram.remove(node);
                                diagram.commitTransaction("remove dept");
                            }
                        }
                        // 定义装饰中此按钮的单击行为
                    },
                        $(go.Picture,  // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: "./icon/close.png"
                            })
                    )
                ),
                $(go.Shape, "LineH",
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: "rgba(0, 0, 0, .60)", strokeWidth: 1,
                        height: 1, stretch: go.GraphObject.Horizontal
                    },
                    new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
                ),
                $(go.TextBlock, textStyle("script"),
                    {
                        textAlign: "center",
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Center,
                        //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding("text", "script").makeTwoWay()
                ),
                $(go.Panel, 'Horizontal',
                    {
                        alignment: go.Spot.Bottom,
                        margin: new go.Margin(10, 0, 0, 0)
                    },
                    $(go.Panel, 'Horizontal',
                        new go.Binding("itemArray", "intentionArray"),
                        {
                            itemTemplate:
                                $(go.Panel,
                                    {
                                        margin: 5,
                                        fromLinkable: true,
                                        toLinkable: false,
                                        fromLinkableDuplicates: true,
                                        toLinkableDuplicates: false,
                                        fromSpot: go.Spot.Bottom,
                                        toSpot: go.Spot.Bottom,
                                        fromMaxLinks: 1,
                                        toMaxLinks: 0,
                                        cursor: "pointer",
                                        mouseEnter: function (e, port: any) {  // the PORT argument will be this Shape
                                            port.fill = "rgba(255,0,255,0.5)";
                                        },
                                        mouseLeave: function (e, port: any) {
                                            port.fill = "transparent";
                                        }
                                    }, new go.Binding('portId', 'text'),
                                    $(go.Panel, 'Auto',
                                        $(go.Shape, "Rectangle",
                                            {
                                                fill: '#FFFFFF',
                                                stroke: '#DCEAFC',
                                            }),
                                        $(go.TextBlock,
                                            {
                                                margin: 5,
                                                stroke: "#1883D7",
                                                font: "15px sans-serif",
                                                mouseEnter: function (e: any, port: any) {  // the PORT argument will be this Shape
                                                    port.stroke = "#F883D7";
                                                },
                                                mouseLeave: function (e: any, port: any) {
                                                    port.stroke = "#1883D7";
                                                }
                                            },
                                            new go.Binding('text', 'text')
                                        )
                                    )
                                )
                        }
                    ),
                )
            ),
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true)
        )
    )

    function showIntentList(keyFlagValue: any) {
        return [
            {
                visible: false  // only show textblocks when there is corresponding data for them
            },
            new go.Binding("visible", "keyFlag", function (val) {
                return val == keyFlagValue;
            })
        ];
    }

    // 按键组件
    diagram.nodeTemplateMap.add("KeyComponent",
        $(go.Node, "Auto", nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true, shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)",
                selectionAdornmentTemplate:  // selection adornment to match shape of nodes
                    $(go.Adornment, "Auto",
                        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),
                        $(go.Placeholder)
                    ),  // end Adornment
            },
            $(go.Shape, "RoundedRectangle", // 接点增强显示
                { strokeWidth: 5, stroke: "white", fill: 'white' },
                new go.Binding("stroke", "status", nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                { name: "SHAPE", fill: "#ffffff", strokeWidth: 0 },
                // bluish if highlighted, white otherwise
                new go.Binding("fill", "isHighlighted", function (h) {
                    return h ? "#e8eaf6" : "#ffffff";
                }).ofObject()
            ),
            $(go.Panel, "Vertical",
                $(go.Panel, "Horizontal",
                    { alignment: go.Spot.Left },
                    $(go.Picture,  // flag image, only visible if a nation is specified
                        { margin: mr8, visible: false, desiredSize: new go.Size(45, 45) },
                        new go.Binding("source", "icon", theIconFlagConverter),
                        new go.Binding("visible", "icon", function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(go.TextBlock, {
                        name: "TB",
                        textAlign: "left",
                        font: "12pt helvetica, arial, sans-serif",
                        stroke: "#A3A9AE",
                        editable: false
                    }, new go.Binding("text", "title")),
                    $("Button", {
                        visible: false,
                        alignment: go.Spot.Right,
                        //alignmentFocus: go.Spot.Right,
                        click: function (e, obj) {
                            // 删除该接点
                            var node = obj.part;
                            if (node !== null) {
                                diagram.startTransaction("remove dept");
                                diagram.remove(node);
                                diagram.commitTransaction("remove dept");
                            }
                        }
                        // 定义装饰中此按钮的单击行为
                    },
                        $(go.Picture,  // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: "./icon/close.png"
                            })
                    )
                ),
                $(go.Shape, "LineH",
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: "rgba(0, 0, 0, .60)", strokeWidth: 1,
                        height: 1, stretch: go.GraphObject.Horizontal
                    },
                    new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
                ),
                $(go.TextBlock, textStyle("script"),
                    {
                        textAlign: "center",
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Center,
                        //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding("text", "script").makeTwoWay()
                ),
                $(go.Panel, 'Horizontal',
                    {
                        alignment: go.Spot.Bottom,
                        margin: new go.Margin(10, 0, 0, 0)
                    },
                    $(go.Panel, 'Horizontal', showIntentList("PressKey"),
                        new go.Binding("itemArray", "pressKeyArray"),
                        {
                            itemTemplate:
                                $(go.Panel,
                                    {
                                        margin: 5,
                                        fromLinkable: true,
                                        toLinkable: false,
                                        fromLinkableDuplicates: true,
                                        toLinkableDuplicates: false,
                                        fromSpot: go.Spot.Bottom,
                                        toSpot: go.Spot.Bottom,
                                        fromMaxLinks: 1,
                                        toMaxLinks: 0,
                                        cursor: "pointer",
                                        mouseEnter: function (e: any, port: any) {  // the PORT argument will be this Shape
                                            port.fill = "rgba(255,0,255,0.5)";
                                        },
                                        mouseLeave: function (e: any, port: any) {
                                            port.fill = "transparent";
                                        }
                                    }, new go.Binding('portId', 'key'),
                                    $(go.Panel, 'Auto',
                                        $(go.Shape, "Rectangle",
                                            {
                                                //fill: '#DCEAFC',
                                                //stroke: null,
                                                fill: '#FFFFFF',
                                                stroke: '#DCEAFC',
                                            }),
                                        $(go.TextBlock,
                                            {
                                                margin: 5,
                                                stroke: "#1883D7",
                                                font: "15px sans-serif",
                                                mouseEnter: function (e: any, port: any) {  // the PORT argument will be this Shape
                                                    port.stroke = "#F883D7";
                                                },
                                                mouseLeave: function (e: any, port: any) {
                                                    port.stroke = "#1883D7";
                                                }
                                            },
                                            new go.Binding('text', 'key')
                                        )
                                    )
                                )
                        }
                    ),
                    $(go.Panel, 'Horizontal', showIntentList("ReceiveNumber"),
                        new go.Binding("itemArray", "receiveNumberDefaultArray"),
                        {
                            itemTemplate:
                                $(go.Panel,
                                    {
                                        margin: 5,
                                        fromLinkable: true,
                                        toLinkable: false,
                                        fromLinkableDuplicates: true,
                                        toLinkableDuplicates: false,
                                        fromSpot: go.Spot.Bottom,
                                        toSpot: go.Spot.Bottom,
                                        fromMaxLinks: 1,
                                        toMaxLinks: 0,
                                        cursor: "pointer",
                                        mouseEnter: function (e, port: any) {  // the PORT argument will be this Shape
                                            port.fill = "rgba(255,0,255,0.5)";
                                        },
                                        mouseLeave: function (e, port: any) {
                                            port.fill = "transparent";
                                        }
                                    }, new go.Binding('portId', 'intent'),
                                    $(go.Panel, 'Auto',
                                        $(go.Shape, "Rectangle",
                                            {
                                                //fill: '#DCEAFC',
                                                //stroke: null,
                                                fill: '#FFFFFF',
                                                stroke: '#DCEAFC',
                                            }),
                                        $(go.TextBlock,
                                            {
                                                margin: 5,
                                                stroke: "#1883D7",
                                                font: "15px sans-serif",
                                                mouseEnter: function (e: any, port: any) {  // the PORT argument will be this Shape
                                                    port.stroke = "#F883D7";
                                                },
                                                mouseLeave: function (e: any, port: any) {
                                                    port.stroke = "#1883D7";
                                                }
                                            },
                                            new go.Binding('text', 'intent')
                                        )
                                    )
                                )
                        }
                    )
                )
                //                        )
            ),
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true)
        )
    );

    // 条件组件
    diagram.nodeTemplateMap.add("ConditionComponent",
        $(go.Node, "Auto", nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true, shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)",
                selectionAdornmentTemplate:  // selection adornment to match shape of nodes
                    $(go.Adornment, "Auto",
                        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),
                        $(go.Placeholder)
                    ),  // end Adornment
            },
            $(go.Shape, "RoundedRectangle", // 接点增强显示
                { strokeWidth: 5, stroke: "white", fill: 'white' },
                new go.Binding("stroke", "status", nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                { name: "SHAPE", fill: "#ffffff", strokeWidth: 0 },
                // bluish if highlighted, white otherwise
                new go.Binding("fill", "isHighlighted", function (h) {
                    return h ? "#e8eaf6" : "#ffffff";
                }).ofObject()
            ),
            $(go.Panel, "Vertical",
                $(go.Panel, "Horizontal",
                    { alignment: go.Spot.Left },
                    $(go.Picture,  // flag image, only visible if a nation is specified
                        { margin: mr8, visible: false, desiredSize: new go.Size(45, 45) },
                        new go.Binding("source", "icon", theIconFlagConverter),
                        new go.Binding("visible", "icon", function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(go.TextBlock, {
                        name: "TB",
                        textAlign: "left",
                        font: "12pt helvetica, arial, sans-serif",
                        stroke: "#A3A9AE",
                        editable: false
                    }, new go.Binding("text", "title")),
                    $("Button", {
                        visible: false,
                        alignment: go.Spot.Right,
                        //alignmentFocus: go.Spot.Right,
                        click: function (e, obj) {
                            // 删除该接点
                            var node = obj.part;
                            if (node !== null) {
                                diagram.startTransaction("remove dept");
                                diagram.remove(node);
                                diagram.commitTransaction("remove dept");
                            }
                        }
                        // 定义装饰中此按钮的单击行为
                    },
                        $(go.Picture,  // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: "./icon/close.png"
                            })
                    )
                ),
                $(go.Shape, "LineH",
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: "rgba(0, 0, 0, .60)", strokeWidth: 1,
                        height: 1, stretch: go.GraphObject.Horizontal
                    },
                    new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
                ),
                $(go.Panel, 'Horizontal',
                    {
                        alignment: go.Spot.Bottom,
                        margin: new go.Margin(10, 0, 0, 0)
                    },
                    $(go.Panel, 'Horizontal',
                        new go.Binding("itemArray", "conditionArray"),
                        {
                            itemTemplate:
                                $(go.Panel,
                                    {
                                        margin: 5,
                                        fromLinkable: true,
                                        toLinkable: false,
                                        fromLinkableDuplicates: true,
                                        toLinkableDuplicates: false,
                                        fromSpot: go.Spot.Bottom,
                                        toSpot: go.Spot.Bottom,
                                        fromMaxLinks: 1,
                                        toMaxLinks: 0,
                                        cursor: "pointer",
                                        mouseEnter: function (e: any, port: any) {  // the PORT argument will be this Shape
                                            port.fill = "rgba(255,0,255,0.5)";
                                        },
                                        mouseLeave: function (e: any, port: any) {
                                            port.fill = "transparent";
                                        }
                                    }, new go.Binding('portId', 'describe'),
                                    $(go.Panel, 'Auto',
                                        $(go.Shape, "Rectangle",
                                            {
                                                //fill: '#DCEAFC',
                                                //stroke: null,
                                                fill: '#FFFFFF',
                                                stroke: '#DCEAFC',
                                            }),
                                        $(go.TextBlock,
                                            {
                                                margin: 5,
                                                stroke: "#1883D7",
                                                font: "15px sans-serif",
                                                mouseEnter: function (e: any, port: any) {  // the PORT argument will be this Shape
                                                    port.stroke = "#F883D7";
                                                },
                                                mouseLeave: function (e: any, port: any) {
                                                    port.stroke = "#1883D7";
                                                }
                                            },
                                            new go.Binding('text', 'describe')
                                        )
                                    )
                                )
                        }
                    ),
                )
            ),
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true)
        )
    );

    // 接口组件
    diagram.nodeTemplateMap.add("InterfaceComponent",
        $(go.Node, "Auto", nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true, shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)",
                selectionAdornmentTemplate:  // selection adornment to match shape of nodes
                    $(go.Adornment, "Auto",
                        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),
                        $(go.Placeholder)
                    ),  // end Adornment
            },
            $(go.Shape, "RoundedRectangle", // 接点增强显示
                { strokeWidth: 5, stroke: "white", fill: 'white' },
                new go.Binding("stroke", "status", nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                { name: "SHAPE", fill: "#ffffff", strokeWidth: 0 },
                // bluish if highlighted, white otherwise
                new go.Binding("fill", "isHighlighted", function (h) {
                    return h ? "#e8eaf6" : "#ffffff";
                }).ofObject()
            ),
            $(go.Panel, "Vertical",
                $(go.Panel, "Horizontal",
                    { alignment: go.Spot.Left },
                    $(go.Picture,  // flag image, only visible if a nation is specified
                        { margin: mr8, visible: false, desiredSize: new go.Size(45, 45) },
                        new go.Binding("source", "icon", theIconFlagConverter),
                        new go.Binding("visible", "icon", function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(go.TextBlock, {
                        name: "TB",
                        textAlign: "left",
                        font: "12pt helvetica, arial, sans-serif",
                        stroke: "#A3A9AE",
                        editable: false
                    }, new go.Binding("text", "title")),
                    $("Button", {
                        visible: false,
                        alignment: go.Spot.Right,
                        //alignmentFocus: go.Spot.Right,
                        click: function (e, obj) {
                            // 删除该接点
                            var node = obj.part;
                            if (node !== null) {
                                diagram.startTransaction("remove dept");
                                diagram.remove(node);
                                diagram.commitTransaction("remove dept");
                            }
                        }
                        // 定义装饰中此按钮的单击行为
                    },
                        $(go.Picture,  // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: "./icon/close.png"
                            })
                    )
                ),
                $(go.Shape, "LineH",
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: "rgba(0, 0, 0, .60)", strokeWidth: 1,
                        height: 1, stretch: go.GraphObject.Horizontal
                    },
                    new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
                ),
                $(go.TextBlock,
                    {
                        font: "15px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
                        textAlign: "left",
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Left,
                        //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding("text", "interfaceInfo",
                        function (obj) {
                            if (obj == null || obj == undefined || obj.name == undefined) {
                                return "请先编辑组件";
                            } else {
                                return "调用" + obj.name + "接口";
                            }
                        })
                )
            ),
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
            makePortOut("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    );


    // 转人工组件
    diagram.nodeTemplateMap.add("TransferManualServiceComponent",
        $(go.Node, "Auto", nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true, shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)",
                selectionAdornmentTemplate:  // selection adornment to match shape of nodes
                    $(go.Adornment, "Auto",
                        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),
                        $(go.Placeholder)
                    ),  // end Adornment
            },
            $(go.Shape, "RoundedRectangle", // 接点增强显示
                { strokeWidth: 5, stroke: "white", fill: 'white' },
                new go.Binding("stroke", "status", nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                { name: "SHAPE", fill: "#ffffff", strokeWidth: 0 },
                // bluish if highlighted, white otherwise
                new go.Binding("fill", "isHighlighted", function (h) {
                    return h ? "#e8eaf6" : "#ffffff";
                }).ofObject()
            ),
            $(go.Panel, "Vertical",
                $(go.Panel, "Horizontal",
                    { alignment: go.Spot.Left },
                    $(go.Picture,  // flag image, only visible if a nation is specified
                        { margin: mr8, visible: false, desiredSize: new go.Size(45, 45) },
                        new go.Binding("source", "icon", theIconFlagConverter),
                        new go.Binding("visible", "icon", function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(go.TextBlock, {
                        name: "TB",
                        textAlign: "left",
                        font: "12pt helvetica, arial, sans-serif",
                        stroke: "#A3A9AE",
                        editable: false
                    }, new go.Binding("text", "title")),
                    $("Button", {
                        visible: false,
                        alignment: go.Spot.Right,
                        //alignmentFocus: go.Spot.Right,
                        click: function (e, obj) {
                            // 删除该接点
                            var node = obj.part;
                            if (node !== null) {
                                diagram.startTransaction("remove dept");
                                diagram.remove(node);
                                diagram.commitTransaction("remove dept");
                            }
                        }
                        // 定义装饰中此按钮的单击行为
                    },
                        $(go.Picture,  // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: "./icon/close.png"
                            })
                    )
                ),
                $(go.Shape, "LineH",
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: "rgba(0, 0, 0, .60)", strokeWidth: 1,
                        height: 1, stretch: go.GraphObject.Horizontal
                    },
                    new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
                ),

                $(go.TextBlock,
                    {
                        font: "15px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
                        textAlign: "left",
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Left,
                        //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding("text", "phoneNumber",
                        function (str) {
                            if (str == null || str == undefined || str.length <= 0) {
                                return "请先编辑组件";
                            } else {
                                return "转号码：" + str;
                            }
                        })
                )
            ),
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
            makePortOut("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    );

    // 信息收集组件
    diagram.nodeTemplateMap.add("InfoCollectionComponent",
        $(go.Node, "Auto", nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true, shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)",
                selectionAdornmentTemplate:  // selection adornment to match shape of nodes
                    $(go.Adornment, "Auto",
                        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),
                        $(go.Placeholder)
                    ),  // end Adornment
            },
            $(go.Shape, "RoundedRectangle", // 接点增强显示
                { strokeWidth: 5, stroke: "white", fill: 'white' },
                new go.Binding("stroke", "status", nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                { name: "SHAPE", fill: "#ffffff", strokeWidth: 0 },
                // bluish if highlighted, white otherwise
                new go.Binding("fill", "isHighlighted", function (h) {
                    return h ? "#e8eaf6" : "#ffffff";
                }).ofObject()
            ),
            $(go.Panel, "Vertical",
                $(go.Panel, "Horizontal",
                    { alignment: go.Spot.Left },
                    $(go.Picture,  // flag image, only visible if a nation is specified
                        { margin: mr8, visible: false, desiredSize: new go.Size(45, 45) },
                        new go.Binding("source", "icon", theIconFlagConverter),
                        new go.Binding("visible", "icon", function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(go.TextBlock, {
                        name: "TB",
                        textAlign: "left",
                        font: "12pt helvetica, arial, sans-serif",
                        stroke: "#A3A9AE",
                        editable: false
                    }, new go.Binding("text", "title")),
                    $("Button", {
                        visible: false,
                        alignment: go.Spot.Right,
                        //alignmentFocus: go.Spot.Right,
                        click: function (e, obj) {
                            // 删除该接点
                            var node = obj.part;
                            if (node !== null) {
                                diagram.startTransaction("remove dept");
                                diagram.remove(node);
                                diagram.commitTransaction("remove dept");
                            }
                        }
                        // 定义装饰中此按钮的单击行为
                    },
                        $(go.Picture,  // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: "./icon/close.png"
                            })
                    )
                ),
                $(go.Shape, "LineH",
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: "rgba(0, 0, 0, .60)", strokeWidth: 1,
                        height: 1, stretch: go.GraphObject.Horizontal
                    },
                    new go.Binding("visible").ofObject("INFO")  // only visible when info is expanded
                ),
                $(go.TextBlock,
                    {
                        font: "15px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
                        textAlign: "left",
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(240, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Left,
                        //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding("text", "script",
                        function (str) {
                            if (str == null || str == undefined || str.length <= 0) {
                                return "请先编辑组件";
                            } else {
                                return "话术：" + str;
                            }
                        })
                ),
                $(go.TextBlock,
                    {
                        font: "15px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
                        textAlign: "left",
                        margin: new go.Margin(10, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        visible: true,
                        editable: false,
                        alignment: go.Spot.Left,
                        //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding("text", "variableName",
                        function (str) {
                            if (str == null || str == undefined || str.length <= 0) {
                                return "";
                            } else {
                                return "变量名：" + str;
                            }
                        }),
                    new go.Binding("visible", "script",
                        function (str) {
                            if (str == null || str == undefined || str.length <= 0) {
                                return false;
                            } else {
                                return true;
                            }
                        })
                )
            ),
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
            makePortOut("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    );

    // 结束组件
    diagram.nodeTemplateMap.add("EndComponent",
        $(go.Node, "Auto", nodeStyle(),
            {
                maxSize: new go.Size(100, 50),
                locationSpot: go.Spot.Top,
                isShadowed: true, shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: "rgba(0, 0, 0, .14)",
                selectionAdornmentTemplate:  // selection adornment to match shape of nodes
                    $(go.Adornment, "Auto",
                        $(go.Shape, "RoundedRectangle", roundedRectangleParams,
                            { fill: null, stroke: "#7986cb", strokeWidth: 3 }),
                        $(go.Placeholder)
                    ),  // end Adornment
            },
            $(go.Shape, "RoundedRectangle", // 边框
                { strokeWidth: 2, stroke: "#DEDEDE", fill: 'white' }
            ),
            $(go.Shape, "RoundedRectangle", // 接点增强显示
                { strokeWidth: 5, stroke: "white", fill: 'white' },
                new go.Binding("stroke", "status", nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(go.TextBlock, {
                font: "15px Roboto, sans-serif", stroke: "rgba(0, 0, 0, .60)",
                textAlign: "center",
                margin: new go.Margin(0, 0, 0, 0),
                visible: true,
                editable: false,
                alignment: go.Spot.Center
            }, new go.Binding("text", "name")),
            makePort("T", go.Spot.Top, go.Spot.TopSide, false, true)
        )
    );

    var linkSelectionAdornmentTemplate =
        $(go.Adornment, "Link",
            $(go.Shape,
                { isPanelMain: true, fill: null, stroke: "red", strokeWidth: 0 })  // 使用选择对象的strokeWidth
        );

    function linkStatusConverter(s) {
        if (s == 1) return "#FF9191";
        return "transparent";
    }

    // replace the default Link template in the linkTemplateMap
    diagram.linkTemplate =
        $(go.Link,  // the whole link panel
            {
                selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
                routing: go.Link.AvoidsNodes,
                //                        routing: go.Link.Orthogonal,
                curve: go.Link.JumpOver,
                corner: 5, toShortLength: 4,
                relinkableFrom: true,
                relinkableTo: true,
                reshapable: true,
                resegmentable: true,
                // mouse-overs subtly highlight links:
                mouseEnter: function (e: any, link: any) {
                    link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
                },
                mouseLeave: function (e: any, link: any) {
                    link.findObject("HIGHLIGHT").stroke = "transparent";
                },
                selectionAdorned: false
            },
            new go.Binding("points").makeTwoWay(),
            $(go.Shape,  // the highlight shape, normally transparent 链接线的背景区域，通常是透明的
                { isPanelMain: true, strokeWidth: 5, stroke: "transparent", name: "HIGHLIGHT" },
                new go.Binding("stroke", "status", linkStatusConverter), // 连线增强显示
                new go.AnimationTrigger('stroke')),
            $(go.Shape,  // the link path shape 链接线的形状
                { isPanelMain: true, stroke: "gray", strokeWidth: 2 },
                new go.Binding("stroke", "isSelected", function (sel) {
                    return sel ? "dodgerblue" : "gray";
                }).ofObject()),
            $(go.Shape,  // the arrowhead 箭头
                { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
            $(go.Panel, "Auto",  // the link label, normally not visible 链接标签，通常不可见
                { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                new go.Binding("visible", "visible").makeTwoWay(),
                $(go.Shape, "RoundedRectangle",  // the label shape
                    { fill: "#F8F8F8", strokeWidth: 0 }),
                $(go.TextBlock, "Yes",  // the label
                    {
                        textAlign: "center",
                        font: "10pt helvetica, arial, sans-serif",
                        stroke: "#333333",
                        editable: true
                    },
                    new go.Binding("text").makeTwoWay())
            )
        );
    // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
    function showLinkLabel(e: any) {
        var label = e.subject.findObject("LABEL");
        if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
    }

    // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
    diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
    // function convertIsTreeLink(r: any) {
    //     return r === "generalization";
    // }
    // function convertFromArrow(r: any) {
    //     switch (r) {
    //         case "generalization": return "";
    //         default: return "";
    //     }
    // }
    // function convertToArrow(r: any) {
    //     switch (r) {
    //         case "generalization": return "Triangle";
    //         case "aggregation": return "StretchedDiamond";
    //         default: return "";
    //     }
    // }
    // diagram.linkTemplate =
    //     $(go.Link,
    //         { routing: go.Link.Orthogonal },
    //         new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
    //         $(go.Shape),
    //         $(go.Shape, { scale: 1.3, fill: "white" },
    //             new go.Binding("fromArrow", "relationship", convertFromArrow)),
    //         $(go.Shape, { scale: 1.3, fill: "white" },
    //             new go.Binding("toArrow", "relationship", convertToArrow))
    //     );

    diagram.model = $(go.GraphLinksModel,
        {
            copiesArrays: false,
            copiesArrayObjects: false,
            nodeDataArray: nodedata,
            linkDataArray: linkdata,
            linkKeyProperty: 'key'
        });

    return diagram;
}

const paletteNodeDataArray = [{
    key: 0,
    icon: "Georgia",
    category: "StartComponent",
    title: "开始组件",
    name: "开始",
}, {
    key: 1,
    icon: "Russia",
    category: "IntentComponent",
    //意图组件名称
    title: "意图组件",
    //话术内容
    script: "你好，数字1，2，3分别代表满意，一般和不满意，请输入",
    //短信设置 on/off
    smsSwitch: "on",
    //意图列表
    intentionArray: [{ 'text': '同意' }, { 'text': '不同意' }, { 'text': '未理解' }],
    //超时时长 单位s
    timeout: 0,
    //超时话术
    timeoutScript: "超时了",
    //超时后续
    timeoutFollowUp: "超时后续流程"
    //title: "意图组件",
    //name: "Sergei Tarassenko",
    //nation: "Russia",
    //color: "lightsalmon",
    //headOf: "Division for Ocean Affairs and the Law of the Sea",
    //intentionArray: [{'text': '同意'}, {'text': '不同意'}, {'text': '未理解'}]
}, {
    key: 2,
    icon: "Norway",
    category: "KeyComponent",
    //按键组件名称
    title: "按键组件",
    //话术内容
    script: "你好，数字1，2，3分别代表满意，一般和不满意，请输入",
    //短信设置 on/off
    smsSwitch: "on",
    //按键标记 PressKey/ReceiveNumber 按键/收号
    keyFlag: "PressKey",
    //按键数据
    pressKeyArray: [{ 'key': '1' }, { 'key': '2' }, { 'key': '3' }, { 'key': '4' }, { 'key': '未识别' }],
    //收号状态下，默认的语义配置
    receiveNumberDefaultArray: [{ 'intent': "收集到按键值" }, { 'intent': "未收集到按键值" }],
    //收号最小位数
    receiveNumberMin: 0,
    //收号最大位数
    receiveNumberMax: 0,
    //收号是否#号结束
    receiveNumberEnd: true,
    //尝试次数 1/2
    numberOfAttempts: 1,
    //超时时间 单位s
    timeout: 0
}, {
    key: 3,
    icon: "Ireland",
    category: "ConditionComponent",
    //条件组件名称
    title: "条件组件",
    //条件列表
    conditionArray: [{
        'describe': 'age>=30',
        'leftVal': 'age',
        'condition': '>=',
        'rightVal': '30'
    }, { 'describe': 'age<100', 'leftVal': 'age', 'condition': '<', 'rightVal': '100' }]
}, {
    key: 4,
    icon: "Denmark",
    category: "InterfaceComponent",
    //接口组件名称
    title: "接口组件",
    interfaceInfo: {
        "name": "userService",
        "protocol": "webservice",
        "url": "http://www.xxxx.xxx/",
        "requestParam": { "name": "张三", "age": "80", "location": "xxx" },
        "responseParam": {}
    }
    //interfaceInfo: {}
}, {
    key: 5,
    icon: "Argentina",
    category: "TransferManualServiceComponent",
    //转人工组件名称
    title: "转人工组件",
    //转人工号码
    //phoneNumber: ""
    phoneNumber: "13111111111"
}, {
    key: 6,
    icon: "CzechRepublic",
    category: "InfoCollectionComponent",
    //信息收集组件名称
    title: "信息收集组件",
    //话术内容
    //script: "请问您的身份证号是多少？",
    script: "",
    //变量名
    variableName: "userid",

    intentionArray: [{ 'text': '同意' }, { 'text': '不同意' }, { 'text': '未理解' }]
}, {
    key: 7,
    icon: "Georgia",
    category: "EndComponent",
    title: "结束组件",
    name: "结束"
}
];

function initPalette() {
    var myPalette = $(go.Palette, { //用Gridlayout格子布局垂直排列每行数据
        contentAlignment: go.Spot.TopLeft,
        layout: $(go.GridLayout, {
            alignment: go.GridLayout.Left
        }),
        isReadOnly: true,// 禁止编辑
        maxSelectionCount: 1,
        "animationManager.initialAnimationStyle": go.AnimationManager.None,
        "InitialAnimationStarting": animateFadeDown,
    });

    myPalette.nodeTemplate = $(go.Node, "Horizontal", {
        locationObjectName: "TB",
        locationSpot: go.Spot.Center
    }, $(go.Panel, "Horizontal",
        { alignment: go.Spot.Left },
        $(go.Picture,  // flag image, only visible if a nation is specified
            { margin: mr8, visible: false, desiredSize: new go.Size(45, 45) },
            new go.Binding("source", "icon", theIconFlagConverter),
            new go.Binding("visible", "icon", function (nat) {
                return nat !== undefined;
            })
        ),
        $(go.TextBlock, {
            name: "TB",
            textAlign: "left",
            font: "12pt helvetica, arial, sans-serif",
            stroke: "#A3A9AE",
            editable: true
        }, new go.Binding("text", "title"))
    ));
    return myPalette
}



// This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.
function animateFadeDown(e: any) {
    var diagram = e.diagram;
    var animation = new go.Animation();
    animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen
    animation.easing = go.Animation.EaseOutExpo;
    animation.duration = 900;
    // Fade "down", in other words, fade in from above
    animation.add(diagram, 'position', diagram.position.copy().offset(0, 200), diagram.position);
    animation.add(diagram, 'opacity', 0, 1);
    animation.start();
}

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
function handleModelChange(changes: any) {
    console.log('GoJS model changed!');
    console.log(changes);
}

const Robot: React.FC<any> = () => {
    const myInspector = useRef(null);

    useEffect(() => {
        console.log('myInspector:::', myInspector)
        console.log('diagram:::', diagram)
        var inspector = new Inspector(myInspector, diagram,
            {
                // By default the inspector works on the Diagram selection.
                // This property lets us inspect a specific object by calling Inspector.inspectObject.
                //                    multipleSelection: true,
                //                    showSize: 4,
                //                    showAllProperties: true,
                properties: {
                    "text": {},
                    // This property we want to declare as a color, to show a color-picker:
                    "color": { type: 'color' },
                    // key would be automatically added for node data, but we want to declare it read-only also:
                    "key": { readOnly: true, show: Inspector.showIfPresent }
                }
            });
        inspector.inspectObject(diagram);
    }, [])

    return (
        <div className='diagram-wrapper'>
            <ReactPalette
                initPalette={initPalette}
                divClassName='palette-component'
                nodeDataArray={paletteNodeDataArray}
            />

            <div className='diagram-bottom'>
                <ReactDiagram
                    initDiagram={initDiagram}
                    divClassName='diagram-component'
                    nodeDataArray={nodedata}
                    linkDataArray={linkdata}
                    onModelChange={handleModelChange}
                    skipsDiagramUpdate={true}
                />

                <div id='myInspectorId' ref={myInspector} className='inspector'>

                </div>

            </div>



        </div>

    );
};

export default Robot