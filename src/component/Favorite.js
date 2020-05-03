import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment'


class Favorite extends React.Component {
  state = {
    favArticles: [],
  };

  componentDidMount() {
    AsyncStorage.getItem('favoriteList')
      .then((val) => {
        this.setState({ favArticles: JSON.parse(val) })
      });
  }

  goToDetail = (item) => {
    this.props.navigation.navigate('Detail', { item, isFromFavorite: true })
  }

  renderItem = ({ item, index }) => {
    const { favArticles } = this.state

    return (
      <View>
        <TouchableOpacity onPress={() => this.goToDetail(item)}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{moment(item.publishedAt).fromNow()}</Text>
        </TouchableOpacity>
        {favArticles.length !== index + 1 && <View style={styles.divider} />}
      </View>
    )
  }

  render() {
    const { favArticles } = this.state
    if (favArticles === null) {
      return (
        <Text style={styles.noData}>Nothing to see here</Text>
      )
    }
    return (
      <View style={{ padding: 10 }}>
        {favArticles.length !== 0 &&
          <FlatList
            data={favArticles}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        }

      </View>
    )
  }
}

export default Favorite;

const styles = StyleSheet.create({
  noData: {
    textAlign: 'center',
    fontSize: 18
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold'
  },
  divider: {
    backgroundColor: 'grey',
    height: 1
  }
})