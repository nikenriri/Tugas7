import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {BASE_URL, TOKEN} from './url';

const AddData = ({navigation, route}) => {
  const [namaMobil, setNamaMobil] = useState('');
  const [totalKM, setTotalKM] = useState('');
  const [hargaMobil, setHargaMobil] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  var dataMobil = route.params;

  const postData = async () => {
    setIsLoading(true);
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
      const response = await fetch(`${BASE_URL}mobil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log('Success:', result);
      alert('Data Mobil berhasil ditambahkan');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const editData = async () => {
    setIsLoading(true);
    const body = [
      {
        _uuid: dataMobil._uuid,
        title: namaMobil,
        harga: hargaMobil,
        totalKM: totalKM,
        unitImage:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrhVioZcYZix5OUz8iGpzfkBJDzc7qPURKJQ&usqp=CAU',
      },
    ];
    try {
      const response = await fetch(`${BASE_URL}mobil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: TOKEN,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log('Success:', result);
      alert('Data Mobil berhasil dirubah');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async () => {
    setIsLoading(true);
    const body = [
      {
        _uuid: dataMobil._uuid,
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
      alert('Data Mobil berhasil dihapus');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (route.params) {
      const data = route.params;
      setNamaMobil(data.title);
      setTotalKM(data.totalKM);
      setHargaMobil(data.harga);
    }
  }, []);

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
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <Icon name="arrowleft" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
          {dataMobil ? 'Ubah Data' : 'Tambah Data'}
        </Text>
      </View>
      {/* {isLoading ? (
        <ActivityIndicator
          size={50}
          color={'#689f38'}
          style={{flex: 1, justifyContent: 'center'}}
        />
      ) : ( */}
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
            style={styles.txtInput}
            onChangeText={text => setNamaMobil(text)}
            value={namaMobil}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>
            Total Kilometer
          </Text>
          <TextInput
            placeholder="contoh: 100 KM"
            style={styles.txtInput}
            onChangeText={text => setTotalKM(text)}
            value={totalKM}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 16, color: '#000', fontWeight: '600'}}>
            Harga Mobil
          </Text>
          <TextInput
            placeholder="Masukkan Harga Mobil"
            style={styles.txtInput}
            keyboardType="number-pad"
            onChangeText={text => setHargaMobil(text)}
            value={hargaMobil}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.btnAdd,
            disableButton() ? {backgroundColor: 'A5A5A5'} : {},
          ]}
          disabled={disableButton()}
          onPress={() => (dataMobil ? editData() : postData())}>
          <Text style={{color: '#fff', fontWeight: '600'}}>
            {dataMobil ? 'Ubah Data' : 'Tambah Data'}
          </Text>
        </TouchableOpacity>

        {dataMobil ? (
          <TouchableOpacity
            style={[styles.btnAdd, {backgroundColor: 'red'}]}
            onPress={deleteData}>
            <Text style={{color: '#fff', fontWeight: '600'}}>Hapus Data</Text>
          </TouchableOpacity>
        ) : null}
        <Modal visible={isLoading} transparent={true}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}>
            <View
              style={{
                backgroundColor: 'black',
                padding: 10,
                borderRadius: 6,
              }}>
              <ActivityIndicator size={25} />
              <Text style={{alignSelf: 'center', marginTop: 10}}>Loading</Text>
            </View>
          </View>
        </Modal>
      </View>
      {/* )} */}
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

export default AddData;
