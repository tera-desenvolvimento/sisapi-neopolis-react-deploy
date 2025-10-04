import axios from 'axios';

export interface IUpdateUserData {
    userId: String,
    name: String,
    email: String,
    docId: String,
    modules: Array<String>
}

async function updateUser(props: IUpdateUserData) {
    const { userId, name, email, docId, modules } = props;

    const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/user/update/${userId}`,
        {
            data: {
                name,
                email,
                docId,
                modules
            }
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    return response.data;
}

export default updateUser;