import { StyleSheet, View } from 'react-native'
import { Provider } from 'react-redux'
import { store } from './src/store'

export function MainScreen() {
  return <View style={styles.container}></View>
}

export default function App() {
  return (
    <Provider store={store}>
      <MainScreen />
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
