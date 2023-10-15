import React, {useState, useEffect, useSyncExternalStore} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import {BASE_URL, TOKEN} from './url';
import Icon from 'react-native-vector-icons/AntDesign';
import {useIsFocused} from '@react-navigation/native';
import AddData from './AddData';

const Home = ({navigation, route}) => {
  const [dataMobil, setDataMobil] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState({});
  const [showAddData, setShowAddData] = useState(false);
  const [namaMobil, setNamaMobil] = useState('');
  const [totalKM, setTotalKM] = useState('');
  const [hargaMobil, setHargaMobil] = useState('');

  const getDataMobil = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}mobil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
        },
      });

      const result = await response.json();
      console.log('Success:', result);
      setDataMobil(result.items);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const postData = async () => {
    const body = [
      {
        title: namaMobil,
        harga: hargaMobil,
        totalKM: totalKM,
        unitImage:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrhVioZcYZix5OUz8iGpzfkBJDzc7qPURKJQ&usqp=CAU',
      },
    ];

    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}mobil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      setIsLoading(false);
      console.log('Success:', result);
      alert('Data Mobil berhasil ditambahkan');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
    setShowAddData(false);
    setNamaMobil('');
    setTotalKM('');
    setHargaMobil('');
    getDataMobil();
  };

  const deleteData = async item => {
    setIsLoading(true);
    const body = [
      {
        _uuid: item._uuid,
      },
    ];
    try {
      const response = await fetch(`${BASE_URL}mobil`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      setIsLoading(false);
      alert('Data Mobil berhasil dihapus');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error:', error);
    }
    getDataMobil();
  };

  const convertCurrency = (nominal, currency) => {
    if (nominal !== undefined) {
      let rupiah = '';
      const nominalref = nominal.toString().split('').reverse().join('');
      for (let i = 0; i < nominalref.length; i++) {
        if (i % 3 === 0) {
          rupiah += nominalref.substr(i, 3) + '.';
        }
      }

      if (currency) {
        return (
          currency +
          rupiah
            .split('', rupiah.length - 1)
            .reverse()
            .join('')
        );
      } else {
        return rupiah
          .split('', rupiah.length - 1)
          .reverse()
          .join('');
      }
    } else {
      return 'Nominal undifined';
    }
  };

  useEffect(() => {
    getDataMobil();
  }, [isFocused]);

  const disableButton = () => {
    return (
      namaMobil === '' ||
      hargaMobil === '' ||
      hargaMobil < '100000000' ||
      totalKM === ''
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Text
        style={{fontWeight: 'bold', fontSize: 20, margin: 15, color: '#000'}}>
        Home screen
      </Text>
      {/* {isLoading ? (
        <ActivityIndicator
          size={50}
          color={'#689f38'}
          style={{flex: 1, justifyContent: 'center'}}
        />
      ) : ( */}
      <FlatList
        data={dataMobil}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: '90%',
              alignSelf: 'center',
              marginTop: 15,
              borderColor: '#dedede',
              borderWidth: 1,
              borderRadius: 6,
              padding: 12,
              flexDirection: 'row',
            }}
            onPress={() => {
              setSelected(item);
              setModalVisible(true);
            }}>
            <View
              style={{
                width: '30%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{width: '90%', height: 100, resizeMode: 'contain'}}
                source={{uri: item.unitImage}}
              />
            </View>
            <View
              style={{
                width: '70%',
                paddingHorizontal: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: '700', fontSize: 14, color: '#000'}}>
                  Nama Mobil :
                </Text>
                <Text style={{fontSize: 14, color: '#000'}}> {item.title}</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: '700', fontSize: 14, color: '#000'}}>
                  Total KM :
                </Text>
                <Text style={{fontSize: 14, color: '#000'}}>
                  {' '}
                  {item.totalKM}
                </Text>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: '700', fontSize: 14, color: '#000'}}>
                  Harga Mobil :
                </Text>
                <Text style={{fontSize: 14, color: '#000'}}>
                  {convertCurrency(item.harga, 'Rp. ')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      {/* )} */}

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 10,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() =>
          //navigation.navigate('AddData')
          setShowAddData(true)
        }>
        <Icon name="plus" size={20} color="#fff" />
      </TouchableOpacity>
      <Modal visible={isLoading} transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4',
          }}>
          <View
            style={{backgroundColor: 'black', padding: 10, borderRadius: 6}}>
            <ActivityIndicator size={25} />
            <Text style={{alignSelf: 'center', marginTop: 10, color: 'white'}}>
              Loading
            </Text>
          </View>
        </View>
      </Modal>
      <Modal visible={isModalVisible} transparent={true}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              width: 250,
              height: 100,
              padding: 10,
              borderRadius: 10,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}>
              <Icon name="closecircleo" color="black" size={25} />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'green',
                  borderRadius: 10,
                  paddingVertical: 5,
                  alignItems: 'center',
                  width: '45%',
                }}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('AddData', selected);
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  borderRadius: 10,
                  paddingVertical: 5,
                  alignItems: 'center',
                  width: '45%',
                }}
                onPress={() => {
                  setModalVisible(false);
                  deleteData(selected);
                  getDataMobil();
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showAddData} transparent={true}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <View
            style={{backgroundColor: '#fff', width: '80%', borderRadius: 6}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setShowAddData(false)}
                style={{
                  width: '10%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                }}>
                <Icon name="closecircleo" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
                Tambah Data
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                padding: 15,
              }}>
              <View>
                <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>
                  Nama Mobil
                </Text>
                <TextInput
                  placeholder="Masukkan Nama Mobil"
                  value={namaMobil}
                  onChangeText={text => setNamaMobil(text)}
                  style={styles.txtInput}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>
                  Total Kilometer
                </Text>
                <TextInput
                  value={totalKM}
                  onChangeText={text => setTotalKM(text)}
                  placeholder="contoh: 100 KM"
                  style={styles.txtInput}
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>
                  Harga Mobil
                </Text>
                <TextInput
                  value={hargaMobil}
                  onChangeText={text => setHargaMobil(text)}
                  placeholder="Masukkan Harga Mobil"
                  style={styles.txtInput}
                  keyboardType="number-pad"
                />
              </View>
              <TouchableOpacity
                disabled={disableButton()}
                onPress={postData}
                style={[
                  styles.btnAdd,
                  disableButton() ? {backgroundColor: '#A5A5A5'} : {},
                ]}>
                <Text style={{color: '#fff', fontWeight: '600'}}>
                  Tambah Data
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  btnAdd: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#689f38',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtInput: {
    marginTop: 10,
    width: '100%',
    borderRadius: 6,
    paddingHorizontal: 10,
    borderColor: '#dedede',
    borderWidth: 1,
  },
});

export default Home;
