'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import debounce from 'lodash/debounce';

export default function TrendingCoinsTable() {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
        const trendingCoins = response.data.coins.map(coin => ({
          ...coin.item,
          isTrending: true
        }));
        setCoins(trendingCoins);
        setFilteredCoins(trendingCoins);
      } catch (error) {
        console.error('Error fetching trending coins', error);
      }
    };

    fetchTrendingCoins();
  }, []);

  const searchCoins = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`);
      const searchResults = response.data.coins.slice(0, 10).map(coin => ({
        ...coin,
        isTrending: false,
        price_btc: 'N/A' // CoinGecko search API doesn't provide price_btc
      }));
      
      const combinedResults = [...coins.filter(coin => 
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
      ), ...searchResults];
      
      // Remove duplicates based on coin id
      const uniqueResults = Array.from(new Set(combinedResults.map(coin => coin.id)))
        .map(id => combinedResults.find(coin => coin.id === id));
      
      setFilteredCoins(uniqueResults);
    } catch (error) {
      console.error('Error searching coins', error);
    }
    setIsLoading(false);
  };

  const debouncedSearch = debounce(searchCoins, 300);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchTerm(query);
    if (query.length > 1) {
      debouncedSearch(query);
    } else {
      setFilteredCoins(coins);
    }
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for a coin..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleSearch}
          value={searchTerm}
          style={{ color: 'black' }}
        />
      </div>

      {/* Coins Table */}
      <Table className="mt-6 border border-gray-300 rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Image</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Market Cap Rank</TableHead>
            <TableHead className="text-right">Price (BTC)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : (
            filteredCoins.map((coin) => (
              <TableRow 
                key={coin.id} 
                onClick={() => router.push(`/coin/${coin.id}`)}
                className="cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <TableCell className='font-medium'>
                  <Image 
                    src={coin.thumb} 
                    alt={coin.name}
                    width={32}
                    height={32}
                    className='rounded-full'
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {coin.name}
                  {coin.isTrending && <span className="ml-2 text-xs text-blue-500">(Trending)</span>}
                </TableCell>
                <TableCell>{coin.symbol}</TableCell>
                <TableCell>{coin.market_cap_rank || 'N/A'}</TableCell>
                <TableCell className="text-right">{coin.price_btc || 'N/A'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right font-medium">Total Coins</TableCell>
            <TableCell className="text-right font-medium">{filteredCoins.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}