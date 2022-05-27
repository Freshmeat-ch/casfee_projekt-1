/* eslint-disable no-unused-vars */
class Utils {

    static createId() {
        function randomChars(){
          return Math.random().toString(16).slice(-4);
        }
        return `${randomChars() + randomChars() + randomChars() }`;
      }

}