import axios, { AxiosResponse } from "axios";
import { serverUrl } from "../utils/env";

export async function getData<Data>(
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
