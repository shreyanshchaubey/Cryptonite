import HomeChartCard from '@/components/HomeChartCard';
import HomeTrendingCard from '@/components/HomeTrendingCard';
import Watchlist from '@/components/Watchlist';
import CoinChart from '@/components/CoinChart';
import CoinSearch from '@/components/CoinSearch'; 



// export default function HomePage() {
//   return (
//     <div className='flex flex-col md:flex-row max-w-[100vw] mt-10 ml-10'>
//       <div className='flex-grow'>
//         <HomeChartCard />
//         <HomeTrendingCard />
//         {/* <CoinChart /> */}
//         <div className='block md:hidden mr-10'>
//           <Watchlist />
//         </div>
//       </div>
//       <div className='w-[35vw] ml-10 hidden md:block mr-10'>
//         <Watchlist />
//       </div>
//     </div>
//   )
// }

export default function HomePage() {
  return (
    <div className='flex flex-col md:flex-row max-w-[100vw] mt-10 ml-10'>
      {/* Coin Search Component */}
      <div className='mb-6'>
      </div>

      <div className='flex-grow'>
        <HomeChartCard />
        <HomeTrendingCard />
        {/* <CoinChart /> */}
        <div className='block md:hidden mr-10'>
          <Watchlist />
        </div>
      </div>

      <div className='w-[35vw] ml-10 hidden md:block mr-10'>
        <Watchlist />
      </div>
    </div>
  );
}