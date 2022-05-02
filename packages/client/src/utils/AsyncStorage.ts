import AsyncStorage from '@callstack/async-storage'

export const getItem = (key: string) => {
  return AsyncStorage.getItem(key).then((value: string) => {
    try {
      if (value === 'undefined') {
        return null
      }
      const parsedValue = JSON.parse(value)
      return parsedValue
    } catch {
      return value
    }
  })
}

export const setItem = (key: string, value: string) => {
  return AsyncStorage.setItem(key, value)
}

export const removeItem = (item: string) => {
  return AsyncStorage.removeItem(item)
}

export const clearStorage = () => {
  AsyncStorage.clear()
}
