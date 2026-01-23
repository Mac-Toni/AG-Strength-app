import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [grupoAtual, setGrupoAtual] = useState('Treino A');
  
  const [treinos, setTreinos] = useState({
    'Treino A': [
      { id: '1', nome: 'Supino Reto', selecionado: false },
      { id: '2', nome: 'Rosca direta c/ barra', selecionado: false },
      { id: '3', nome: 'Supino inclinado', selecionado: false },
      { id: '4', nome: 'Rosca alternada', selecionado: false },
      { id: '5', nome: 'Supino declinado', selecionado: false },
      { id: '6', nome: 'Rosca concentrada', selecionado: false },
      { id: '7', nome: 'Supino mãos aproximadas', selecionado: false },
      { id: '8', nome: 'Antebraços c/ barra', selecionado: false },
      { id: '9', nome: 'Supino c/ halteres', selecionado: false },
      { id: '10', nome: 'Crucifixo c/ halteres', selecionado: false },
      { id: '11', nome: 'Supino inclinado c/ halteres', selecionado: false },
      { id: '12', nome: 'Crucifixo incli. c/ halteres', selecionado: false },
      { id: '13', nome: 'Peito estação', selecionado: false },
      { id: '14', nome: 'Abdominal', selecionado: false },
    ],
    'Treino B': [
      { id: '15', nome: 'Puxada alta frontal', selecionado: false },
      { id: '16', nome: 'Puxada alta mãos prox.', selecionado: false },
      { id: '17', nome: 'Tríceps barra reta', selecionado: false },
      { id: '18', nome: 'Puxada braços esticados', selecionado: false },
      { id: '19', nome: 'Tríceps corda', selecionado: false },
      { id: '20', nome: 'Remada sentado', selecionado: false },
      { id: '21', nome: 'Tríceps coice', selecionado: false },
      { id: '22', nome: 'Serrote', selecionado: false },
      { id: '23', nome: 'Pux. vert. c/ barra mãos juntas', selecionado: false },
      { id: '24', nome: 'Levantamento terra', selecionado: false },
      { id: '25', nome: 'Elev/abdução escápulas', selecionado: false },
      { id: '26', nome: 'Remada curvada pronada', selecionado: false },
      { id: '27', nome: 'Remada curvada', selecionado: false },
      { id: '28', nome: 'Abdominal', selecionado: false },
    ],
    'Treino C': [
      { id: '29', nome: 'Ombro estação', selecionado: false },
      { id: '30', nome: 'Extensão pernas', selecionado: false },
      { id: '31', nome: 'Des. sentado c/ halteres', selecionado: false },
      { id: '32', nome: 'Flexão pernas', selecionado: false },
      { id: '33', nome: 'Elev. frontal c/ halteres', selecionado: false },
      { id: '34', nome: 'Prensa hack squat', selecionado: false },
      { id: '35', nome: 'Elev. lateral c/ halteres', selecionado: false },
      { id: '36', nome: 'Leg press inclinado', selecionado: false },
      { id: '37', nome: 'Elev. lateral tronco p/ frente', selecionado: false },
      { id: '38', nome: 'Agachamento c/ barra', selecionado: false },
      { id: '39', nome: 'Des. c/ barra atrás da nuca', selecionado: false },
      { id: '40', nome: 'Des. c/ barra frente', selecionado: false },
      { id: '41', nome: 'Deltóide sent. rot. do punho', selecionado: false },
      { id: '42', nome: 'Abdominal', selecionado: false },
    ]
  });

  // Carregar dados quando o app abrir
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('@meu_treino_dados');
      if (dadosSalvos !== null) {
        setTreinos(JSON.parse(dadosSalvos));
      }
    } catch (e) {
      console.log("Erro ao carregar dados");
    }
  };

  const salvarDados = async (novosTreinos) => {
    try {
      await AsyncStorage.setItem('@meu_treino_dados', JSON.stringify(novosTreinos));
    } catch (e) {
      console.log("Erro ao salvar dados");
    }
  };

  const alternarSelecao = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const novosTreinos = {
      ...treinos,
      [grupoAtual]: treinos[grupoAtual].map(ex => 
        ex.id === id ? { ...ex, selecionado: !ex.selecionado } : ex
      )
    };
    setTreinos(novosTreinos);
    salvarDados(novosTreinos);
  };

  const resetarTreino = () => {
    Alert.alert(
      "Limpar Treino",
      "Deseja desmarcar todos os exercícios deste treino?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim", onPress: () => {
          const novosTreinos = {
            ...treinos,
            [grupoAtual]: treinos[grupoAtual].map(ex => ({ ...ex, selecionado: false }))
          };
          setTreinos(novosTreinos);
          salvarDados(novosTreinos);
        }}
      ]
    );
  };

  const progresso = useMemo(() => {
    const total = treinos[grupoAtual].length;
    const concluidos = treinos[grupoAtual].filter(ex => ex.selecionado).length;
    return { total, concluidos, percentual: (concluidos / total) * 100 };
  }, [treinos, grupoAtual]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.titulo}>🏋️ Meu Treino</Text>
      
      <View style={styles.containerProgresso}>
        <View style={styles.barraFundo}>
          <View style={[styles.barraPreenchida, { width: `${progresso.percentual}%` }]} />
        </View>
        <Text style={styles.textoProgresso}>{progresso.concluidos} de {progresso.total} feitos</Text>
      </View>

      <View style={styles.menu}>
        {Object.keys(treinos).map(grupo => (
          <TouchableOpacity 
            key={grupo} 
            onPress={() => setGrupoAtual(grupo)}
            style={[styles.botaoMenu, grupoAtual === grupo && styles.botaoAtivo]}
          >
            <Text style={[styles.textoMenu, grupoAtual === grupo && styles.textoAtivo]}>{grupo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {treinos[grupoAtual].map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.item, item.selecionado && styles.itemSelecionado]}
            onPress={() => alternarSelecao(item.id)}
          >
            <Text style={[styles.textoItem, item.selecionado && styles.textoSelecionado]}>{item.nome}</Text>
            {item.selecionado && <Text style={styles.check}>✅</Text>}
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity style={styles.botaoReset} onPress={resetarTreino}>
          <Text style={styles.textoReset}>Limpar Treino Atual</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 20, paddingTop: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginVertical: 15, textAlign: 'center' },
  containerProgresso: { marginBottom: 15 },
  barraFundo: { height: 6, backgroundColor: '#333', borderRadius: 3 },
  barraPreenchida: { height: '100%', backgroundColor: '#007AFF', borderRadius: 3 },
  textoProgresso: { color: '#888', fontSize: 12, marginTop: 5, textAlign: 'right' },
  menu: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  botaoMenu: { paddingVertical: 12, borderRadius: 10, backgroundColor: '#252525', flex: 1, marginHorizontal: 4, alignItems: 'center' },
  botaoAtivo: { backgroundColor: '#007AFF' },
  textoMenu: { color: '#888', fontWeight: 'bold' },
  textoAtivo: { color: '#fff' },
  item: { backgroundColor: '#1e1e1e', padding: 18, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemSelecionado: { backgroundColor: '#1c3d5a', borderColor: '#007AFF', borderWidth: 1 },
  textoItem: { color: '#fff', fontSize: 16 },
  textoSelecionado: { color: '#007AFF', fontWeight: 'bold' },
  check: { fontSize: 16 },
  botaoReset: { marginTop: 20, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#ff3b30', alignItems: 'center' },
  textoReset: { color: '#ff3b30', fontWeight: 'bold' }
});