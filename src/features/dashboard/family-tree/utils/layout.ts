import dagre from "dagre";
import ELK from "elkjs/lib/elk.bundled.js";
import type { FamilyEdge, FamilyNode, LayoutEngine } from "../types";

const NODE_WIDTH = 240;
const NODE_HEIGHT = 96;

const elk = new ELK();

export async function getLayoutedElements(nodes: FamilyNode[], edges: FamilyEdge[], engine: LayoutEngine) {
  if (engine === "elk") {
    const graph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
        "elk.spacing.nodeNode": "70",
        "elk.layered.spacing.nodeNodeBetweenLayers": "90",
      },
      children: nodes.map((node) => ({ id: node.id, width: NODE_WIDTH, height: NODE_HEIGHT })),
      edges: edges.map((edge) => ({ id: edge.id, sources: [edge.source], targets: [edge.target] })),
    };

    const layout = await elk.layout(graph);

    const layoutedNodes = nodes.map((node) => {
      const elkNode = layout.children?.find((child) => child.id === node.id);
      return {
        ...node,
        position: {
          x: elkNode?.x ?? 0,
          y: elkNode?.y ?? 0,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  }

  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 90, marginx: 20, marginy: 20 });

  nodes.forEach((node) => g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = g.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
