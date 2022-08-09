declare namespace Express{
    interface Request{
        user: any
    }
}

interface IUser {
    name: string,
    email: string,
    photo?: string,
    password: string,
    passwordConfirm?: string,
    passwordChangedAt?: string
   }