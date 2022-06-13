export class Utils {
  static generateId() {
    function randomChars() {
      return Math.random().toString(16).slice(-4);
    }
    return `${randomChars() + randomChars() + randomChars()}`;
  }

  static getDateTodayAsValue() {
    const today = new Date();
    return `${String(today.getFullYear())}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }
}
