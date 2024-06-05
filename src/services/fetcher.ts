import axios, { AxiosResponse } from "axios";
import { serverUrl } from "../utils/env";

export async function getAudio<Data>(
    videoID: string
): Promise<Data> {
    const serverURL = serverUrl
    const url = `https://www.youtube.com/watch?v=${videoID}`;
    try {
        const response: AxiosResponse<Data> = await axios.get(`${serverURL}download`, {
            params: { url },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function getData<Data, Key extends string>(
    url: Key,
): Promise<Data> {
    try {
        const response: AxiosResponse<Data> = await axios.get(url);
  
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export async function getDataWithArgs<
    Data,
    Key extends string,
    ExtraArgs extends object,
>(url: Key, { arg }: { arg: ExtraArgs }): Promise<Data> {
    try {
        let queryString = '';
        for (const [key, value] of Object.entries(arg)) {
            queryString += `&${key}=${value}`;
        }
        const response: AxiosResponse<Data> = await axios.get(`${url}?${queryString.replace('&', '')}`);

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}