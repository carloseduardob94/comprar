import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import { FilterStatus } from "@/types/FilterStatus";
import { StatusIcon } from "../StatusIcon";
import { Trash2 } from "lucide-react-native";

interface ItemData {
  status: FilterStatus;
  description: string;
}

interface ItemProps {
  data: ItemData;
  onRemove: () => void;
  onStatus: () => void;
}

export function Item({ data, onRemove, onStatus }: ItemProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.7} onPress={onStatus}>
        <StatusIcon status={data.status} />
      </TouchableOpacity>

      <Text style={styles.description}>{data.description}</Text>

      <TouchableOpacity onPress={onRemove}>
        <Trash2 size={18} color="#828282" />
      </TouchableOpacity>
    </View>
  )
}