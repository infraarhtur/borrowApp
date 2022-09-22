import { UsersInterface } from './users.interface';
export class UserModel{

static fromFirebase({email, uid,name,lastName}){
    return new UserModel(uid,name,lastName,email)
}

    constructor(
        public uid:string,
        public name:string,
        public lastName:string,
        public email:string,
    ){}
}