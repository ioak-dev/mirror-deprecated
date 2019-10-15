export interface Authorization {
    isAuth: boolean,
    firstname?: string,
    lastname?: string
}

export interface Profile {
    theme: string,
    tenant: string,
    searchText: string
}

export interface Message {
    name: string,
    signal: boolean,
    data?: any
}