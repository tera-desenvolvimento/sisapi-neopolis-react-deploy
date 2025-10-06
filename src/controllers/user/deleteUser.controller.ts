import axios from 'axios';

async function deleteUser(userId: String) {
    const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/user/delete/${userId}`,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
}

export default deleteUser;