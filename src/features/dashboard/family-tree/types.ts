import type { Edge, Node } from "@xyflow/react";

export type RelationshipType = "parent-child" | "spouse";

export type FamilyMemberData = {
  name: string;
  relation: string;
  age: number;
  gender: "female" | "male" | "non-binary";
  avatarColor: string;
  expanded?: boolean;
};

export type FamilyNode = Node<FamilyMemberData, "familyMember">;

export type FamilyEdgeData = {
  relationship: RelationshipType;
};

export type FamilyEdge = Edge<FamilyEdgeData>;

export type LayoutEngine = "dagre" | "elk";

export type MemberFormState = {
  id?: string;
  name: string;
  relation: string;
  age: number;
  gender: FamilyMemberData["gender"];
};
