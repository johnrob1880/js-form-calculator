export default (obj, str) => {
    return str.split('.').reduce((a, b) => {
      return a[b]
    }, obj)
  }