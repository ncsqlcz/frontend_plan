<template>
  <div id="wrap">
    <div id="chart-wrap"
         style="width: 100%; display: flex; justify-content: space-between">
      <div id="chart-palette"
           style="width: 200px; margin-right: 2px; background-color: whitesmoke; border: solid 1px black"></div>
      <div id="chart-diagram"
           style="flex-grow: 1;min-height: 300px; border: solid 1px black"></div>
    </div>
    <el-dialog title="添加基本信息"
               width="300px"
               :visible.sync="dialogVisible"
               class="detailDialog">
      <el-form :model="form">
        <el-form-item label="负责人"
                      :label-width="formLabelWidth">
          <el-input v-model="form.name"
                    auto-complete="off"
                    class="input-size"></el-input>
        </el-form-item>
        <el-form-item label="排产量"
                      :label-width="formLabelWidth">
          <el-input v-model="form.dec"
                    auto-complete="off"
                    class="input-size"></el-input>
        </el-form-item>
        <el-form-item label="估计工时"
                      :label-width="formLabelWidth">
          <el-input v-model="form.time"
                    auto-complete="off"
                    class="input-size"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="onSubmit"
                   size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import go from 'gojs'
import { gojsUrl } from "@/api/cdn.js";

export default {
  name: "processFlowChart",
  data() {
    return {
      gojsLoaded: false,
      dialogVisible: false,
      nowTagKey: null,
      form: {
        name: "",
        dec: "",
        time: ""
      },
      formLabelWidth: "120px",
      chartData: {
        class: "go.GraphLinksModel",
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        nodeDataArray: [
          { category: "Start", text: "开始", key: -1, loc: "-610 -120" },
          { category: "Next", text: "A", key: -2, loc: "-470 -120" },
          { category: "Next", text: "B", key: -5, loc: "-290 -190" },
          { category: "Next", text: "C", key: -6, loc: "-290 20" },
          { category: "Next", text: "D", key: -7, loc: "-150 -190" },
          { category: "Next", text: "F", key: -8, loc: "-150 20" },
          { category: "End", text: "结束", key: -4, loc: "50 -120" },
        ],
        linkDataArray: [
          { from: -1, to: -2, points: [] },
          { from: -2, to: -6, fromPort: "B", toPort: "L", points: []},
          { from: -2, to: -5,  fromPort: "T", toPort: "L", points: []},
          { from: -5, to: -7, fromPort: "R", toPort: "L", points: [] },
          { from: -6, to: -8, fromPort: "R", toPort: "L", points: [] },
          { from: -7, to: -4, fromPort: "R", toPort: "L", points: [] },
          { from: -8, to: -4, fromPort: "R", toPort: "L", points: [] }
        ]
      }
    };
  },
  watch: {
    gojsLoaded(val) {
      if (val) {
        this.init();
      }
    }
  },
  created() {
    // 加载echartsjs
    this.loadjs(gojsUrl).then(() => {
      this.gojsLoaded = true;
    });
  },
  beforeMount() {
    // console.log(gojs);
  },
  mounted() {},
  methods: {
    //初始化e-r图
    init() {
      let _self = this;
      if (window.goSamples) goSamples(); // init for these samples -- you don't need to call this
      var $ = go.GraphObject.make; // for conciseness in defining templates

      window.myDiagram = $(
        go.Diagram,
        "chart-diagram", // must name or refer to the DIV HTML element
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

      // 当文档被修改时，添加一个“到标题并启用Save”按钮
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

      // 节点模板的助手定义

      function nodeStyle() {
        return [
          //节点。位置来自于节点数据的“loc”属性，
          //由点转换。解析静态方法。
          //如果该节点。位置改变了，它更新了节点数据的“loc”属性，
          //用这个点进行转换。stringify静态方法。
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
            go.Point.stringify
          ),
          {
            //位置位于每个节点的中心
            locationSpot: go.Spot.Center,
            isShadowed: false,
            shadowColor: "#888",
            //处理鼠标进入/离开事件以显示/隐藏端口
            mouseEnter: function(e, obj) {
              _self.showPorts(obj.part, true);
            },
            mouseLeave: function(e, obj) {
              _self.showPorts(obj.part, false);
            }
          }
        ];
      }

      //定义一个用于创建通常透明的“端口”的函数。
      //“名称”用作图形对象。portId，“spot”是用来控制链接连接的
      //以及端口位于节点上的位置，以及布尔“输出”和“输入”参数
      //控制用户是否可以从端口或到端口上绘制链接
      function makePort(name, spot, output, input) {
        //这个端口基本上就是一个小的圆圈当它被显示出来的时候它会有一个白色的笔画
        return $(go.Shape, "Circle", {
          fill: "transparent",
          stroke: null, // this is changed to "white" in the showPorts function
          desiredSize: new go.Size(10, 10),
          alignment: spot,
          alignmentFocus: spot, // align the port on the main Shape
          portId: name, // declare this object to be a "port"
          fromSpot: spot,
          toSpot: spot, // declare where links may connect at this port
          fromLinkable: output,
          toLinkable: input, // declare whether the user may draw links to/from here
          cursor: "pointer" // show a different cursor to indicate potential link point
        });
      }

      // define the Node templates for regular nodes

      var lightText = "whitesmoke";

      myDiagram.nodeTemplateMap.add(
        "Next", // the default category
        $(
          go.Node,
          "Spot",
          nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(
            go.Panel,
            "Auto",
            $(
              go.Shape,
              "RoundedRectangle",
              { fill: "rgb(54, 128, 181)", stroke: null },
              new go.Binding("figure", "figure")
            ),
            $(
              go.TextBlock,
              {
                font: "11pt Helvetica, Arial, sans-serif",
                stroke: lightText,
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay()
            )
          ),
          // four named ports, one on each side:
          makePort("T", go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Judge", // the default category
        $(
          go.Node,
          "Spot",
          nodeStyle(),
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          $(
            go.Panel,
            "Auto",
            $(
              go.Shape,
              "RoundedRectangle",
              { fill: "rgb(95, 189, 193)", stroke: null },
              new go.Binding("figure", "figure")
            ),
            $(
              go.TextBlock,
              {
                font: "11pt Helvetica, Arial, sans-serif",
                stroke: lightText,
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text").makeTwoWay()
            )
          ),
          // four named ports, one on each side:
          makePort("T", go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, true, true),
          makePort("R", go.Spot.Right, true, true),
          makePort("B", go.Spot.Bottom, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Start",
        $(
          go.Node,
          "Spot",
          nodeStyle(),
          $(
            go.Panel,
            "Auto",
            $(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "rgb(29, 180, 149)",
              stroke: null
            }),
            $(
              go.TextBlock,
              "Start",
              {
                font: "11pt Helvetica, Arial, sans-serif",
                stroke: lightText
              },
              new go.Binding("text")
            )
          ),
          // three named ports, one on each side except the top, all output only:
          makePort("L", go.Spot.Left, true, false),
          makePort("R", go.Spot.Right, true, false),
          makePort("B", go.Spot.Bottom, true, false)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "End",
        $(
          go.Node,
          "Spot",
          nodeStyle(),
          $(
            go.Panel,
            "Auto",
            $(go.Shape, "Circle", {
              minSize: new go.Size(40, 40),
              fill: "rgb(201, 92, 81)",
              stroke: null
            }),
            $(
              go.TextBlock,
              "End",
              {
                font: "11pt Helvetica, Arial, sans-serif",
                stroke: lightText
              },
              new go.Binding("text")
            )
          ),
          // 三个指定的端口，每个端口都有一个，除了底部，所有输入都是：
          makePort("T", go.Spot.Top, false, true),
          makePort("L", go.Spot.Left, false, true),
          makePort("R", go.Spot.Right, false, true)
        )
      );

      myDiagram.nodeTemplateMap.add(
        "Comment",
        $(
          go.Node,
          "Auto",
          nodeStyle(),
          $(go.Shape, "File", {
            fill: "rgb(230, 223, 204)",
            stroke: null
          }),
          $(
            go.TextBlock,
            {
              margin: 5,
              maxSize: new go.Size(200, NaN),
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
              font: "12pt Helvetica, Arial, sans-serif",
              stroke: "rgb(54, 54, 54)"
            },
            new go.Binding("text").makeTwoWay()
          )
          // no ports, because no links are allowed to connect with a comment
          //没有端口应为没有链接到评论
        )
      );

      // 替换默认模板
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
      //事件,这里处理点击事件添加实体的其他属性
      myDiagram.addDiagramListener("ObjectSingleClicked", function(e) {
        _self.dialogVisible = true;
        //于数组的key对应起来,之后添加新的属性到该数组里,点击事件触发在前
        _self.nowTagKey = e.subject.part.data.key;
      });
      // 这个监听器是由“link绘制”和“链接”的图表所调用的。
      function showLinkLabel(e) {
        var label = e.subject.findObject("LABEL");
        if (label !== null)
          label.visible = e.subject.fromNode.data.figure === "Diamond";
      }
      //LinkingTool和RelinkingTool使用的临时链接也是正交的
      myDiagram.toolManager.linkingTool.temporaryLink.routing =
        go.Link.Orthogonal;
      myDiagram.toolManager.relinkingTool.temporaryLink.routing =
        go.Link.Orthogonal;
      _self.load(); // 初始化图表

      // 初始化页面左边的调色板
      window.myPalette = $(
        go.Palette,
        "chart-palette", // must name or refer to the DIV HTML element
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
    },
    showPorts(node, show) {
      var diagram = node.diagram;
      if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
      node.ports.each(function(port) {
        port.stroke = show ? "white" : null;
      });
    },
    //初始化
    load() {
      let _self = this;
      myDiagram.model = go.Model.fromJson(_self.chartData);
      myDiagram.model.linkFromPortIdProperty = "fromPort"; //必须记住portIds
      myDiagram.model.linkToPortIdProperty = "toPort";
    },
    //存sgv
    makeSVG() {
      var img = myDiagram.makeImage({
        scale: 1
      });
      img.style.border = "1px solid black";
      obj = document.getElementById("SVGArea");
      obj.appendChild(img);
      if (obj.children.length > 0) {
        obj.replaceChild(img, obj.children[0]);
      }
    },
    //保存josn
    save() {
      let _self = this;
      _self.$set(_self, "chartData", myDiagram.model.toJson());
      myDiagram.isModified = false;
    },
    //弹出提交
    onSubmit() {
      this.dialogVisible = false;
      if (typeof this.chartData == "string") {
        this.chartData = JSON.stringify(this.chartData);
        this.chartData.nodeDataArray[-1 - this.nowTagKey][
          "name"
        ] = this.form.name;
        this.chartData.nodeDataArray[-1 - parseInt(this.nowTagKey)][
          "dec"
        ] = this.form.dec;
        this.chartData.nodeDataArray[-1 - parseInt(this.nowTagKey)][
          "time"
        ] = this.form.time;
      } else {
        this.chartData.nodeDataArray[-1 - this.nowTagKey][
          "name"
        ] = this.form.name;
        this.chartData.nodeDataArray[-1 - parseInt(this.nowTagKey)][
          "dec"
        ] = this.form.dec;
        this.chartData.nodeDataArray[-1 - parseInt(this.nowTagKey)][
          "time"
        ] = this.form.time;
      }
      // this.save();//保存数据
      console.log(this.chartData);
      return false;
    }
  }
};
</script>
<style lang="scss" scoped>
#wrap {
  .detailDialog {
    .input-size {
      width: 250px;
    }
  }
}
</style>

