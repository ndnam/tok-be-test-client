import axios from 'axios';

export const fetchOrderBook = async () => {
    const {data} = await axios.get(process.env.REACT_APP_SERVER_URL + '/api/order-book');
    return data;
};

