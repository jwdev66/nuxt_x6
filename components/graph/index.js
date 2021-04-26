// import { Graph, Addon, FunctionExt, Shape, DataUri } from "@antv/x6";
// const x6 = require("@antv/x6")
// const { Graph, Addon, FunctionExt, Shape, DataUri } = this.$x6
// import "./shape";

export default class FlowGraph {
  static graph;
  static stencil;
  static handleGraphAction;

  static init() {
    const { Graph, Shape } = window.X6;

    this.graph = new Graph({
      container: document.getElementById("x6-container"),
      width: 1000,
      height: 800,
      background: {
        color: "#2b2f33",
      },
      //   grid: {
      //     visible: true,
      //   },
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
        filter: ["groupNode"],
      },
      connecting: {
        anchor: "center",
        connectionPoint: "anchor",
        allowBlank: false,
        highlight: true,
        snap: true,
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: "#5F95FF",
                strokeWidth: 2,
                strokeDasharray: 5,
                targetMarker: {
                  name: "classic",
                  size: 8,
                },
              },
            },
            router: {
              name: "normal",
            },
            zIndex: 0,
          });
        },
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet,
        }) {
          if (sourceView === targetView) {
            return false;
          }
          if (!sourceMagnet) {
            return false;
          }
          if (!targetMagnet) {
            return false;
          }
          if (targetMagnet.getAttribute("port-group") !== "top") {
            return false;
          }
          return true;
        },
      },
      highlighting: {
        magnetAvailable: {
          name: "stroke",
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: "rgba(223,234,255)",
            },
          },
        },
      },
      snapline: true,
      history: true,
      clipboard: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox();
          return this.getNodes().filter((node) => {
            const data = node.getData();
            if (data && data.parent) {
              const targetBBox = node.getBBox();
              return bbox.isIntersectWithRect(targetBBox);
            }
            return false;
          });
        },
      },
    });
    this.initStencil();
    this.registerNodes();
    this.initShape();
    this.initActions();
    this.initEvent();
    return this.graph;
  }

  static initStencil() {
    const { Addon } = window.X6;

    this.stencil = new Addon.Stencil({
      title: "Node Type Selector",
      target: this.graph,
      stencilGraphWidth: 240,
      search: { rect: true },
      collapsable: true,
      groups: [
        {
          name: "basic",
          title: "Basic Node",
          graphHeight: 500,
          layoutOptions: {
            columns: 1,
            marginX: 55,
            rowHeight: 60,
          },
        },
      ],
    });
    const stencilContainer = document.getElementById("x6-stencil");
    stencilContainer.appendChild(this.stencil.container);
  }

  static registerNodes() {
    const { Graph } = window.X6;
    Graph.registerNode('basic-node', {
      inherit: 'rect',
      width: 200,
      height: 40,    
      attrs: {
          body: {
              stroke: '#61DDAA',
              strokeWidth: 1,
              fill: '#61DDAA80',
              rx: 6,
              ry: 6,        
          },
          nodeImage: {
              'xlink:href':
                  'https://dl.airtable.com/.attachmentThumbnails/f17c35f9affd107e60b57b5ac91e84aa/03673739',
              width: 26,
              height: 26,
              x: 10,
              y: 7,
          },
          title: {
              text: 'Org Title',
              refX: 45,
              refY: 15,
              fill: '#000000',
              fontSize: 15,
              fontWeight: 'bold',            
              'text-anchor': 'start',
              textWrap: {
                  width: 145,
                  height: 20,
                  ellipsis: true,
              }
          },
          typeImage: {
              'xlink:href':
                  'https://dl.airtable.com/.attachmentThumbnails/f17c35f9affd107e60b57b5ac91e84aa/03673739',
              width: 14,
              height: 14,
              x: 130,
              y: 24,
          },
          typeText: {
              text: 'Org',
              refX: 148,
              refY: 32,
              fontSize: 10,
              fill: '#000000',
              'text-anchor': 'start',
          },
        },
        markup: [
            {
                tagName: 'rect',
                selector: 'body',
            },
            {
                tagName: 'image',
                selector: 'nodeImage',
            },
            {
                tagName: 'text',
                selector: 'title',
            },
            {
                tagName: 'image',
                selector: 'typeImage',
            },
            {
                tagName: 'text',
                selector: 'typeText',
            },
        ],
        ports: {
            groups: {
                top: {
                    position: 'top',
                    attrs: {
                        circle: {
                            r: 5,
                            magnet: 'passive',
                            stroke: '#ffa940',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                                visibility: 'hidden',
                            },
                        },
                    },
                },
                bottom: {
                    position: 'bottom',
                    attrs: {
                        circle: {
                            r: 5,
                            magnet: true,
                            stroke: '#3199FF',
                            strokeWidth: 1,
                            fill: '#fff',
                            style: {
                                visibility: 'hidden',
                            },
                        },
                    },
                },            
            },
            items: [
                {
                    group: 'top',
                },
                {
                    group: 'bottom',
                },
            ],
        },
      })
  
  
      Graph.registerNode('org-node', {
          inherit: 'basic-node',    
          attrs: {
              body: {
                  stroke: '#61DDAA',
                  fill: '#61DDAA80',
              },
              nodeImage: {
                  'xlink:href':
                      'https://dl.airtable.com/.attachmentThumbnails/f17c35f9affd107e60b57b5ac91e84aa/03673739',
              },
              title: {
                  text: 'Org Title',
              },
              typeImage: {
                  'xlink:href':
                      'https://dl.airtable.com/.attachmentThumbnails/f17c35f9affd107e60b57b5ac91e84aa/03673739',
              },
              typeText: {
                  text: 'Org',
              },
          },
      })
      
      Graph.registerNode('project-node', {
          inherit: 'basic-node',
          attrs: {
              body: {
                  stroke: '#5F95FF',
                  fill: '#5F95FF80',
              },
              nodeImage: {
                  'xlink:href':
                      'https://api.iconify.design/mdi-crane.svg',
              },
              title: {
                  text: 'Project Title',
              },
              typeImage: {
                  'xlink:href':
                      'https://api.iconify.design/mdi-crane.svg',
              },
              typeText: {
                  text: 'Project',
              },
          },
      })
      
      
      Graph.registerNode('function-node', {
          inherit: 'project-node',
          attrs: {
              body: {
                  stroke: '#F6BD16',
                  fill: '#F6BD1680',
              },
              nodeImage: {
                  'xlink:href':
                      'https://api.iconify.design/mdi-function.svg',
              },
              title: {
                  text: 'Function Title',
              },
              typeImage: {
                  'xlink:href':
                      'https://api.iconify.design/mdi-function.svg',
              },
              typeText: {
                  text: 'Function',
              },
          },
      })
      
      Graph.registerNode('device-node', {
          inherit: 'basic-node',
          attrs: {
              body: {
                  stroke: '#9661BC',
                  fill: '#9661BC80',
              },
              nodeImage: {
                  'xlink:href':
                      'https://api.iconify.design/mdi-chip.svg',
              },
              title: {
                  text: 'Device Title',
              },
              typeImage: {
                  'xlink:href':
                      'https://api.iconify.design/mdi-chip.svg',
              },
              typeText: {
                  text: 'Device',
              },
          },
      })
      
      Graph.registerNode('resource-node', {
          inherit: 'basic-node',
          attrs: {
              body: {
                  stroke: '#D37099',
                  fill: '#D3709980',
              },
              nodeImage: {
                  'xlink:href':
                      'https://api.iconify.design/emojione-monotone:letter-r.svg',
              },
              title: {
                  text: 'Resource Title',
              },
              typeImage: {
                  'xlink:href':
                      'https://api.iconify.design/emojione-monotone:letter-r.svg',
              },
              typeText: {
                  text: 'Resource',
              },
          },
      })
  
      Graph.registerNode('people-node', {
          inherit: 'basic-node',
          attrs: {
              body: {
                  stroke: '#87412B',
                  fill: '#87412B80',
              },
              nodeImage: {
                  'xlink:href':
                      'https://api.iconify.design/akar-icons:person.svg',
              },
              title: {
                  text: 'People Title',
              },
              typeImage: {
                  'xlink:href':
                      'https://api.iconify.design/akar-icons:person.svg',
              },
              typeText: {
                  text: 'People',
              },
          },
      })
  }

  static initShape() {
    const { graph } = this;

    const orgNode = graph.createNode({
      shape: "org-node",
    });

    const projectNode = graph.createNode({
      shape: "project-node",
    });

    const functionNode = graph.createNode({
      shape: "function-node",
    });

    const deviceNode = graph.createNode({
      shape: "device-node",
    });

    const resourceNode = graph.createNode({
      shape: "resource-node",
    });

    const peopleNode = graph.createNode({
      shape: "people-node",
    });

    this.stencil.load(
      [
        orgNode,
        projectNode,
        functionNode,
        deviceNode,
        resourceNode,
        peopleNode,
      ],
      "basic"
    );
  }

  static showPorts(ports, show) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? "visible" : "hidden";
    }
  }

  static initActions() {
    const { DataUri } = window.X6;
    const { graph } = this;
    const { history } = graph;

    const copy = () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.copy(cells);
      }
      return false;
    };

    const cut = () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.cut(cells);
      }
      return false;
    };

    const paste = () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 });
        graph.cleanSelection();
        graph.select(cells);
      }
      return false;
    };

    const remove = () => {
      const { graph } = FlowGraph;
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.removeCells(cells);
      }
      return false;
    };

    graph.bindKey(["meta+z", "ctrl+z"], () => {
      if (history.canUndo()) {
        history.undo();
      }
      return false;
    });
    graph.bindKey(["meta+shift+z", "ctrl+y"], () => {
      if (history.canRedo()) {
        history.redo();
      }
      return false;
    });
    graph.bindKey(["meta+d", "ctrl+d"], () => {
      graph.clearCells();
      return false;
    });
    graph.bindKey(["meta+s", "ctrl+s"], () => {
      graph.toPNG((datauri) => {
        DataUri.downloadDataUri(datauri, "chart.png");
      });
      return false;
    });
    graph.bindKey(["meta+p", "ctrl+p"], () => {
      graph.printPreview();
      return false;
    });
    graph.bindKey(["meta+c", "ctrl+c"], copy);
    graph.bindKey(["meta+v", "ctrl+v"], paste);
    graph.bindKey(["meta+x", "ctrl+x"], cut);
    graph.bindKey(["delete"], remove);
  }

  static initEvent() {
    const { FunctionExt } = window.X6;
    const { graph } = this;
    const container = document.getElementById("x6-container");

    graph.on("edge:selected", ({ edge }) => {
      edge.attr("line/stroke", "#fcb16c");
      edge.attr("line/strokeDasharray", 0);
    });

    graph.on("edge:unselected", ({ edge }) => {
      edge.attr("line/stroke", "#5F95FF");
      edge.attr("line/strokeDasharray", 5);
    });

    graph.on(
      "node:mouseenter",
      FunctionExt.debounce(() => {
        const ports = container.querySelectorAll(".x6-port-body");
        this.showPorts(ports, true);
      }),
      500
    );
    graph.on("node:mouseleave", () => {
      const ports = container.querySelectorAll(".x6-port-body");
      this.showPorts(ports, false);
    });

    graph.on("node:dblclick", ({ node }) => {
    //   if (this.handleGraphAction) this.handleGraphAction("node-dblclick", node);
        const nodeTitle = node.attr('title/text')
        const newTitle = window.prompt("Please Enter Node Title", nodeTitle);
        if(newTitle) {
            node.attr('title/text', newTitle);
        }        
    });

    graph.on('node:contextmenu', ({ cell, e }) => {      
      // const p = graph.clientToGraph(e.clientX, e.clientY)          
      const contextMenu = document.getElementById("node-conext-menu")
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.style.display="block";
    })  

  }
}
