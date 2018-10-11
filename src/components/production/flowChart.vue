/*
 * @Author: liucz 
 * @Date: 2018-08-24 16:09:30 
 * @Last Modified by: liucz
 * @Last Modified time: 2018-08-29 17:26:19
 */
<template>
  <section>
    <div id="sample">
      <div style="width: 100%; display: flex; justify-content: space-between">
        <div id="myPaletteDiv"
             style="width: 150px; margin-right: 2px; background-color: whitesmoke; border: solid 1px black"></div>
        <div id="myDiagramDiv"
             style="flex-grow: 1;border: solid 1px black"></div>
      </div>
    </div>
  </section>
</template>

<script>
// 引入gojs
// import go from 'gojs'

let $ = go.GraphObject.make;
let myDiagram = null;

export default {
  name: "flow-chart",
  data() {
    return {
      myDiagram: null,
      diagramData: {
        class: "go.GraphLinksModel",
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        modelData: { position: "28.0987529311069 98.09875293110693" },
       
        linkDataArray: [
          {
            from: -1,
            to: -2,
            fromPort: "",
            toPort: "",
            points: [
              106.90124706889306,
              140,
              116.90124706889306,
              140,
              121.00860693288402,
              140,
              121.00860693288402,
              140,
              125.115966796875,
              140,
              135.115966796875,
              140
            ]
          },
          {
            from: -2,
            to: -4,
            fromPort: "",
            toPort: "L",
            points: [
              184.884033203125,
              140,
              194.884033203125,
              140,
              205,
              140,
              205,
              140,
              215.115966796875,
              140,
              225.115966796875,
              140
            ]
          },
          {
            from: -4,
            to: -6,
            fromPort: "",
            toPort: "L",
            points: [
              274.884033203125,
              140,
              284.884033203125,
              140,
              295,
              140,
              295,
              140,
              305.115966796875,
              140,
              315.115966796875,
              140
            ]
          },
          {
            from: -6,
            to: -7,
            fromPort: "",
            toPort: "L",
            points: [
              364.884033203125,
              140,
              374.884033203125,
              140,
              375,
              140,
              375,
              140,
              375.115966796875,
              140,
              385.115966796875,
              140
            ]
          },
          {
            from: -7,
            to: -8,
            fromPort: "R",
            toPort: "L",
            points: [
              434.884033203125,
              140,
              444.884033203125,
              140,
              450,
              140,
              450,
              140,
              455.115966796875,
              140,
              465.115966796875,
              140
            ]
          },
          {
            from: -8,
            to: -9,
            fromPort: "",
            toPort: "L",
            points: [
              514.884033203125,
              140,
              524.884033203125,
              140,
              525,
              140,
              525,
              140,
              525.115966796875,
              140,
              535.115966796875,
              140
            ]
          },
          {
            from: -9,
            to: -10,
            fromPort: "",
            toPort: "",
            points: [
              584.884033203125,
              140,
              594.884033203125,
              140,
              595,
              140,
              595,
              140,
              595.115966796875,
              140,
              605.115966796875,
              140
            ]
          },
          {
            from: -10,
            to: -5,
            fromPort: "R",
            toPort: "L",
            points: [
              654.884033203125,
              140,
              664.884033203125,
              140,
              666.0670485829198,
              140,
              666.0670485829198,
              139.99999999999997,
              667.2500639627146,
              139.99999999999997,
              677.2500639627146,
              139.99999999999997
            ]
          }
        ]
      }
    };
  },
  mounted() {
    console.log(go);
    this.initPage();
  },
  methods: {
    initPage() {
      myDiagram = $(
        go.Diagram,
        "myDiagramDiv", // must name or refer to the DIV HTML element
        {
          grid: $(
            go.Panel,
            "Grid",
            $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
            $(go.Shape, "LineH", {
              stroke: "gray",
              strokeWidth: 0.5,
              interval: 10
            }),
            $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
            $(go.Shape, "LineV", {
              stroke: "gray",
              strokeWidth: 0.5,
              interval: 10
            })
          ),

          initialContentAlignment: go.Spot.Center,
          allowDrop: true, // must be true to accept drops from the Palette
          "draggingTool.dragsLink": true,
          "draggingTool.isGridSnapEnabled": true,
          "linkingTool.isUnconnectedLinkValid": true,
          "linkingTool.portGravity": 20,
          "relinkingTool.isUnconnectedLinkValid": true,
          "relinkingTool.portGravity": 20,
          LinkDrawn: showLinkLabel, // this DiagramEvent listener is defined below
          LinkRelinked: showLinkLabel,
          scrollsPageOnFocus: false,
          "undoManager.isEnabled": true // enable undo & redo
        }
      );
      function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null)
          label.visible = e.subject.fromNode.data.figure === "Diamond";
      }
      // when the document is modified, add a "*" to the title and enable the "Save" button
      myDiagram.addDiagramListener("Modified", function(e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });

      // helper definitions for node templates

      function nodeStyle() {
        return [
          // The Node.location comes from the "loc" property of the node data,
          // converted by the Point.parse static method.
          // If the Node.location is changed, it updates the "loc" property of the node data,
          // converting back using the Point.stringify static method.
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            // the Node.location is at the center of each node
            locationSpot: go.Spot.Center
          }
        ];
      }

      // Define a function for creating a "port" that is normally transparent.
      // The "name" is used as the GraphObject.portId,
      // the "align" is used to determine where to position the port relative to the body of the node,
      // the "spot" is used to control how links connect with the port and whether the port
      // stretches along the side of the node,
      // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
      function makePort(name, align, spot, output, input) {
        var horizontal =
          align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
        // the port is basically just a transparent rectangle that stretches along the side of the node,
        // and becomes colored when the mouse passes over it
        return $(go.Shape, {
          fill: "transparent", // changed to a color in the mouseEnter event handler
          strokeWidth: 0, // no stroke
          width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
          height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
          alignment: align, // align the port on the main Shape
          stretch: horizontal
            ? go.GraphObject.Horizontal
            : go.GraphObject.Vertical,
          portId: name, // declare this object to be a "port"
          fromSpot: spot, // declare where links may connect at this port
          fromLinkable: output, // declare whether the user may draw links from here
          toSpot: spot, // declare where links may connect at this port
          toLinkable: input, // declare whether the user may draw links to here
          cursor: "pointer", // show a different cursor to indicate potential link point
          mouseEnter: function(e, port) {
            // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
          },
          mouseLeave: function(e, port) {
            port.fill = "transparent";
          }
        });
      }

      function textStyle() {
        return {
          font: "bold 11pt Helvetica, Arial, sans-serif",
          stroke: "whitesmoke"
        };
      }

      // define the Node templates for regular nodes

      myDiagram.nodeTemplateMap.add(
        "", // the default category
        $(
          go.Node,
          "Table",
          nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(
            go.Panel,
            "Auto",
            $(
              go.Shape,
              "Rectangle",
              { fill: "#00A9C9", strokeWidth: 0 },
              new go.Binding("figure", "figure")
            ),
            $(
              go.TextBlock,
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay()
            )
          ),
          // four named ports, one on each side:
          makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
          makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
          makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
          makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Conditional",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(
            go.Panel,
            "Auto",
            $(
              go.Shape,
              "Diamond",
              { fill: "#00A9C9", strokeWidth: 0 },
              new go.Binding("figure", "figure")
            ),
            $(
              go.TextBlock,
              textStyle(),
              {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay()
            )
          ),
          // four named ports, one on each side:
          makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Start",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          $(
            go.Panel,
            "Auto",
            $(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "#79C900",
              strokeWidth: 0
            }),
            $(go.TextBlock, "Start", textStyle(), new go.Binding("text"))
          ),
          // three named ports, one on each side except the top, all output only:
          makePort("L", go.Spot.Left, go.Spot.Left, true, false),
          makePort("R", go.Spot.Right, go.Spot.Right, true, false),
          makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "End",
        $(
          go.Node,
          "Table",
          nodeStyle(),
          $(
            go.Panel,
            "Auto",
            $(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "#DC3C00",
              strokeWidth: 0
            }),
            $(go.TextBlock, "End", textStyle(), new go.Binding("text"))
          ),
          // three named ports, one on each side except the bottom, all input only:
          makePort("T", go.Spot.Top, go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, go.Spot.Left, false, true),
          makePort("R", go.Spot.Right, go.Spot.Right, false, true)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Comment",
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          $(go.Shape, "File", { fill: "#EFFAB4", strokeWidth: 0 }),
          $(
            go.TextBlock,
            textStyle(),
            {
              margin: 5,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
              font: "bold 12pt Helvetica, Arial, sans-serif",
              stroke: "#454545"
            },
            new go.Binding("text").makeTwoWay()
          )
          // no ports, because no links are allowed to connect with a comment
        )
      );

      // 替换linkTemplateMap中的默认链接模板
      myDiagram.linkTemplate = $(
        go.Link, // the whole link panel
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4,
          relinkableFrom: true,
          relinkableTo: true,
          reshapable: true,
          resegmentable: true,
          adjusting: go.Link.Stretch,
          // mouse-overs subtly highlight links:
          mouseEnter: function(e, link) {
            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
          },
          mouseLeave: function(e, link) {
            link.findObject("HIGHLIGHT").stroke = "transparent";
          }
        },
        new go.Binding("points").makeTwoWay(),
        $(
          go.Shape, // the highlight shape, normally transparent
          {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: "transparent",
            name: "HIGHLIGHT"
          }
        ),
        $(
          go.Shape, // the link path shape
          {
            isPanelMain: true,
            stroke: "rgb(67, 67, 67)",
            strokeWidth: 1
          }
        ),
        $(
          go.Shape, // the arrowhead
          {
            toArrow: "standard",
            stroke: null,
            fill: "rgb(67, 67, 67)"
          }
        ),
        $(
          go.Panel,
          "Auto", // the link label, normally not visible
          {
            visible: false,
            name: "LABEL",
            segmentIndex: 2,
            segmentFraction: 0.5
          },
          new go.Binding("visible", "visible").makeTwoWay(),
          $(
            go.Shape,
            "RoundedRectangle", // the label shape
            { fill: "rgb(101, 122, 151)", stroke: null }
          ),
          $(
            go.TextBlock,
            "是", // the label
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "rgb(255, 255, 255)",
              editable: true
            },
            new go.Binding("text").makeTwoWay()
          )
        )
      );

      // Make link labels visible if coming out of a "conditional" node.
      // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
      function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null)
          label.visible = e.subject.fromNode.data.figure === "Diamond";
      }

      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      myDiagram.toolManager.linkingTool.temporaryLink.routing =
        go.Link.Orthogonal;
      myDiagram.toolManager.relinkingTool.temporaryLink.routing =
        go.Link.Orthogonal;

      this.load(); // load an initial diagram from some JSON text

      // initialize the Palette that is on the left side of the page
      let myPalette = $(
        go.Palette,
        "myPaletteDiv", // must name or refer to the DIV HTML element
        {
          scrollsPageOnFocus: false,
          nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
          model: new go.GraphLinksModel([
            // specify the contents of the Palette
            { category: "Start", text: "开始" },
            { category: "Next", text: "下一步" },
            {
              category: "Judge",
              text: "逻辑判断",
              figure: "Diamond"
            },
            { category: "End", text: "结束" },
            { category: "Comment", text: "注释" }
          ])
        }
      );
    }, // end init
    // Show the diagram's model in JSON format that the user may edit
    save() {
      this.diagramData = myDiagram.model.toJson();
      myDiagram.isModified = false;
    },
    load() {
      myDiagram.model = go.Model.fromJson(this.diagramData);
    },
    // add an SVG rendering of the diagram at the end of this page
    makeSVG() {
      var svg = myDiagram.makeSvg({
        scale: 0.5
      });
      svg.style.border = "1px solid black";
      obj = document.getElementById("SVGArea");
      obj.appendChild(svg);
      if (obj.children.length > 0) {
        obj.replaceChild(svg, obj.children[0]);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#sample {
  position: relative;
  overflow-y: scroll;
  // height: 2000px;
}
#myDiagramDiv {
  min-height: 300px;
}
</style>