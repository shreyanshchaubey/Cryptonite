'use client'

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

export default function ExplorePage() {
  const router = useRouter();
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
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
          <TableHead className='w-[100px]'>Image</TableHead>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Market Cap Rank</TableHead>
          <TableHead className="text-right">24H Price Change (USD)</TableHead>
          <TableHead className="text-right">Price (BTC)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coins.map((coin) => (
          <TableRow key={coin.item.id} onClick={() => { router.push(`/coin/${coin.item.id}`) }} style={{ cursor: 'pointer' }}>
            <TableCell className='font-medium'>
              <Image
                src={coin.item.thumb}
                alt={coin.item.name}
                className='rounded-lg'
                width={50}
                height={50}
              />
            </TableCell>
            <TableCell className="font-medium">{coin.item.name}</TableCell>
            <TableCell>{coin.item.symbol}</TableCell>
            <TableCell>{coin.item.market_cap_rank}</TableCell>
            <TableCell className="text-right">
              {coin.item.price_change_percentage_24h_in_currency
                ? `${coin.item.price_change_percentage_24h_in_currency.usd}%`
                : 'N/A'}
            </TableCell>
            <TableCell className='text-right'>{coin.item.price_btc}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total Coins</TableCell>
          <TableCell className="text-right">{coins.length}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
