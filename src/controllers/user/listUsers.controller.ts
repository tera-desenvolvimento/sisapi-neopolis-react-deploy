import axios from "axios";

export interface IResponse {
    response: IUser;
    data: IUser[];
    status: number;
    message: string;
}

export interface IUser {
    _id: String,
    userId: String,
    docId: String,
    email: String,
    name: String,
    role: String,
    isActive: Boolean,
    modules: Array<String>,
    password: String
}

async function listUsers() {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/user/list`
        );
        return response.data;
    } catch (error) {
        return { error: "Internal server error" };
    }
}

export default listUsers;
