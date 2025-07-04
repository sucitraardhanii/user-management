import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function CancelButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      color="gray"
      onClick={() => router.back()}
    >
      Cancel
    </Button>
  );
}
