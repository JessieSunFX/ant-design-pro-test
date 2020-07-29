import React from "react";

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

import './style.less';  // contains .diagram-component CSS

// setup a few example class nodes and relationships
let nodedata = [
    {
        key: 1,
        name: "BankAccount",
        properties: [
            { name: "owner", type: "String", visibility: "public" },
            { name: "balance", type: "Currency", visibility: "public", default: "0" }
        ],
        methods: [
            { name: "deposit", parameters: [{ name: "amount", type: "Currency" }], visibility: "public" },
            { name: "withdraw", parameters: [{ name: "amount", type: "Currency" }], visibility: "public" }
        ]
    },
    {
        key: 11,
        name: "Person",
        properties: [
            { name: "name", type: "String", visibility: "public" },
            { name: "birth", type: "Date", visibility: "protected" }
        ],
        methods: [
            { name: "getCurrentAge", type: "int", visibility: "public" }
        ]
    },
    {
        key: 12,
        name: "Student",
        properties: [
            { name: "classes", type: "List<Course>", visibility: "public" }
        ],
        methods: [
            { name: "attend", parameters: [{ name: "class", type: "Course" }], visibility: "private" },
            { name: "sleep", visibility: "private" }
        ]
    },
    {
        key: 13,
        name: "Professor",
        properties: [
            { name: "classes", type: "List<Course>", visibility: "public" }
        ],
        methods: [
            { name: "teach", parameters: [{ name: "class", type: "Course" }], visibility: "private" }
        ]
    },
    {
        key: 14,
        name: "Course",
        properties: [
            { name: "name", type: "String", visibility: "public" },
            { name: "description", type: "String", visibility: "public" },
            { name: "professor", type: "Professor", visibility: "public" },
            { name: "location", type: "String", visibility: "public" },
            { name: "times", type: "List<Time>", visibility: "public" },
            { name: "prerequisites", type: "List<Course>", visibility: "public" },
            { name: "students", type: "List<Student>", visibility: "public" }
        ]
    }
];
let linkdata = [
    { from: 12, to: 11, relationship: "generalization" },
    { from: 13, to: 11, relationship: "generalization" },
    { from: 14, to: 13, relationship: "aggregation" }
];

/**
 * This function is responsible for setting up the diagram's initial properties and any templates.
 */
function initDiagram() {
    const $ = go.GraphObject.make;
    const diagram =
        $(go.Diagram,
            {
                "undoManager.isEnabled": true,
                layout: $(go.TreeLayout,
                    { // this only lays out in trees nodes connected by "generalization" links
                        angle: 90,
                        path: go.TreeLayout.PathSource,  // links go from child to parent
                        setsPortSpot: false,  // keep Spot.AllSides for link connection spot
                        setsChildPortSpot: false,  // keep Spot.AllSides
                        // nodes not connected by "generalization" links are laid out horizontally
                        arrangement: go.TreeLayout.ArrangementHorizontal
                    })
            });

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
    function convertIsTreeLink(r: any) {
        return r === "generalization";
    }
    function convertFromArrow(r: any) {
        switch (r) {
            case "generalization": return "";
            default: return "";
        }
    }
    function convertToArrow(r: any) {
        switch (r) {
            case "generalization": return "Triangle";
            case "aggregation": return "StretchedDiamond";
            default: return "";
        }
    }
    diagram.linkTemplate =
        $(go.Link,
            { routing: go.Link.Orthogonal },
            new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
            $(go.Shape),
            $(go.Shape, { scale: 1.3, fill: "white" },
                new go.Binding("fromArrow", "relationship", convertFromArrow)),
            $(go.Shape, { scale: 1.3, fill: "white" },
                new go.Binding("toArrow", "relationship", convertToArrow))
        );

    diagram.model = $(go.GraphLinksModel,
        {
            copiesArrays: false,
            copiesArrayObjects: false,
            nodeDataArray: nodedata,
            linkDataArray: linkdata
        });

    return diagram;
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

    return (
        <div>
            <ReactDiagram
                initDiagram={initDiagram}
                divClassName='diagram-component'
                nodeDataArray={nodedata}
                linkDataArray={linkdata}
                onModelChange={handleModelChange}
                skipsDiagramUpdate={true}
            />
        </div>
    );
};

export default Robot