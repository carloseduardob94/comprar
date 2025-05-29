import { FilterStatus } from "@/types/FilterStatus";
import { CircleCheck, CircleDashed } from "lucide-react-native";

interface StatusIconProps {
  status: FilterStatus;
}

export function StatusIcon({ status }: StatusIconProps) {
  return status === FilterStatus.DONE ? (
    <CircleCheck size={18} color="#2C46B1" />
  ) : (
    <CircleDashed size={18} color="#000" />
  )
}
