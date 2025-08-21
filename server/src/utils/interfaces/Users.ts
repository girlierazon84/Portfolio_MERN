export interface CreateNewUser {
    firstname: string
    lastname: string
    email: string
    username: string
    password: string
    role?: 'user' | 'admin'
}