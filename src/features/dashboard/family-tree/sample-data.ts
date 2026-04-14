import type { FamilyEdge, FamilyNode } from "./types";

export const sampleFamilyNodes: FamilyNode[] = [
  {
    id: "n1",
    type: "familyMember",
    position: { x: 0, y: 0 },
    data: { name: "Alex Johnson", relation: "Self", age: 34, gender: "male", avatarColor: "#7c3aed", expanded: true },
  },
  {
    id: "n2",
    type: "familyMember",
    position: { x: 200, y: 0 },
    data: { name: "Maya Johnson", relation: "Spouse", age: 33, gender: "female", avatarColor: "#ec4899", expanded: true },
  },
  {
    id: "n3",
    type: "familyMember",
    position: { x: 100, y: 140 },
    data: { name: "Ethan Johnson", relation: "Son", age: 9, gender: "male", avatarColor: "#0ea5e9", expanded: true },
  },
  {
    id: "n4",
    type: "familyMember",
    position: { x: -120, y: -140 },
    data: { name: "Grace Johnson", relation: "Mother", age: 61, gender: "female", avatarColor: "#f97316", expanded: true },
  },
  {
    id: "n5",
    type: "familyMember",
    position: { x: 120, y: -140 },
    data: { name: "Robert Johnson", relation: "Father", age: 65, gender: "male", avatarColor: "#22c55e", expanded: true },
  },
];

export const sampleFamilyEdges: FamilyEdge[] = [
  {
    id: "e1",
    source: "n1",
    target: "n2",
    type: "smoothstep",
    animated: true,
    style: { strokeWidth: 2.5 },
    data: { relationship: "spouse" },
  },
  {
    id: "e2",
    source: "n1",
    target: "n3",
    type: "smoothstep",
    style: { strokeWidth: 2.5 },
    data: { relationship: "parent-child" },
  },
  {
    id: "e3",
    source: "n2",
    target: "n3",
    type: "smoothstep",
    style: { strokeWidth: 2.5 },
    data: { relationship: "parent-child" },
  },
  {
    id: "e4",
    source: "n4",
    target: "n1",
    type: "smoothstep",
    style: { strokeWidth: 2.5 },
    data: { relationship: "parent-child" },
  },
  {
    id: "e5",
    source: "n5",
    target: "n1",
    type: "smoothstep",
    style: { strokeWidth: 2.5 },
    data: { relationship: "parent-child" },
  },
];
