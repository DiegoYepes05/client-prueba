import type { TransactionStatus } from "@/domain/entities/Transaction";

const config: Record<
  TransactionStatus,
  { label: string; bg: string; text: string }
> = {
  APPROVED: {
    label: "Aprobado",
    bg: "bg-gray-100",
    text: "text-black",
  },
  DECLINED: {
    label: "Rechazado",
    bg: "bg-black",
    text: "text-white",
  },
  PENDING: {
    label: "Pendiente",
    bg: "bg-gray-50",
    text: "text-gray-600",
  },
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const { label, bg, text } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ${bg} ${text}`}
    >
      {label}
    </span>
  );
}
