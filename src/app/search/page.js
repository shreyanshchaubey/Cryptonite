'use client'

import { useEffect, useState, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function SearchComponent() {
  const [coins, setCoins] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchData = searchParams.get('q');

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/search?query=' + searchData);
        setCoins(response.data.coins);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    if (searchData) {
      fetchSearchData();
    }
  }, [searchData]);

  const handleRowClick = (id) => {
    router.push(`/coin/${id}`);
  };

  return (
    <div>
      <Table>
        <TableCaption>Search results for &quot;{searchData}&quot;</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Symbol</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map((coin) => (
            <TableRow key={coin.id} onClick={() => handleRowClick(coin.id)} style={{ cursor: 'pointer' }}>
              <TableCell className="font-medium">{coin.id}</TableCell>
              <TableCell>{coin.name}</TableCell>
              <TableCell>{coin.symbol}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total Results: {coins.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent />
    </Suspense>
  );
}

