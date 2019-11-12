export interface Authorization {
    isAuth: boolean,
    firstname?: string,
    lastname?: string,
    token?: string
}

export interface Profile {
    theme: string,
    tenant: string
}

export interface Message {
    name: string,
    signal: boolean,
    data?: any
}