export default class User {
  constructor ({ email, password, fullName, profileImageUrl } = {}) {
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.profileImageUrl = profileImageUrl;
  }
}
