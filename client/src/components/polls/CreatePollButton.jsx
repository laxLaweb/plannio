import { Button } from "@/components/ui/button";
import { useCreatePoll } from "@/context/CreatePollContext";

export function CreatePollButton({ children, onClick, ...props }) {
  const { requestCreatePoll } = useCreatePoll();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          requestCreatePoll();
        }
      }}
    >
      {children}
    </Button>
  );
}
