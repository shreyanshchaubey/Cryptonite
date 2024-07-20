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
} from '@/components/ui/table'; // Adjust the import path based on your project structure

function TableDemo() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
        console.log(response);
        setCoins(response.data.coins);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchTableData();
  }, []);

  return (
    <Table className="mt-10 border rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Market Cap Rank</TableHead>
          <TableHead className="text-right">Price (BTC)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coins.map((coin) => (
          <TableRow key={coin.item.id}>
            <TableCell className="font-medium">{coin.item.name}</TableCell>
            <TableCell>{coin.item.symbol}</TableCell>
            <TableCell>{coin.item.market_cap_rank}</TableCell>
            <TableCell className="text-right">{coin.item.price_btc}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="text-right">{coins.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default TableDemo;
