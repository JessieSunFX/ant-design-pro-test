import React, { useState, useRef, useEffect } from 'react';
import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';
import Inspector from './DataInspector.js';
import { nodedataFn, linkdataFn, paletteNodeDataArrayFn } from './data'
import { history, ConnectProps, connect } from 'umi';
import Test from '@/models/test';


console.log('test:::', Test)


import './DataInspector.css'; // setup a few example class nodes and relationships

import './style.less'; // contains .diagram-component CSS

interface AuthComponentProps extends ConnectProps {
    test: Test.state
  }

let nodedata = nodedataFn();
let linkdata = linkdataFn();
let paletteNodeDataArray = paletteNodeDataArrayFn();

/**
 * This function is responsible for setting up the diagram's initial properties and any templates.
 */

const $ = go.GraphObject.make; // define the Node templates for regular nodes

var mt8 = new go.Margin(8, 0, 0, 0);
var mr8 = new go.Margin(0, 8, 0, 0);
var ml8 = new go.Margin(0, 0, 0, 8);
var lineMinWidth = 240;

function theIconFlagConverter(icon) {
    return `http://frontendup.com/static/img/robot/icon/${icon}.png`;
}

const diagram = $(go.Diagram, {
    //margin: new go.Margin(0, 0, 0, 0),
    allowDrop: true,
    // 允许拖拽
    allowCopy: true,
    // 禁止复制
    //scrollsPageOnFocus: true,// 滚动页焦点
    isReadOnly: false,
    // 禁止编辑
    // "draggingTool.dragsLink": true, // 拖动工具拖动链接
    'draggingTool.isGridSnapEnabled': true,
    // 拖动工具已启用网格捕捉
    'animationManager.isEnabled': false,
    // 取消加载动画
    'linkingTool.isUnconnectedLinkValid': false,
    // 链接工具未连接链接有效
    'linkingTool.portGravity': 200,
    // 链接工具端口重力
    'relinkingTool.isUnconnectedLinkValid': true,
    // 重新连接工具未连接链接有效
    'relinkingTool.portGravity': 250,
    // 重新连接工具端口重力
    'relinkingTool.fromHandleArchetype': $(go.Shape, 'Diamond', {
        segmentIndex: 0,
        cursor: 'pointer',
        desiredSize: new go.Size(8, 8),
        fill: 'tomato',
        stroke: 'darkred',
    }),
    'relinkingTool.toHandleArchetype': $(go.Shape, 'Diamond', {
        segmentIndex: -1,
        cursor: 'pointer',
        desiredSize: new go.Size(8, 8),
        fill: 'darkred',
        stroke: 'tomato',
    }),
    'linkReshapingTool.handleArchetype': $(go.Shape, 'Diamond', {
        desiredSize: new go.Size(7, 7),
        fill: 'lightblue',
        stroke: 'deepskyblue',
    }),
    'rotatingTool.snapAngleMultiple': 15,
    //角度
    'rotatingTool.snapAngleEpsilon': 15,
    'undoManager.isEnabled': true, //键盘事件
});

function initDiagram() {
    // show visibility or access as a single character at the beginning of each property or method
    function convertVisibility(v) {
        switch (v) {
            case 'public':
                return '+';

            case 'private':
                return '-';

            case 'protected':
                return '#';

            case 'package':
                return '~';

            default:
                return v;
        }
    } // the item template for properties

    var propertyTemplate = $(
        go.Panel,
        'Horizontal', // property visibility/access
        $(
            go.TextBlock,
            {
                isMultiline: false,
                editable: false,
                width: 12,
            },
            new go.Binding('text', 'visibility', convertVisibility)
        ), // property name, underlined if scope=="class" to indicate static property
        $(
            go.TextBlock,
            {
                isMultiline: false,
                editable: true,
            },
            new go.Binding('text', 'name').makeTwoWay(),
            new go.Binding('isUnderline', 'scope', function (s) {
                return s[0] === 'c';
            })
        ), // property type, if known
        $(
            go.TextBlock,
            '',
            new go.Binding('text', 'type', function (t) {
                return t ? ': ' : '';
            })
        ),
        $(
            go.TextBlock,
            {
                isMultiline: false,
                editable: true,
            },
            new go.Binding('text', 'type').makeTwoWay()
        ), // property default value, if any
        $(
            go.TextBlock,
            {
                isMultiline: false,
                editable: false,
            },
            new go.Binding('text', 'default', function (s) {
                return s ? ' = ' + s : '';
            })
        )
    ); // the item template for methods

    var methodTemplate = $(
        go.Panel,
        'Horizontal', // method visibility/access
        $(
            go.TextBlock,
            {
                isMultiline: false,
                editable: false,
                width: 12,
            },
            new go.Binding('text', 'visibility', convertVisibility)
        ), // method name, underlined if scope=="class" to indicate static method
        $(
            go.TextBlock,
            {
                isMultiline: false,
                editable: true,
            },
            new go.Binding('text', 'name').makeTwoWay(),
            new go.Binding('isUnderline', 'scope', function (s) {
                return s[0] === 'c';
            })
        ), // method parameters
        $(
            go.TextBlock,
            '()', // this does not permit adding/editing/removing of parameters via inplace edits
            new go.Binding('text', 'parameters', function (parr) {
                var s = '(';

                for (var i = 0; i < parr.length; i++) {
                    var param = parr[i];
                    if (i > 0) s += ', ';
                    s += param.name + ': ' + param.type;
                }

                return s + ')';
            })
        ), // method return type, if any
        $(
            go.TextBlock,
            '',
            new go.Binding('text', 'type', function (t) {
                return t ? ': ' : '';
            })
        ),
        $(
            go.TextBlock,
            {
                isMultiline: false,
                editable: true,
            },
            new go.Binding('text', 'type').makeTwoWay()
        )
    ); // define a simple Node template

    diagram.nodeTemplate = $(
        go.Node,
        'Auto', // the Shape will go around the TextBlock
        {
            locationSpot: go.Spot.Center,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
        },
        $(go.Shape, {
            fill: 'lightyellow',
        }),
        $(
            go.Panel,
            'Table',
            {
                defaultRowSeparatorStroke: 'black',
            }, // header
            $(
                go.TextBlock,
                {
                    row: 0,
                    columnSpan: 2,
                    margin: 3,
                    alignment: go.Spot.Center,
                    font: 'bold 12pt sans-serif',
                    isMultiline: false,
                    editable: true,
                },
                new go.Binding('text', 'name').makeTwoWay()
            ), // properties
            $(
                go.TextBlock,
                'Properties',
                {
                    row: 1,
                    font: 'italic 10pt sans-serif',
                },
                new go.Binding('visible', 'visible', function (v) {
                    return !v;
                }).ofObject('PROPERTIES')
            ),
            $(
                go.Panel,
                'Vertical',
                {
                    name: 'PROPERTIES',
                },
                new go.Binding('itemArray', 'properties'),
                {
                    row: 1,
                    margin: 3,
                    stretch: go.GraphObject.Fill,
                    defaultAlignment: go.Spot.Left,
                    background: 'lightyellow',
                    itemTemplate: propertyTemplate,
                }
            ),
            $(
                'PanelExpanderButton',
                'PROPERTIES',
                {
                    row: 1,
                    column: 1,
                    alignment: go.Spot.TopRight,
                    visible: false,
                },
                new go.Binding('visible', 'properties', function (arr) {
                    return arr.length > 0;
                })
            ), // methods
            $(
                go.TextBlock,
                'Methods',
                {
                    row: 2,
                    font: 'italic 10pt sans-serif',
                },
                new go.Binding('visible', 'visible', function (v) {
                    return !v;
                }).ofObject('METHODS')
            ),
            $(
                go.Panel,
                'Vertical',
                {
                    name: 'METHODS',
                },
                new go.Binding('itemArray', 'methods'),
                {
                    row: 2,
                    margin: 3,
                    stretch: go.GraphObject.Fill,
                    defaultAlignment: go.Spot.Left,
                    background: 'lightyellow',
                    itemTemplate: methodTemplate,
                }
            ),
            $(
                'PanelExpanderButton',
                'METHODS',
                {
                    row: 2,
                    column: 1,
                    alignment: go.Spot.TopRight,
                    visible: false,
                },
                new go.Binding('visible', 'methods', function (arr) {
                    return arr.length > 0;
                })
            )
        )
    ); // helper definitions for node templates

    function nodeStyle() {
        return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                // the Node.location is at the center of each node
                locationSpot: go.Spot.Center,
            },
        ];
    }

    const roundedRectangleParams = {
        parameter1: 2,
        // set the rounded corner
        spot1: go.Spot.TopLeft,
        spot2: go.Spot.BottomRight, // make content go all the way to inside edges of rounded corners
    };

    function textStyle(field) {
        return [
            {
                font: '15px Roboto, sans-serif',
                stroke: 'rgba(0, 0, 0, .60)',
                visible: false, // only show textblocks when there is corresponding data for them
            },
            new go.Binding('visible', field, function (val) {
                return val !== undefined;
            }),
        ];
    }

    function nodeStatusConverter(s) {
        if (s == 1) return 'green';
        if (s == 2) return 'yellow';
        return 'white';
    }

    function makePortOut(name, align, spot, output, input) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom); // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it

        return $(go.Shape, {
            fromMaxLinks: 1,
            fill: 'transparent',
            // changed to a color in the mouseEnter event handler
            strokeWidth: 0,
            // no stroke
            width: NaN,
            // if not stretching horizontally, just 8 wide
            height: 8,
            // if not stretching vertically, just 8 tall
            alignment: align,
            // align the port on the main Shape
            stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
            portId: name,
            // declare this object to be a "port"
            fromSpot: spot,
            // declare where links may connect at this port
            fromLinkable: output,
            // declare whether the user may draw links from here
            toSpot: spot,
            // declare where links may connect at this port
            toLinkable: input,
            // declare whether the user may draw links to here
            cursor: 'pointer',
            // show a different cursor to indicate potential link point
            mouseEnter: function (e, port) {
                // the PORT argument will be this Shape
                if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.2)';
            },
            mouseLeave: function (e, port) {
                port.fill = 'transparent';
            },
        });
    } // 开始组件

    diagram.nodeTemplateMap.add(
        'StartComponent',
        $(
            go.Node,
            'Auto',
            nodeStyle(),
            {
                maxSize: new go.Size(100, 50),
                locationSpot: go.Spot.Top,
                isShadowed: true,
                shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: 'rgba(0, 0, 0, .14)',
                // selection adornment to match shape of nodes
                selectionAdornmentTemplate: $(
                    go.Adornment,
                    'Auto',
                    $(go.Shape, 'RoundedRectangle', roundedRectangleParams, {
                        fill: null,
                        stroke: '#7986cb',
                        strokeWidth: 3,
                    }),
                    $(go.Placeholder)
                ), // end Adornment
            },
            $(
                go.Shape,
                'RoundedRectangle', // 边框
                {
                    strokeWidth: 2,
                    stroke: '#DEDEDE',
                    fill: 'white',
                }
            ),
            $(
                go.Shape,
                'RoundedRectangle', // 接点增强显示
                {
                    strokeWidth: 5,
                    stroke: 'white',
                    fill: 'white',
                },
                new go.Binding('stroke', 'status', nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(
                go.TextBlock,
                {
                    font: '15px Roboto, sans-serif',
                    stroke: 'rgba(0, 0, 0, .60)',
                    textAlign: 'center',
                    margin: new go.Margin(0, 0, 0, 0),
                    visible: true,
                    editable: false,
                    alignment: go.Spot.Center,
                },
                new go.Binding('text', 'name')
            ),
            makePortOut('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    ); // Define a function for creating a "port" that is normally transparent.
    // The "name" is used as the GraphObject.portId,
    // the "align" is used to determine where to position the port relative to the body of the node,
    // the "spot" is used to control how links connect with the port and whether the port
    // stretches along the side of the node,
    // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.

    function makePort(name, align, spot, output, input) {
        var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom); // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it

        return $(go.Shape, {
            fill: 'transparent',
            // changed to a color in the mouseEnter event handler
            strokeWidth: 0,
            // no stroke
            width: 1,
            // if not stretching horizontally, just 8 wide
            height: 1,
            // if not stretching vertically, just 8 tall
            alignment: align,
            // align the port on the main Shape
            stretch: horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical,
            portId: name,
            // declare this object to be a "port"
            fromSpot: spot,
            // declare where links may connect at this port
            fromLinkable: output,
            // declare whether the user may draw links from here
            toSpot: spot,
            // declare where links may connect at this port
            toLinkable: input,
            // declare whether the user may draw links to here
            cursor: 'pointer',
            // show a different cursor to indicate potential link point
            mouseEnter: function (e, port) {
                // the PORT argument will be this Shape
                if (!e.diagram.isReadOnly) port.fill = 'rgba(255,0,255,0.5)';
            },
            mouseLeave: function (e, port) {
                port.fill = 'transparent';
            },
        });
    } // 意图组件

    diagram.nodeTemplateMap.add(
        'IntentComponent',
        $(
            go.Node,
            'Auto',
            nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true,
                shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: 'rgba(0, 0, 0, .14)',
                // selection adornment to match shape of nodes
                selectionAdornmentTemplate: $(
                    go.Adornment,
                    'Auto',
                    $(go.Shape, 'RoundedRectangle', roundedRectangleParams, {
                        fill: null,
                        stroke: '#7986cb',
                        strokeWidth: 3,
                    }),
                    $(go.Placeholder)
                ), // end Adornment
            },
            $(
                go.Shape,
                'RoundedRectangle', // 接点增强显示
                {
                    strokeWidth: 5,
                    stroke: 'white',
                    fill: 'white',
                },
                new go.Binding('stroke', 'status', nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(
                go.Shape,
                'RoundedRectangle',
                roundedRectangleParams,
                {
                    name: 'SHAPE',
                    fill: '#ffffff',
                    strokeWidth: 0,
                }, // bluish if highlighted, white otherwise
                new go.Binding('fill', 'isHighlighted', function (h) {
                    return h ? '#e8eaf6' : '#ffffff';
                }).ofObject()
            ),
            $(
                go.Panel,
                'Vertical',
                $(
                    go.Panel,
                    'Horizontal',
                    {
                        alignment: go.Spot.Left,
                    },
                    $(
                        go.Picture, // flag image, only visible if a nation is specified
                        {
                            margin: mr8,
                            visible: false,
                            desiredSize: new go.Size(45, 45),
                        },
                        new go.Binding('source', 'icon', theIconFlagConverter),
                        new go.Binding('visible', 'icon', function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(
                        go.TextBlock,
                        {
                            name: 'TB',
                            textAlign: 'left',
                            font: '12pt helvetica, arial, sans-serif',
                            stroke: '#A3A9AE',
                            editable: false,
                        },
                        new go.Binding('text', 'title')
                    ),
                    $(
                        'Button',
                        {
                            visible: false,
                            alignment: go.Spot.Right,
                            //alignmentFocus: go.Spot.Right,
                            click: function (e, obj) {
                                // 删除该接点
                                var node = obj.part;

                                if (node !== null) {
                                    diagram.startTransaction('remove dept');
                                    diagram.remove(node);
                                    diagram.commitTransaction('remove dept');
                                }
                            }, // 定义装饰中此按钮的单击行为
                        },
                        $(
                            go.Picture, // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: './icon/close.png',
                            }
                        )
                    )
                ),
                $(
                    go.Shape,
                    'LineH',
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: 'rgba(0, 0, 0, .60)',
                        strokeWidth: 1,
                        height: 1,
                        stretch: go.GraphObject.Horizontal,
                    },
                    new go.Binding('visible').ofObject('INFO') // only visible when info is expanded
                ),
                $(
                    go.TextBlock,
                    textStyle('script'),
                    {
                        textAlign: 'center',
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Center, //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding('text', 'script').makeTwoWay()
                ),
                $(
                    go.Panel,
                    'Horizontal',
                    {
                        alignment: go.Spot.Bottom,
                        margin: new go.Margin(10, 0, 0, 0),
                    },
                    $(go.Panel, 'Horizontal', new go.Binding('itemArray', 'intentionArray'), {
                        itemTemplate: $(
                            go.Panel,
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
                                cursor: 'pointer',
                                mouseEnter: function (e, port) {
                                    // the PORT argument will be this Shape
                                    port.fill = 'rgba(255,0,255,0.5)';
                                },
                                mouseLeave: function (e, port) {
                                    port.fill = 'transparent';
                                },
                            },
                            new go.Binding('portId', 'text'),
                            $(
                                go.Panel,
                                'Auto',
                                $(go.Shape, 'Rectangle', {
                                    fill: '#FFFFFF',
                                    stroke: '#DCEAFC',
                                }),
                                $(
                                    go.TextBlock,
                                    {
                                        margin: 5,
                                        stroke: '#1883D7',
                                        font: '15px sans-serif',
                                        mouseEnter: function (e, port) {
                                            // the PORT argument will be this Shape
                                            port.stroke = '#F883D7';
                                        },
                                        mouseLeave: function (e, port) {
                                            port.stroke = '#1883D7';
                                        },
                                    },
                                    new go.Binding('text', 'text')
                                )
                            )
                        ),
                    })
                )
            ),
            makePort('T', go.Spot.Top, go.Spot.TopSide, false, true)
        )
    );

    function showIntentList(keyFlagValue) {
        return [
            {
                visible: false, // only show textblocks when there is corresponding data for them
            },
            new go.Binding('visible', 'keyFlag', function (val) {
                return val == keyFlagValue;
            }),
        ];
    } // 按键组件

    diagram.nodeTemplateMap.add(
        'KeyComponent',
        $(
            go.Node,
            'Auto',
            nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true,
                shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: 'rgba(0, 0, 0, .14)',
                // selection adornment to match shape of nodes
                selectionAdornmentTemplate: $(
                    go.Adornment,
                    'Auto',
                    $(go.Shape, 'RoundedRectangle', roundedRectangleParams, {
                        fill: null,
                        stroke: '#7986cb',
                        strokeWidth: 3,
                    }),
                    $(go.Placeholder)
                ), // end Adornment
            },
            $(
                go.Shape,
                'RoundedRectangle', // 接点增强显示
                {
                    strokeWidth: 5,
                    stroke: 'white',
                    fill: 'white',
                },
                new go.Binding('stroke', 'status', nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(
                go.Shape,
                'RoundedRectangle',
                roundedRectangleParams,
                {
                    name: 'SHAPE',
                    fill: '#ffffff',
                    strokeWidth: 0,
                }, // bluish if highlighted, white otherwise
                new go.Binding('fill', 'isHighlighted', function (h) {
                    return h ? '#e8eaf6' : '#ffffff';
                }).ofObject()
            ),
            $(
                go.Panel,
                'Vertical',
                $(
                    go.Panel,
                    'Horizontal',
                    {
                        alignment: go.Spot.Left,
                    },
                    $(
                        go.Picture, // flag image, only visible if a nation is specified
                        {
                            margin: mr8,
                            visible: false,
                            desiredSize: new go.Size(45, 45),
                        },
                        new go.Binding('source', 'icon', theIconFlagConverter),
                        new go.Binding('visible', 'icon', function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(
                        go.TextBlock,
                        {
                            name: 'TB',
                            textAlign: 'left',
                            font: '12pt helvetica, arial, sans-serif',
                            stroke: '#A3A9AE',
                            editable: false,
                        },
                        new go.Binding('text', 'title')
                    ),
                    $(
                        'Button',
                        {
                            visible: false,
                            alignment: go.Spot.Right,
                            //alignmentFocus: go.Spot.Right,
                            click: function (e, obj) {
                                // 删除该接点
                                var node = obj.part;

                                if (node !== null) {
                                    diagram.startTransaction('remove dept');
                                    diagram.remove(node);
                                    diagram.commitTransaction('remove dept');
                                }
                            }, // 定义装饰中此按钮的单击行为
                        },
                        $(
                            go.Picture, // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: './icon/close.png',
                            }
                        )
                    )
                ),
                $(
                    go.Shape,
                    'LineH',
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: 'rgba(0, 0, 0, .60)',
                        strokeWidth: 1,
                        height: 1,
                        stretch: go.GraphObject.Horizontal,
                    },
                    new go.Binding('visible').ofObject('INFO') // only visible when info is expanded
                ),
                $(
                    go.TextBlock,
                    textStyle('script'),
                    {
                        textAlign: 'center',
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Center, //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding('text', 'script').makeTwoWay()
                ),
                $(
                    go.Panel,
                    'Horizontal',
                    {
                        alignment: go.Spot.Bottom,
                        margin: new go.Margin(10, 0, 0, 0),
                    },
                    $(
                        go.Panel,
                        'Horizontal',
                        showIntentList('PressKey'),
                        new go.Binding('itemArray', 'pressKeyArray'),
                        {
                            itemTemplate: $(
                                go.Panel,
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
                                    cursor: 'pointer',
                                    mouseEnter: function (e, port) {
                                        // the PORT argument will be this Shape
                                        port.fill = 'rgba(255,0,255,0.5)';
                                    },
                                    mouseLeave: function (e, port) {
                                        port.fill = 'transparent';
                                    },
                                },
                                new go.Binding('portId', 'key'),
                                $(
                                    go.Panel,
                                    'Auto',
                                    $(go.Shape, 'Rectangle', {
                                        //fill: '#DCEAFC',
                                        //stroke: null,
                                        fill: '#FFFFFF',
                                        stroke: '#DCEAFC',
                                    }),
                                    $(
                                        go.TextBlock,
                                        {
                                            margin: 5,
                                            stroke: '#1883D7',
                                            font: '15px sans-serif',
                                            mouseEnter: function (e, port) {
                                                // the PORT argument will be this Shape
                                                port.stroke = '#F883D7';
                                            },
                                            mouseLeave: function (e, port) {
                                                port.stroke = '#1883D7';
                                            },
                                        },
                                        new go.Binding('text', 'key')
                                    )
                                )
                            ),
                        }
                    ),
                    $(
                        go.Panel,
                        'Horizontal',
                        showIntentList('ReceiveNumber'),
                        new go.Binding('itemArray', 'receiveNumberDefaultArray'),
                        {
                            itemTemplate: $(
                                go.Panel,
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
                                    cursor: 'pointer',
                                    mouseEnter: function (e, port) {
                                        // the PORT argument will be this Shape
                                        port.fill = 'rgba(255,0,255,0.5)';
                                    },
                                    mouseLeave: function (e, port) {
                                        port.fill = 'transparent';
                                    },
                                },
                                new go.Binding('portId', 'intent'),
                                $(
                                    go.Panel,
                                    'Auto',
                                    $(go.Shape, 'Rectangle', {
                                        //fill: '#DCEAFC',
                                        //stroke: null,
                                        fill: '#FFFFFF',
                                        stroke: '#DCEAFC',
                                    }),
                                    $(
                                        go.TextBlock,
                                        {
                                            margin: 5,
                                            stroke: '#1883D7',
                                            font: '15px sans-serif',
                                            mouseEnter: function (e, port) {
                                                // the PORT argument will be this Shape
                                                port.stroke = '#F883D7';
                                            },
                                            mouseLeave: function (e, port) {
                                                port.stroke = '#1883D7';
                                            },
                                        },
                                        new go.Binding('text', 'intent')
                                    )
                                )
                            ),
                        }
                    )
                ) //                        )
            ),
            makePort('T', go.Spot.Top, go.Spot.TopSide, false, true)
        )
    ); // 条件组件

    diagram.nodeTemplateMap.add(
        'ConditionComponent',
        $(
            go.Node,
            'Auto',
            nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true,
                shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: 'rgba(0, 0, 0, .14)',
                // selection adornment to match shape of nodes
                selectionAdornmentTemplate: $(
                    go.Adornment,
                    'Auto',
                    $(go.Shape, 'RoundedRectangle', roundedRectangleParams, {
                        fill: null,
                        stroke: '#7986cb',
                        strokeWidth: 3,
                    }),
                    $(go.Placeholder)
                ), // end Adornment
            },
            $(
                go.Shape,
                'RoundedRectangle', // 接点增强显示
                {
                    strokeWidth: 5,
                    stroke: 'white',
                    fill: 'white',
                },
                new go.Binding('stroke', 'status', nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(
                go.Shape,
                'RoundedRectangle',
                roundedRectangleParams,
                {
                    name: 'SHAPE',
                    fill: '#ffffff',
                    strokeWidth: 0,
                }, // bluish if highlighted, white otherwise
                new go.Binding('fill', 'isHighlighted', function (h) {
                    return h ? '#e8eaf6' : '#ffffff';
                }).ofObject()
            ),
            $(
                go.Panel,
                'Vertical',
                $(
                    go.Panel,
                    'Horizontal',
                    {
                        alignment: go.Spot.Left,
                    },
                    $(
                        go.Picture, // flag image, only visible if a nation is specified
                        {
                            margin: mr8,
                            visible: false,
                            desiredSize: new go.Size(45, 45),
                        },
                        new go.Binding('source', 'icon', theIconFlagConverter),
                        new go.Binding('visible', 'icon', function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(
                        go.TextBlock,
                        {
                            name: 'TB',
                            textAlign: 'left',
                            font: '12pt helvetica, arial, sans-serif',
                            stroke: '#A3A9AE',
                            editable: false,
                        },
                        new go.Binding('text', 'title')
                    ),
                    $(
                        'Button',
                        {
                            visible: false,
                            alignment: go.Spot.Right,
                            //alignmentFocus: go.Spot.Right,
                            click: function (e, obj) {
                                // 删除该接点
                                var node = obj.part;

                                if (node !== null) {
                                    diagram.startTransaction('remove dept');
                                    diagram.remove(node);
                                    diagram.commitTransaction('remove dept');
                                }
                            }, // 定义装饰中此按钮的单击行为
                        },
                        $(
                            go.Picture, // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: './icon/close.png',
                            }
                        )
                    )
                ),
                $(
                    go.Shape,
                    'LineH',
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: 'rgba(0, 0, 0, .60)',
                        strokeWidth: 1,
                        height: 1,
                        stretch: go.GraphObject.Horizontal,
                    },
                    new go.Binding('visible').ofObject('INFO') // only visible when info is expanded
                ),
                $(
                    go.Panel,
                    'Horizontal',
                    {
                        alignment: go.Spot.Bottom,
                        margin: new go.Margin(10, 0, 0, 0),
                    },
                    $(go.Panel, 'Horizontal', new go.Binding('itemArray', 'conditionArray'), {
                        itemTemplate: $(
                            go.Panel,
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
                                cursor: 'pointer',
                                mouseEnter: function (e, port) {
                                    // the PORT argument will be this Shape
                                    port.fill = 'rgba(255,0,255,0.5)';
                                },
                                mouseLeave: function (e, port) {
                                    port.fill = 'transparent';
                                },
                            },
                            new go.Binding('portId', 'describe'),
                            $(
                                go.Panel,
                                'Auto',
                                $(go.Shape, 'Rectangle', {
                                    //fill: '#DCEAFC',
                                    //stroke: null,
                                    fill: '#FFFFFF',
                                    stroke: '#DCEAFC',
                                }),
                                $(
                                    go.TextBlock,
                                    {
                                        margin: 5,
                                        stroke: '#1883D7',
                                        font: '15px sans-serif',
                                        mouseEnter: function (e, port) {
                                            // the PORT argument will be this Shape
                                            port.stroke = '#F883D7';
                                        },
                                        mouseLeave: function (e, port) {
                                            port.stroke = '#1883D7';
                                        },
                                    },
                                    new go.Binding('text', 'describe')
                                )
                            )
                        ),
                    })
                )
            ),
            makePort('T', go.Spot.Top, go.Spot.TopSide, false, true)
        )
    ); // 接口组件

    diagram.nodeTemplateMap.add(
        'InterfaceComponent',
        $(
            go.Node,
            'Auto',
            nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true,
                shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: 'rgba(0, 0, 0, .14)',
                // selection adornment to match shape of nodes
                selectionAdornmentTemplate: $(
                    go.Adornment,
                    'Auto',
                    $(go.Shape, 'RoundedRectangle', roundedRectangleParams, {
                        fill: null,
                        stroke: '#7986cb',
                        strokeWidth: 3,
                    }),
                    $(go.Placeholder)
                ), // end Adornment
            },
            $(
                go.Shape,
                'RoundedRectangle', // 接点增强显示
                {
                    strokeWidth: 5,
                    stroke: 'white',
                    fill: 'white',
                },
                new go.Binding('stroke', 'status', nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(
                go.Shape,
                'RoundedRectangle',
                roundedRectangleParams,
                {
                    name: 'SHAPE',
                    fill: '#ffffff',
                    strokeWidth: 0,
                }, // bluish if highlighted, white otherwise
                new go.Binding('fill', 'isHighlighted', function (h) {
                    return h ? '#e8eaf6' : '#ffffff';
                }).ofObject()
            ),
            $(
                go.Panel,
                'Vertical',
                $(
                    go.Panel,
                    'Horizontal',
                    {
                        alignment: go.Spot.Left,
                    },
                    $(
                        go.Picture, // flag image, only visible if a nation is specified
                        {
                            margin: mr8,
                            visible: false,
                            desiredSize: new go.Size(45, 45),
                        },
                        new go.Binding('source', 'icon', theIconFlagConverter),
                        new go.Binding('visible', 'icon', function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(
                        go.TextBlock,
                        {
                            name: 'TB',
                            textAlign: 'left',
                            font: '12pt helvetica, arial, sans-serif',
                            stroke: '#A3A9AE',
                            editable: false,
                        },
                        new go.Binding('text', 'title')
                    ),
                    $(
                        'Button',
                        {
                            visible: false,
                            alignment: go.Spot.Right,
                            //alignmentFocus: go.Spot.Right,
                            click: function (e, obj) {
                                // 删除该接点
                                var node = obj.part;

                                if (node !== null) {
                                    diagram.startTransaction('remove dept');
                                    diagram.remove(node);
                                    diagram.commitTransaction('remove dept');
                                }
                            }, // 定义装饰中此按钮的单击行为
                        },
                        $(
                            go.Picture, // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: './icon/close.png',
                            }
                        )
                    )
                ),
                $(
                    go.Shape,
                    'LineH',
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: 'rgba(0, 0, 0, .60)',
                        strokeWidth: 1,
                        height: 1,
                        stretch: go.GraphObject.Horizontal,
                    },
                    new go.Binding('visible').ofObject('INFO') // only visible when info is expanded
                ),
                $(
                    go.TextBlock,
                    {
                        font: '15px Roboto, sans-serif',
                        stroke: 'rgba(0, 0, 0, .60)',
                        textAlign: 'left',
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Left, //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding('text', 'interfaceInfo', function (obj) {
                        if (obj == null || obj == undefined || obj.name == undefined) {
                            return '请先编辑组件';
                        } else {
                            return '调用' + obj.name + '接口';
                        }
                    })
                )
            ),
            makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
            makePortOut('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    ); // 转人工组件

    diagram.nodeTemplateMap.add(
        'TransferManualServiceComponent',
        $(
            go.Node,
            'Auto',
            nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true,
                shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: 'rgba(0, 0, 0, .14)',
                // selection adornment to match shape of nodes
                selectionAdornmentTemplate: $(
                    go.Adornment,
                    'Auto',
                    $(go.Shape, 'RoundedRectangle', roundedRectangleParams, {
                        fill: null,
                        stroke: '#7986cb',
                        strokeWidth: 3,
                    }),
                    $(go.Placeholder)
                ), // end Adornment
            },
            $(
                go.Shape,
                'RoundedRectangle', // 接点增强显示
                {
                    strokeWidth: 5,
                    stroke: 'white',
                    fill: 'white',
                },
                new go.Binding('stroke', 'status', nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(
                go.Shape,
                'RoundedRectangle',
                roundedRectangleParams,
                {
                    name: 'SHAPE',
                    fill: '#ffffff',
                    strokeWidth: 0,
                }, // bluish if highlighted, white otherwise
                new go.Binding('fill', 'isHighlighted', function (h) {
                    return h ? '#e8eaf6' : '#ffffff';
                }).ofObject()
            ),
            $(
                go.Panel,
                'Vertical',
                $(
                    go.Panel,
                    'Horizontal',
                    {
                        alignment: go.Spot.Left,
                    },
                    $(
                        go.Picture, // flag image, only visible if a nation is specified
                        {
                            margin: mr8,
                            visible: false,
                            desiredSize: new go.Size(45, 45),
                        },
                        new go.Binding('source', 'icon', theIconFlagConverter),
                        new go.Binding('visible', 'icon', function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(
                        go.TextBlock,
                        {
                            name: 'TB',
                            textAlign: 'left',
                            font: '12pt helvetica, arial, sans-serif',
                            stroke: '#A3A9AE',
                            editable: false,
                        },
                        new go.Binding('text', 'title')
                    ),
                    $(
                        'Button',
                        {
                            visible: false,
                            alignment: go.Spot.Right,
                            //alignmentFocus: go.Spot.Right,
                            click: function (e, obj) {
                                // 删除该接点
                                var node = obj.part;

                                if (node !== null) {
                                    diagram.startTransaction('remove dept');
                                    diagram.remove(node);
                                    diagram.commitTransaction('remove dept');
                                }
                            }, // 定义装饰中此按钮的单击行为
                        },
                        $(
                            go.Picture, // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: './icon/close.png',
                            }
                        )
                    )
                ),
                $(
                    go.Shape,
                    'LineH',
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: 'rgba(0, 0, 0, .60)',
                        strokeWidth: 1,
                        height: 1,
                        stretch: go.GraphObject.Horizontal,
                    },
                    new go.Binding('visible').ofObject('INFO') // only visible when info is expanded
                ),
                $(
                    go.TextBlock,
                    {
                        font: '15px Roboto, sans-serif',
                        stroke: 'rgba(0, 0, 0, .60)',
                        textAlign: 'left',
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Left, //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding('text', 'phoneNumber', function (str) {
                        if (str == null || str == undefined || str.length <= 0) {
                            return '请先编辑组件';
                        } else {
                            return '转号码：' + str;
                        }
                    })
                )
            ),
            makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
            makePortOut('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    ); // 信息收集组件

    diagram.nodeTemplateMap.add(
        'InfoCollectionComponent',
        $(
            go.Node,
            'Auto',
            nodeStyle(),
            {
                locationSpot: go.Spot.Top,
                isShadowed: true,
                shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: 'rgba(0, 0, 0, .14)',
                // selection adornment to match shape of nodes
                selectionAdornmentTemplate: $(
                    go.Adornment,
                    'Auto',
                    $(go.Shape, 'RoundedRectangle', roundedRectangleParams, {
                        fill: null,
                        stroke: '#7986cb',
                        strokeWidth: 3,
                    }),
                    $(go.Placeholder)
                ), // end Adornment
            },
            $(
                go.Shape,
                'RoundedRectangle', // 接点增强显示
                {
                    strokeWidth: 5,
                    stroke: 'white',
                    fill: 'white',
                },
                new go.Binding('stroke', 'status', nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(
                go.Shape,
                'RoundedRectangle',
                roundedRectangleParams,
                {
                    name: 'SHAPE',
                    fill: '#ffffff',
                    strokeWidth: 0,
                }, // bluish if highlighted, white otherwise
                new go.Binding('fill', 'isHighlighted', function (h) {
                    return h ? '#e8eaf6' : '#ffffff';
                }).ofObject()
            ),
            $(
                go.Panel,
                'Vertical',
                $(
                    go.Panel,
                    'Horizontal',
                    {
                        alignment: go.Spot.Left,
                    },
                    $(
                        go.Picture, // flag image, only visible if a nation is specified
                        {
                            margin: mr8,
                            visible: false,
                            desiredSize: new go.Size(45, 45),
                        },
                        new go.Binding('source', 'icon', theIconFlagConverter),
                        new go.Binding('visible', 'icon', function (nat) {
                            return nat !== undefined;
                        })
                    ),
                    $(
                        go.TextBlock,
                        {
                            name: 'TB',
                            textAlign: 'left',
                            font: '12pt helvetica, arial, sans-serif',
                            stroke: '#A3A9AE',
                            editable: false,
                        },
                        new go.Binding('text', 'title')
                    ),
                    $(
                        'Button',
                        {
                            visible: false,
                            alignment: go.Spot.Right,
                            //alignmentFocus: go.Spot.Right,
                            click: function (e, obj) {
                                // 删除该接点
                                var node = obj.part;

                                if (node !== null) {
                                    diagram.startTransaction('remove dept');
                                    diagram.remove(node);
                                    diagram.commitTransaction('remove dept');
                                }
                            }, // 定义装饰中此按钮的单击行为
                        },
                        $(
                            go.Picture, // flag image, only visible if a nation is specified
                            {
                                margin: 0,
                                visible: true,
                                desiredSize: new go.Size(24, 24),
                                source: './icon/close.png',
                            }
                        )
                    )
                ),
                $(
                    go.Shape,
                    'LineH',
                    {
                        margin: 0,
                        minSize: new go.Size(lineMinWidth, NaN),
                        stroke: 'rgba(0, 0, 0, .60)',
                        strokeWidth: 1,
                        height: 1,
                        stretch: go.GraphObject.Horizontal,
                    },
                    new go.Binding('visible').ofObject('INFO') // only visible when info is expanded
                ),
                $(
                    go.TextBlock,
                    {
                        font: '15px Roboto, sans-serif',
                        stroke: 'rgba(0, 0, 0, .60)',
                        textAlign: 'left',
                        margin: new go.Margin(30, 30, 10, 30),
                        maxSize: new go.Size(240, NaN),
                        editable: false,
                        visible: true,
                        alignment: go.Spot.Left, //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding('text', 'script', function (str) {
                        if (str == null || str == undefined || str.length <= 0) {
                            return '请先编辑组件';
                        } else {
                            return '话术：' + str;
                        }
                    })
                ),
                $(
                    go.TextBlock,
                    {
                        font: '15px Roboto, sans-serif',
                        stroke: 'rgba(0, 0, 0, .60)',
                        textAlign: 'left',
                        margin: new go.Margin(10, 30, 10, 30),
                        maxSize: new go.Size(200, NaN),
                        visible: true,
                        editable: false,
                        alignment: go.Spot.Left, //maxSize: new go.Size(1000, NaN)
                    },
                    new go.Binding('text', 'variableName', function (str) {
                        if (str == null || str == undefined || str.length <= 0) {
                            return '';
                        } else {
                            return '变量名：' + str;
                        }
                    }),
                    new go.Binding('visible', 'script', function (str) {
                        if (str == null || str == undefined || str.length <= 0) {
                            return false;
                        } else {
                            return true;
                        }
                    })
                )
            ),
            makePort('T', go.Spot.Top, go.Spot.TopSide, false, true),
            makePortOut('B', go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
    ); // 结束组件

    diagram.nodeTemplateMap.add(
        'EndComponent',
        $(
            go.Node,
            'Auto',
            nodeStyle(),
            {
                maxSize: new go.Size(100, 50),
                locationSpot: go.Spot.Top,
                isShadowed: true,
                shadowBlur: 1,
                shadowOffset: new go.Point(0, 1),
                shadowColor: 'rgba(0, 0, 0, .14)',
                // selection adornment to match shape of nodes
                selectionAdornmentTemplate: $(
                    go.Adornment,
                    'Auto',
                    $(go.Shape, 'RoundedRectangle', roundedRectangleParams, {
                        fill: null,
                        stroke: '#7986cb',
                        strokeWidth: 3,
                    }),
                    $(go.Placeholder)
                ), // end Adornment
            },
            $(
                go.Shape,
                'RoundedRectangle', // 边框
                {
                    strokeWidth: 2,
                    stroke: '#DEDEDE',
                    fill: 'white',
                }
            ),
            $(
                go.Shape,
                'RoundedRectangle', // 接点增强显示
                {
                    strokeWidth: 5,
                    stroke: 'white',
                    fill: 'white',
                },
                new go.Binding('stroke', 'status', nodeStatusConverter),
                new go.AnimationTrigger('stroke')
            ),
            $(
                go.TextBlock,
                {
                    font: '15px Roboto, sans-serif',
                    stroke: 'rgba(0, 0, 0, .60)',
                    textAlign: 'center',
                    margin: new go.Margin(0, 0, 0, 0),
                    visible: true,
                    editable: false,
                    alignment: go.Spot.Center,
                },
                new go.Binding('text', 'name')
            ),
            makePort('T', go.Spot.Top, go.Spot.TopSide, false, true)
        )
    );
    var linkSelectionAdornmentTemplate = $(
        go.Adornment,
        'Link',
        $(go.Shape, {
            isPanelMain: true,
            fill: null,
            stroke: 'red',
            strokeWidth: 0,
        }) // 使用选择对象的strokeWidth
    );

    function linkStatusConverter(s) {
        if (s == 1) return '#FF9191';
        return 'transparent';
    } // replace the default Link template in the linkTemplateMap

    diagram.linkTemplate = $(
        go.Link, // the whole link panel
        {
            selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
            routing: go.Link.AvoidsNodes,
            //                        routing: go.Link.Orthogonal,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            mouseEnter: function (e, link) {
                link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)';
            },
            mouseLeave: function (e, link) {
                link.findObject('HIGHLIGHT').stroke = 'transparent';
            },
            selectionAdorned: false,
        },
        new go.Binding('points').makeTwoWay(),
        $(
            go.Shape, // the highlight shape, normally transparent 链接线的背景区域，通常是透明的
            {
                isPanelMain: true,
                strokeWidth: 5,
                stroke: 'transparent',
                name: 'HIGHLIGHT',
            },
            new go.Binding('stroke', 'status', linkStatusConverter), // 连线增强显示
            new go.AnimationTrigger('stroke')
        ),
        $(
            go.Shape, // the link path shape 链接线的形状
            {
                isPanelMain: true,
                stroke: 'gray',
                strokeWidth: 2,
            },
            new go.Binding('stroke', 'isSelected', function (sel) {
                return sel ? 'dodgerblue' : 'gray';
            }).ofObject()
        ),
        $(
            go.Shape, // the arrowhead 箭头
            {
                toArrow: 'standard',
                strokeWidth: 0,
                fill: 'gray',
            }
        ),
        $(
            go.Panel,
            'Auto', // the link label, normally not visible 链接标签，通常不可见
            {
                visible: false,
                name: 'LABEL',
                segmentIndex: 2,
                segmentFraction: 0.5,
            },
            new go.Binding('visible', 'visible').makeTwoWay(),
            $(
                go.Shape,
                'RoundedRectangle', // the label shape
                {
                    fill: '#F8F8F8',
                    strokeWidth: 0,
                }
            ),
            $(
                go.TextBlock,
                'Yes', // the label
                {
                    textAlign: 'center',
                    font: '10pt helvetica, arial, sans-serif',
                    stroke: '#333333',
                    editable: true,
                },
                new go.Binding('text').makeTwoWay()
            )
        )
    ); // Make link labels visible if coming out of a "conditional" node.
    // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.

    function showLinkLabel(e) {
        var label = e.subject.findObject('LABEL');
        if (label !== null) label.visible = e.subject.fromNode.data.category === 'Conditional';
    } // temporary links used by LinkingTool and RelinkingTool are also orthogonal:

    diagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
    diagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal; // function convertIsTreeLink(r) {
    //     return r === "generalization";
    // }
    // function convertFromArrow(r) {
    //     switch (r) {
    //         case "generalization": return "";
    //         default: return "";
    //     }
    // }
    // function convertToArrow(r) {
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

    diagram.model = $(go.GraphLinksModel, {
        copiesArrays: false,
        copiesArrayObjects: false,
        nodeDataArray: nodedata,
        linkDataArray: linkdata,
        linkKeyProperty: 'key',
    });
    return diagram;
}

function initPalette() {
    var myPalette = $(go.Palette, {
        //用Gridlayout格子布局垂直排列每行数据
        contentAlignment: go.Spot.TopLeft,
        layout: $(go.GridLayout, {
            alignment: go.GridLayout.Left,
        }),
        isReadOnly: true,
        // 禁止编辑
        maxSelectionCount: 1,
        'animationManager.initialAnimationStyle': go.AnimationManager.None,
        InitialAnimationStarting: animateFadeDown,
    });
    myPalette.nodeTemplate = $(
        go.Node,
        'Horizontal',
        {
            locationObjectName: 'TB',
            locationSpot: go.Spot.Center,
        },
        $(
            go.Panel,
            'Horizontal',
            {
                alignment: go.Spot.Left,
            },
            $(
                go.Picture, // flag image, only visible if a nation is specified
                {
                    margin: mr8,
                    visible: false,
                    desiredSize: new go.Size(45, 45),
                },
                new go.Binding('source', 'icon', theIconFlagConverter),
                new go.Binding('visible', 'icon', function (nat) {
                    return nat !== undefined;
                })
            ),
            $(
                go.TextBlock,
                {
                    name: 'TB',
                    textAlign: 'left',
                    font: '12pt helvetica, arial, sans-serif',
                    stroke: '#A3A9AE',
                    editable: true,
                },
                new go.Binding('text', 'title')
            )
        )
    );
    return myPalette;
} // This is a re-implementation of the default animation, except it fades in from downwards, instead of upwards.

function animateFadeDown(e) {
    var diagram = e.diagram;
    var animation = new go.Animation();
    animation.isViewportUnconstrained = true; // So Diagram positioning rules let the animation start off-screen

    animation.easing = go.Animation.EaseOutExpo;
    animation.duration = 900; // Fade "down", in other words, fade in from above

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


const Robot: React.FC<AuthComponentProps> = (props) => {
    console.log('props:::', props)
    const myInspector = useRef(null);
    // const myInput = useRef(null);

    // const [title, setTitle] = useState('');
    let inspector: any;
    useEffect(() => {
        console.log('myInspector:::', myInspector);
        console.log('diagram:::', diagram);
        inspector = new Inspector(myInspector.current, diagram, {
            // By default the inspector works on the Diagram selection.
            // This property lets us inspect a specific object by calling Inspector.inspectObject.
            //                    multipleSelection: true,
            //                    showSize: 4,
            //                    showAllProperties: true,
            properties: {
                text: {},
                // This property we want to declare as a color, to show a color-picker:
                color: {
                    type: 'color',
                },
                // key would be automatically added for node data, but we want to declare it read-only also:
                key: {
                    readOnly: true,
                    show: Inspector.showIfPresent,
                },
            },
        });
        // let data = nodedata[0];
        inspector.inspectObject(diagram);
        // console.log('myInput::', myInput)
        // inspector.registerUpdateEvent(data.category, data, "title", myInput.current);
    }, []);

    // const handleChange = (e: any) => {
    //     setTitle(e.target.value);
    //     console.log(e.target.value);
    //     var data = nodedata[0];
    //     diagram.startTransaction('set all properties');
    //     diagram.model.setDataProperty(data, 'title', e.target.value);
    //     diagram.commitTransaction('set all properties');
    // };

    const saveBtn = (e: any) => {
        console.log('点击保存了！！！！');
        console.log(nodedata);
        console.log(linkdata);
        props.dispatch({
            type: 'test/update',
            payload: 777
        })
        console.log(props)
    };

    return (
        <div className="diagram-wrapper">
            <button onClick={saveBtn}>保存</button>
            <ReactPalette
                initPalette={initPalette}
                divClassName="palette-component"
                nodeDataArray={paletteNodeDataArray}
            />

            <div className="diagram-bottom">
                <ReactDiagram
                    initDiagram={initDiagram}
                    divClassName="diagram-component"
                    nodeDataArray={nodedata}
                    linkDataArray={linkdata}
                    onModelChange={handleModelChange}
                    skipsDiagramUpdate={true}
                />

                <div id="myInspectorId" ref={myInspector} className="inspector">

                    <div className="key-component-inspector">
                        {/* <p>title</p>
                        <input type="text" onChange={handleChange} ref={myInput} /> */}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default connect(({ test }) => ({ test }))(Robot);  

