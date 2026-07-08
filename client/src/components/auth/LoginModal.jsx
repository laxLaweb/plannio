import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginOptions } from "./LoginOptions";

export function LoginModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in to create a poll</DialogTitle>
          <DialogDescription>
            Sign in with Discord, Slack, or your email and password, to create polls.
          </DialogDescription>
        </DialogHeader>

        <LoginOptions redirectTo="/polls/new" />

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          We only use your name and profile picture to identify you in Plannio.
        </p>
      </DialogContent>
    </Dialog>
  );
}
