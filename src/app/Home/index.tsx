import { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, Text, FlatList, Alert } from 'react-native';

import { styles } from './styles';

import { FilterStatus } from '@/types/FilterStatus';

import { itemsStorage, ItemStorage } from '@/storage/itemsStorage';

import { Item } from '@/components/Item';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Filter } from '@/components/Filter';


const FILTER_STATUS: FilterStatus[] = [
  FilterStatus.PENDING,
  FilterStatus.DONE
]

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.PENDING)
  const [description, setDescription] = useState('')
  const [items, setItems] = useState<ItemStorage[]>([])


  const handleAddItem = async () => {
    if (!description.trim()) {
      return Alert.alert("Adicionar", "Informe a descrição para adicionar.")
    }

    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PENDING
    }

    setItems(prev => [...prev, newItem])

    await itemsStorage.add(newItem)
    await itemsStorage.getItemsByStatus(filter).then(setItems)

    setFilter(FilterStatus.PENDING)
    Alert.alert("Adicionado", `Adicionado ${description} com sucesso!`)
    setDescription('')
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await itemsStorage.remove(itemId)
      await itemsStorage.getItemsByStatus(filter).then(setItems)

      Alert.alert("Removido", "Item removido com sucesso!")
    } catch (error) {
      console.error(error)
      Alert.alert("Erro", "Não foi possível remover o item.")
    }
  }

  function handleClear() {
    Alert.alert("Limpar", "Tem certeza que deseja limpar todos os itens?", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Limpar",
        style: "destructive",
        onPress: () => {
          onClear()
        }
      }
    ])
  }

  async function onClear() {
    try {
      await itemsStorage.clear()
      await itemsStorage.getItemsByStatus(filter).then(setItems)

      Alert.alert("Limpo", "Todos os itens foram removidos com sucesso!")
    } catch (error) {
      console.error(error)
      Alert.alert("Erro", "Não foi possível limpar os itens.")
    }
  }

  async function onToggleStatus(itemId: string) {
    try {
      await itemsStorage.toggleStatus(itemId)
      await itemsStorage.getItemsByStatus(filter).then(setItems)

    } catch (error) {
      console.error(error)
      Alert.alert("Erro", "Não foi possível atualizar o status.")
    }
  }


  useEffect(() => {
    itemsStorage.getItemsByStatus(filter).then(setItems)
  }, [filter])

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('@/assets/logo.png')} />

      <View style={styles.form}>
        <Input placeholder='O que você precisar comprar?' onChangeText={setDescription} value={description} />
        <Button onPress={handleAddItem} title="Adicionar" />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {
            FILTER_STATUS.map((status) => (
              <Filter
                key={status}
                status={status}
                isActive={status === filter}
                onPress={() => setFilter(status)}
              />
            ))
          }

          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Item
              data={item}
              onRemove={() => handleRemoveItem(item.id)}
              onStatus={() => onToggleStatus(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 1, width: '100%', backgroundColor: '#EEF0F5', marginVertical: 16 }} />}
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 62 }}
          ListEmptyComponent={() => <Text style={{ fontSize: 14, color: "#808080", textAlign: "center" }}>Nenhum item aqui</Text>}
        />
      </View>

    </View>
  );
}
