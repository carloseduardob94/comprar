import AsyncStorage from "@react-native-async-storage/async-storage";
import { FilterStatus } from "@/types/FilterStatus";

const ITEMS_STORAGE_KEY = "@comprar:items"

export interface ItemStorage {
  id: string;
  status: FilterStatus;
  description: string;
}

async function getItems(): Promise<ItemStorage[]> {
  try {
    const storage = await AsyncStorage.getItem(ITEMS_STORAGE_KEY)

    return storage ? JSON.parse(storage) : []

  } catch (error) {
    throw new Error("GET_ITEMS:" + error)
  }
}

async function getItemsByStatus(status: FilterStatus): Promise<ItemStorage[]> {
  const items = await getItems()

  return items.filter(item => item.status === status)
}

async function saveItems(items: ItemStorage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    throw new Error("SAVE_ITEMS:" + error)
  }
}

async function add(newItem: ItemStorage): Promise<ItemStorage[]> {
  const items = await getItems()
  const updatedItems = [...items, newItem]
  await saveItems(updatedItems)

  return updatedItems
}

async function clear(): Promise<void> {
  try {
    await AsyncStorage.clear()
  } catch (error) {
    throw new Error("CLEAR:" + error)
  }
}

async function remove(itemId: string): Promise<void> {
  const items = await getItems()
  const updatedItems = items.filter(item => item.id !== itemId)

  await saveItems(updatedItems)
}

async function toggleStatus(itemId: string) {
  const items = await getItems()
  const updatedItems = items.map(item =>
    item.id === itemId ? {
      ...item,
      status: item.status === FilterStatus.PENDING ? FilterStatus.DONE : FilterStatus.PENDING
    } : item
  )

  await saveItems(updatedItems)
}

export const itemsStorage = { getItems, getItemsByStatus, add, remove, clear, toggleStatus }
