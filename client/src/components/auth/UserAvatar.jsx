import { cn } from "@/lib/utils";

export function UserAvatar({ user, className }) {
  if (user?.avatarUrl) {
    return <img src={user.avatarUrl} alt="" className={cn("object-cover", className)} />;
  }

  const initial = (user?.displayName || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <span
      className={cn(
        "grid place-items-center bg-primary-soft font-semibold text-primary",
        className,
      )}
    >
      {initial}
    </span>
  );
}
