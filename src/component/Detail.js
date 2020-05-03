import React from 'react';
import { View, Modal, Text, Platform } from 'react-native'
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      params: '',
      isModalVisible: true
    };
  }

  componentDidMount() {
    const params = this.props.route.params.item
    this.setState({ params })
  }

  closeModal = () => {
    const { isFromFavorite } = this.props.route.params
    this.setState({
      isModalVisible: false
    })
    {
      isFromFavorite ?
        this.props.navigation.navigate('Favorite')
        : this.props.navigation.navigate('Home')
    }
  }

  render() {
    const { params, isModalVisible } = this.state
    const runFirst = `
      window.isNativeApp = true;
      true; // note: this is required, or you'll sometimes get silent failures
    `;


    return (
      <Modal
        visible={isModalVisible}
        animationType="slide"
        style={{ padding: 20 }}
        backdropColor={'white'}
        backdropOpacity={1}
        onRequestClose={() => this.closeModal}>
        <View
          style={
            { padding: 10, alignItems: 'flex-end', backgroundColor: '#BB181A' }
          }>
          <Icon name={"times-circle"} size={30} color="white" onPress={() => this.closeModal()} />
        </View>
        <View style={{ flex: 1 }}>
          <WebView
            style={{ padding: 20 }}
            source={{ uri: params.url }}
            injectedJavaScriptBeforeContentLoaded={runFirst}
          />
        </View>
      </Modal>
    )
  }
}

export default Detail;