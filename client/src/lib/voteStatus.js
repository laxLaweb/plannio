import { Check, HelpCircle, X } from "lucide-react";

export const VOTE_STATUS_ORDER = ["yes", "maybe", "no"];

export const VOTE_STATUS = {
  yes: {
    icon: Check,
    label: "Accepted",
    textClass: "text-success",
  },
  maybe: {
    icon: HelpCircle,
    label: "Maybe",
    textClass: "text-amber-600",
  },
  no: {
    icon: X,
    label: "Can't make it",
    textClass: "text-destructive",
  },
};

export function optionStatusCounts(option) {
  return {
    yes: option.vote_count ?? 0,
    maybe: option.maybe_count ?? 0,
    no: option.no_count ?? 0,
  };
}

/** Names per status, skipping statuses nobody picked. */
export function groupResponsesByStatus(option) {
  return VOTE_STATUS_ORDER.map((status) => ({
    status,
    names: (option.responses || []).filter((r) => r.status === status).map((r) => r.name),
  })).filter((group) => group.names.length > 0);
}
