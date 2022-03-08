import axios from 'axios';

export const fetchOrderBook = async () => {
    const {data} = await axios.get(process.env.REACT_APP_API_ROOT + '/order-book');
    return data;
};

