type User = {
    id: number;
    userName: string;
    email: string;
    password: string;
}


export type GetUser= {
    _id: string;
    userName: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export default User;
