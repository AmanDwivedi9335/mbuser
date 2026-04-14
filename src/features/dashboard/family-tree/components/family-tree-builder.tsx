"use client";

import { useCallback, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type NodeTypes,
} from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Download, Plus, Save, Upload, X } from "lucide-react";
import "@xyflow/react/dist/style.css";

import { sampleFamilyEdges, sampleFamilyNodes } from "../sample-data";
import type { FamilyEdge, FamilyMemberData, FamilyNode, LayoutEngine, MemberFormState } from "../types";
import { getLayoutedElements } from "../utils/layout";
import { MemberNode } from "./member-node";

const nodeTypes: NodeTypes = {
  familyMember: MemberNode,
};

const INITIAL_FORM: MemberFormState = {
  name: "",
  relation: "",
  age: 30,
  gender: "female",
};

function FamilyTreeCanvas() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const reactFlow = useReactFlow<FamilyNode, FamilyEdge>();

  const [nodes, setNodes, onNodesChange] = useNodesState<FamilyNode>(sampleFamilyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FamilyEdge>(sampleFamilyEdges);
  const [layoutEngine, setLayoutEngine] = useState<LayoutEngine>("dagre");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [form, setForm] = useState<MemberFormState>(INITIAL_FORM);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(() => nodes.find((node) => node.id === selectedNodeId), [nodes, selectedNodeId]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const relationship =
        connection.sourceHandle?.includes("spouse") || connection.targetHandle?.includes("spouse") ? "spouse" : "parent-child";
      setEdges((prev) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: relationship === "spouse",
            style: { strokeWidth: 2.5 },
            data: { relationship },
          },
          prev,
        ),
      );
    },
    [setEdges],
  );

  const applyLayout = useCallback(async () => {
    const layouted = await getLayoutedElements(nodes, edges, layoutEngine);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    requestAnimationFrame(() => reactFlow.fitView({ duration: 500, padding: 0.2 }));
  }, [edges, layoutEngine, nodes, reactFlow, setEdges, setNodes]);

  const handleAddMember = useCallback(() => {
    setForm(INITIAL_FORM);
    setSelectedNodeId(null);
    setIsDrawerOpen(true);
  }, []);

  const handleEditMember = useCallback(() => {
    if (!selectedNode) return;
    setForm({
      id: selectedNode.id,
      name: selectedNode.data.name,
      relation: selectedNode.data.relation,
      age: selectedNode.data.age,
      gender: selectedNode.data.gender,
    });
    setIsDrawerOpen(true);
  }, [selectedNode]);

  const handleSubmit = useCallback(() => {
    if (!form.name.trim() || !form.relation.trim()) return;

    const avatarPalette = ["#7c3aed", "#ec4899", "#0ea5e9", "#f97316", "#22c55e", "#ef4444"];

    if (form.id) {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === form.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  name: form.name,
                  relation: form.relation,
                  age: form.age,
                  gender: form.gender,
                },
              }
            : node,
        ),
      );
    } else {
      setNodes((prev) => [
        ...prev,
        {
          id: `n${crypto.randomUUID().slice(0, 8)}`,
          type: "familyMember",
          position: { x: 120, y: 120 },
          data: {
            name: form.name,
            relation: form.relation,
            age: form.age,
            gender: form.gender,
            avatarColor: avatarPalette[prev.length % avatarPalette.length],
            expanded: true,
          },
        },
      ]);
    }

    setIsDrawerOpen(false);
  }, [form, setNodes]);

  const handleDeleteMember = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((node) => node.id !== selectedNodeId));
    setEdges((prev) => prev.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
    setSelectedNodeId(null);
  }, [selectedNodeId, setEdges, setNodes]);

  const handleExpandCollapse = useCallback(() => {
    if (!selectedNodeId) return;

    setNodes((prev) => {
      const toggled = prev.find((node) => node.id === selectedNodeId);
      const shouldCollapse = toggled?.data.expanded ?? true;

      const childMap = edges.reduce<Record<string, string[]>>((acc, edge) => {
        if (edge.data?.relationship !== "parent-child") return acc;
        acc[edge.source] = [...(acc[edge.source] ?? []), edge.target];
        return acc;
      }, {});

      const visited = new Set<string>();
      const stack = [...(childMap[selectedNodeId] ?? [])];

      while (stack.length > 0) {
        const current = stack.pop();
        if (!current || visited.has(current)) continue;
        visited.add(current);
        stack.push(...(childMap[current] ?? []));
      }

      return prev.map((node) => {
        if (node.id === selectedNodeId) {
          return { ...node, data: { ...node.data, expanded: !shouldCollapse } };
        }

        if (!visited.has(node.id)) return node;

        return {
          ...node,
          hidden: shouldCollapse ? true : false,
        };
      });
    });

    setEdges((prev) =>
      prev.map((edge) => ({
        ...edge,
        hidden:
          nodes.find((node) => node.id === edge.source)?.hidden || nodes.find((node) => node.id === edge.target)?.hidden
            ? true
            : false,
      })),
    );
  }, [edges, nodes, selectedNodeId, setEdges, setNodes]);

  const saveJson = useCallback(() => {
    const payload = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "family-tree.json";
    link.click();
    URL.revokeObjectURL(url);
  }, [edges, nodes]);

  const loadJson = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as { nodes: FamilyNode[]; edges: FamilyEdge[] };
    setNodes(parsed.nodes);
    setEdges(parsed.edges);
    setTimeout(() => reactFlow.fitView({ duration: 400, padding: 0.2 }), 100);
    event.target.value = "";
  }, [reactFlow, setEdges, setNodes]);

  const exportPng = useCallback(async () => {
    if (!wrapperRef.current) return;
    const dataUrl = await toPng(wrapperRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "family-tree.png";
    link.click();
  }, []);

  const onDragStart = (event: DragEvent<HTMLButtonElement>, payload: Partial<FamilyMemberData>) => {
    event.dataTransfer.setData("application/family-member", JSON.stringify(payload));
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const memberPayload = event.dataTransfer.getData("application/family-member");
    if (!memberPayload) return;
    const data = JSON.parse(memberPayload) as Partial<FamilyMemberData>;
    const position = reactFlow.screenToFlowPosition({ x: event.clientX, y: event.clientY });

    setNodes((prev) => [
      ...prev,
      {
        id: `n${crypto.randomUUID().slice(0, 8)}`,
        type: "familyMember",
        position,
        data: {
          name: data.name ?? "New Member",
          relation: data.relation ?? "Relative",
          age: data.age ?? 30,
          gender: data.gender ?? "non-binary",
          avatarColor: data.avatarColor ?? "#7c3aed",
          expanded: true,
        },
      },
    ]);
  };

  return (
    <div className="relative h-[calc(100vh-9rem)] min-h-[620px] w-full overflow-hidden rounded-[30px] border border-violet-100 bg-gradient-to-br from-violet-50 via-slate-50 to-white shadow-[0_20px_55px_rgba(76,29,149,0.08)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(139,92,246,0.18),transparent_32%),radial-gradient(circle_at_85%_90%,rgba(14,165,233,0.14),transparent_30%)]" />

      <motion.div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-lg backdrop-blur" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white" onClick={handleAddMember}>
          <Plus className="h-4 w-4" /> Add member
        </button>
        <button type="button" className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white" onClick={applyLayout}>Auto layout</button>
        <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" onClick={handleEditMember} disabled={!selectedNode}>
          Edit
        </button>
        <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" onClick={handleExpandCollapse} disabled={!selectedNode}>
          Expand/Collapse
        </button>
        <button type="button" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700" onClick={handleDeleteMember} disabled={!selectedNode}>
          Delete
        </button>
      </motion.div>

      <motion.div className="absolute right-4 top-4 z-20 flex gap-2 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-lg backdrop-blur" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <button type="button" className="rounded-xl border border-slate-200 p-2" onClick={saveJson} title="Save JSON">
          <Save className="h-4 w-4" />
        </button>
        <button type="button" className="rounded-xl border border-slate-200 p-2" onClick={() => fileRef.current?.click()} title="Load JSON">
          <Upload className="h-4 w-4" />
        </button>
        <button type="button" className="rounded-xl border border-slate-200 p-2" onClick={exportPng} title="Export PNG">
          <Download className="h-4 w-4" />
        </button>
        <select className="rounded-xl border border-slate-200 px-2 text-sm" value={layoutEngine} onChange={(event) => setLayoutEngine(event.target.value as LayoutEngine)}>
          <option value="dagre">dagre</option>
          <option value="elk">elkjs</option>
        </select>
      </motion.div>

      <input ref={fileRef} type="file" accept="application/json" hidden onChange={loadJson} />

      <div className="absolute bottom-4 left-4 z-20 rounded-2xl border border-white/80 bg-white/90 p-3 shadow-lg backdrop-blur">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Drag templates</p>
        <div className="flex gap-2">
          {[{ name: "Parent", relation: "Parent", avatarColor: "#22c55e" }, { name: "Child", relation: "Child", avatarColor: "#0ea5e9" }].map((item) => (
            <button
              key={item.name}
              type="button"
              draggable
              onDragStart={(event) => onDragStart(event, item)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div ref={wrapperRef} className="h-full w-full" onDrop={onDrop} onDragOver={(event) => event.preventDefault()}>
        <ReactFlow
          nodes={nodes}
          edges={edges.map((edge) => ({
            ...edge,
            style: {
              ...edge.style,
              stroke: edge.data?.relationship === "spouse" ? "#f43f5e" : "#6366f1",
            },
          }))}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          minZoom={0.2}
          maxZoom={2}
          defaultEdgeOptions={{
            type: "smoothstep",
          }}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#d8b4fe" gap={20} size={1} />
          <MiniMap pannable zoomable className="!rounded-2xl !border !border-slate-200 !bg-white/90" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      <AnimatePresence>
        {isDrawerOpen ? (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 z-30 h-full w-full max-w-md border-l border-slate-200 bg-white/95 p-6 shadow-2xl backdrop-blur"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{form.id ? "Edit member" : "Add member"}</h3>
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="rounded-full p-2 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="block text-sm">
                Name
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
              </label>
              <label className="block text-sm">
                Relation
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.relation} onChange={(event) => setForm((prev) => ({ ...prev, relation: event.target.value }))} />
              </label>
              <label className="block text-sm">
                Age
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={form.age}
                  onChange={(event) => setForm((prev) => ({ ...prev, age: Number(event.target.value) }))}
                />
              </label>
              <label className="block text-sm">
                Gender
                <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={form.gender} onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value as FamilyMemberData["gender"] }))}>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                </select>
              </label>
            </div>

            <button type="button" className="mt-6 w-full rounded-xl bg-violet-600 px-3 py-2 font-semibold text-white" onClick={handleSubmit}>
              {form.id ? "Save changes" : "Create member"}
            </button>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function FamilyTreeBuilder() {
  return (
    <ReactFlowProvider>
      <FamilyTreeCanvas />
    </ReactFlowProvider>
  );
}
