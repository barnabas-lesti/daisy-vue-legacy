export default class User {
  constructor ({ id, email, password, fullName, profileImageUrl } = {}) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.profileImageUrl = profileImageUrl;
  }
}
