module.exports = class Users {
    constructor() {
        this.users = []
    }

    addUser(id, username, room) {
        let user = {id, username, room};
        this.users.push(user);
        return user;
    }
    removeUser(id) {
        let user = this.getUser(id);
        if(user) this.users = this.users.filter(user => user.id !== id) 
        return user
    }
    getUser(id) {
        return this.users.filter(user => user.id === id)[0]
    }
    getUsersList(room) {
        let users = this.users.filter(user => user.room === room); // All users
        let namesArray = users.map(user => user.username); 
        return namesArray // return users username
    }
}   