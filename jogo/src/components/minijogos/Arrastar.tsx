"use client";
// Peças de arrastar e soltar (funcionam com mouse e toque). Também aceitam toque simples no alvo.
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import type { ReactNode } from "react";

export function AreaArrastar({ onSoltar, children }: { onSoltar: (alvo: string) => void; children: ReactNode }) {
  const sensores = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const fim = (e: DragEndEvent) => {
    if (e.over) onSoltar(String(e.over.id));
  };
  return (
    <DndContext sensors={sensores} onDragEnd={fim}>
      {children}
    </DndContext>
  );
}

export function Arrastavel({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0) rotate(-3deg)` : undefined,
        touchAction: "none",
        zIndex: isDragging ? 50 : undefined,
      }}
      className={`relative cursor-grab select-none active:cursor-grabbing ${isDragging ? "scale-105 shadow-xl" : ""}`}
    >
      {children}
    </div>
  );
}

export function Alvo({
  id,
  onToque,
  children,
  className = "",
}: {
  id: string;
  onToque: () => void;
  children: (sobre: boolean) => ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <button ref={setNodeRef} onClick={onToque} className={className}>
      {children(isOver)}
    </button>
  );
}
