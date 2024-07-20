'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

const fetchCoinData = async () => {
  try {
    // Replace this URL with your API endpoint for fetching coin data
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    return response.data; // Returns a list of coins with their basic info
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return [];
  }
};

function CoinSearch() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchCoinData();
      setCoins(data);
      setFilteredCoins(data);
    };

    getData();
  }, []);

  useEffect(() => {
    const results = coins.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCoins(results);
  }, [searchTerm, coins]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for a coin..."
        className="w-full px-3 py-2 border border-gray-300 rounded"
        onChange={handleSearch}
        value={searchTerm}
      />

      {/* Coin Information Table */}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Symbol</th>
            <th className="border border-gray-300 px-4 py-2">ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredCoins.map((coin) => (
            <tr key={coin.id}>
              <td className="border border-gray-300 px-4 py-2">{coin.name}</td>
              <td className="border border-gray-300 px-4 py-2">{coin.symbol}</td>
              <td className="border border-gray-300 px-4 py-2">{coin.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CoinSearch;
