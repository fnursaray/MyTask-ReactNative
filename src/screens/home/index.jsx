import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import FloatActionButton from '../../components/ui/floatActionButton';
import {ADDTASKS} from '../../utils/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import TaskCard from '../../components/home/taskCard';
import HeaderComponent from '../../components/home/headerComponent';

const Home = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [ongoing, setOngoing] = useState(0);
  const [pending, setPending] = useState(0);
  const [complated, setComplated] = useState(0);
  const [cancel, setCancel] = useState(0);

  const getTask = async () => {
    try {
      const savedTask = await AsyncStorage.getItem('tasks');
      if (savedTask) {
        const parsedTasks = JSON.parse(savedTask);
        setTasks(parsedTasks);

        let complatedCount = 0;
        let pendingCount = 0;
        let ongoingCount = 0;
        let cancelCount = 0;

        for (const task of parsedTasks) {
          if (task.status === 1) {
            ongoingCount++;
          }
          if (task.status === 2) {
            pendingCount++;
          }
          if (task.status === 3) {
            complatedCount++;
          }
          if (task.status === 4) {
            cancelCount++;
          }
        }

        setOngoing(ongoingCount);
        setPending(pendingCount);
        setComplated(complatedCount);
        setCancel(cancelCount);
      } else {
        setTasks([]); // savedTask boş ise tasks'ı boş dizi olarak ayarla
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getTask();
    setRefreshing(false);
  };

  useEffect(() => {
    getTask();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        ListHeaderComponent={
          <HeaderComponent
            ongoing={ongoing}
            pending={pending}
            complated={complated}
            cancel={cancel}
          />
        }
        renderItem={({item}) => <TaskCard item={item} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <FloatActionButton onPress={() => navigation.navigate(ADDTASKS)} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
