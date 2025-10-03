import axios from 'axios';

export interface ICreateData {
    docId: String,
	name: String,
	email: string,
	role: String,
	modules: Array<String>,
    password: String
}

export interface INewUser {
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

async function createUser(props: ICreateData) {
    const { docId, name, email, role, modules, password } = props;

    const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user/create`,
        { docId, name, email, role, modules, password },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    return response.data;
}

export default createUser;