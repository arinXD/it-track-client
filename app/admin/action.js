import axios from 'axios'
import { hostname } from '@/app/api/hostname'
import { getToken } from '@/app/components/serverAction/TokenAction'

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
            signal: AbortController.signal
        })
        let data = res.data?.data;
        data = data?.length ? data : [];
        return data;
    } catch (error) {
        console.error(error);
        return []
    }
}

export async function fetchDataObj(url) {
    try {
        const token = await getToken()
        const res = await axios.get(`${hostname}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `${token}`,
            },
        })
        const data = res.data?.data || {}
        return data;
    } catch (error) {
        console.error(error);
        return {}
    }
}