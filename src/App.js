import { useEffect, useState } from 'react';
import { fetchOrderBook } from './api.service';
import './App.scss';

function App() {
  const [lastUpdated, setLastUpdated] = useState(null);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  const handleOrderBookData = (data) => {
    setOrderBook(data);
    setLastUpdated((new Date()).toString());
  };

  useEffect(() => {
    fetchOrderBook().then(handleOrderBookData);

    let socket;
    const connectWebsocket = () => {
      socket = new WebSocket(process.env.REACT_APP_WS_ROOT + '/depth');
      socket.onmessage = function ({ data }) {
        handleOrderBookData(JSON.parse(data));
      };
      socket.onclose = function (event) {
        if (event.wasClean) {
          console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
          console.log(`[close] Connection died, code=${event.code}`);
          setTimeout(connectWebsocket, 5000); // retry connection
        }
      };
      socket.onerror = function (error) {
        console.log(`[error]`, error);
      };
    };
    connectWebsocket();

    return () => {
      socket.close();
    };
  }, [])

  return (
    <div className="App">
      <header>
        Simulation of ETHBTC market order book from Binance exchange. It is updated every 5 seconds. <br/>
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
