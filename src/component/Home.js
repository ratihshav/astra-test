import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import moment from 'moment'

import helper from '../helper'

const prefix_url = 'http://newsapi.org/v2/top-headlines?country=id&apiKey=' + helper.key;

class Home extends React.Component {
  state = {
    articles: [],
    isLoading: false,
    isModalVisible: false,
    itemPressed: ''
  };

  async componentDidMount() {
    this.setState({ isLoading: true });
    await axios.get(prefix_url)
      .then(response => {
        const articles = response.data.articles;
        this.setState({
          isLoading: false,
          articles
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  goToDetail = (item) => {
    this.props.navigation.navigate('Detail', { item, isFromHome: true })
  }

  setModalVisible = () => {
    this.setState({ isModalVisible: true });
  }

  saveToFavorite = async (value) => {
    this.setState({
      itemPressed: value.index
    })
    await AsyncStorage
      .getItem('favoriteList')
      .then(favoriteList => {
        favoriteList = favoriteList == null ? [] : JSON.parse(favoriteList)
        favoriteList.push(value.item)
        return AsyncStorage.setItem('favoriteList', JSON.stringify(favoriteList))
      })
  }

  renderItem = ({ item, index }) => {
    const { itemPressed } = this.state
    return (
      <View>
        <View
          style={styles.itemWrapper}>
          <TouchableOpacity
            style={styles.imageWrapper}
            onPress={() => { this.goToDetail(item) }}>
            <Image style={styles.imageItem} source={{ uri: item.urlToImage }} resizeMethod={'resize'} />
          </TouchableOpacity>
          <View style={styles.headerItem}>
            <Text
              style={styles.titleItem}
              allowFontScaling
              numberOfLines={3}
              ellipsizeMode={'tail'}>
              {item.title}
            </Text>
            <TouchableOpacity onPress={() => this.saveToFavorite({ index, item })} >
              {
                itemPressed === index ? <Icon
                  style={styles.iconFav}
                  name={"heart"}
                  size={30}
                  color="black"
                /> :
                  <Icon
                    style={styles.iconFav}
                    name={"heart-o"}
                    size={30}
                    color="black"
                  />
              }

            </TouchableOpacity>
          </View>
          <View style={styles.footerItem}>
            <Text>{moment(item.publishedAt).fromNow()}</Text>
            <Text>  |  </Text>
            <Text style={{ color: '#BB181A' }}>{item.source.name}</Text>
          </View>
        </View>
      </View >
    )
  }

  render() {
    const { isLoading, articles, itemPressed } = this.state
    if (isLoading) {
      return <Text style={styles.noData}>Loading...</Text>
    }
    return (
      <View style={{ padding: 10 }}>
        {articles.length !== 0 &&
          <FlatList
            data={articles}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={itemPressed}
          />
        }

      </View>
    )
  }
}

export default Home;

const styles = StyleSheet.create({
  itemWrapper: {
    backgroundColor: 'white',
    marginVertical: 5
  },
  imageWrapper: {
    flex: 1,
    backgroundColor: '#eee'
  },
  imageItem: {
    width: '100%',
    height: 150,
    resizeMode: 'cover'
  },
  footerItem: {
    flexDirection: 'row',
    marginHorizontal: 10
  },
  titleItem: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 4,
    marginRight: 10
  },
  iconFav: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  headerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    height: 60,
    margin: 10
  },
  noData: {
    textAlign: 'center',
    fontSize: 18
  },
});