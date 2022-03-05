import {useEffect, useState} from 'react';
import {fetchOrderBook} from './api.service';
import './App.scss';

function App() {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [orderBook, setOrderBook] = useState({bids: [], asks: []});

  const setNewOrderBook = (data) => {
    setOrderBook(data);
    setLastUpdated((new Date()).toString());
  };

  useEffect(() => {
    fetchOrderBook().then(setNewOrderBook);

    const socket = window.io(process.env.REACT_APP_SERVER_URL);
    socket.on('OrderBookGenerated', data => {
      setNewOrderBook(data);
    });
  }, [])

  return (
    <div className="App">
      <header>
        Last Updated At: {lastUpdated}
      </header>
      <div className="order-book-container">
        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Bid</th>
              </tr>
            </thead>
            <tbody>
              {orderBook.bids.map((order, i) => (
                <tr key={i}>
                  <td>{order[1]}</td>
                  <td>{order[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total value (size * price) &lt; 5</p>
        </div>
        <div className="order-table-container">
          <table className="order-table">
            <thead>
              <tr>
                <th>Ask</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {orderBook.asks.map((order, i) => (
                <tr key={i}>
                  <td>{order[0]}</td>
                  <td>{order[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Total size &lt; 150</p>
        </div>
      </div>
    </div>
  );
}

export default App;
