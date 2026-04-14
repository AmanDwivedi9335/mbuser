import type { NodeProps } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import type { FamilyNode } from "../types";

export function MemberNode({ data, selected }: NodeProps<FamilyNode>) {
  return (
    <div
      className={`min-w-[220px] rounded-3xl border bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur transition-all ${
        selected ? "border-violet-500 ring-4 ring-violet-200" : "border-slate-200"
      }`}
    >
      <Handle id="parent-in" type="target" position={Position.Top} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-violet-500" />
      <Handle id="child-out" type="source" position={Position.Bottom} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-violet-500" />
      <Handle id="spouse-in" type="target" position={Position.Left} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-rose-500" />
      <Handle id="spouse-out" type="source" position={Position.Right} className="!h-2.5 !w-2.5 !border-2 !border-white !bg-rose-500" />
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-base font-bold text-white"
          style={{ backgroundColor: data.avatarColor }}
        >
          {data.name.slice(0, 1)}
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-slate-900">{data.name}</p>
          <p className="text-xs text-slate-500">
            {data.relation} • {data.age} yrs
          </p>
        </div>
      </div>
    </div>
  );
}
