import axios from 'axios'
import {
    hostname
} from '@/app/api/hostname'
import {
    getToken
} from '@/app/components/serverAction/TokenAction'

export async function fetchData(url) {
    try {
        const token = await getToken()
        // console.log("admin token:", token);
        const res = await axios.get(`${hostname}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
            },
        })
        let data = res.data.data;
        data = data.length ? data : [];
        return data;
    } catch (error) {
        console.error(error);
        return []
    }
}