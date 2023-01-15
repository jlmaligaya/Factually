import Link from "next/link";
import { useRouter } from "next/router";
import Layout from '../components/layout'


export default function Home() {
  const router = useRouter();

  return (
    <>
      <p className="text-4xl text-black font-extrabold p-4">Welcome to Factually!</p>
      
      <div className="h-50">
      <div className="lg:p-4 grid grid-flow-row lg:grid-cols-3 gap-6">
        <div className="bg-white lg:row-span-2 lg:col-span-2 p-10 overflow-auto scrollbar scrollbar-thumb-red-500 scrollbar-track-slate-300">
        
          <div className="topic-border">
            <p className="topic-header">Topic 1</p>
            <div className="-z-50 flex flex-row gap-4 overflow-x-auto scrollbar scrollbar-thumb-red-500">
              <div className="card w-80 h-30 bg-base-100 shadow-xl">
                <figure><img src="https://s3-ap-south-1.amazonaws.com/ricedigitals3bucket/AUPortalContent/2020/07/02030224/mediaimgblog.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Activity 1</h2>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
                  <div className="card-actions justify-end">
                    <button className="btn bg-red-500 hover:bg-red-600 text-white">Start</button>
                  </div>
                </div>
              </div>
              <div className="card w-80 h-30 bg-base-100 shadow-xl">
                <figure><img src="https://s3-ap-south-1.amazonaws.com/ricedigitals3bucket/AUPortalContent/2020/07/02030224/mediaimgblog.jpg" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Activity 2</h2>
                  <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
                  <div className="card-actions justify-end">
                    <button className="btn bg-red-500 hover:bg-red-600 text-white">Start</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>

        <div>
          <div className="flex flex-col py-5 items-center">
            <p className="text-2xl text-black font-extrabold mb-5">Current Level</p>
            <div className="flex flex-row items-center divide-x-2 divide-red-500 mb-5">
              <p className="text-lg text-black font-extrabold">Level 1</p>
            </div>
            <div className="radial-progress bg-green-500 text-primary-content font-bold text-3xl border-4 border-green-500" style={{"--value":25, "--size": "12rem"}}>25/100</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border-slate-400 border-2 text-black text-sm">
          <div className="flex flex-col p-5 divide-y border-gray-300">
            <div class="flex items-center justify-between space-x-6 p-6">
              <div class="flex items-center space-x-4">
                <div class="flex flex-col space-y-2">
                  <p>Mission 1</p>
                  <p>Aliquam tincidunt mauris eu risus.</p>
                </div>
              </div>
              <div>
                <p>0/5</p>
              </div>
            </div>
            <div class="flex items-center justify-between space-x-6 p-6">
              <div class="flex items-center space-x-4">
                <div class="flex flex-col space-y-2">
                  <p>Mission 1</p>
                  <p>Aliquam tincidunt mauris eu risus.</p>
                </div>
              </div>
              <div>
                <p>0/5</p>
              </div>
            </div>
            <div class="flex items-center justify-between space-x-6 p-6">
              <div class="flex items-center space-x-4">
                <div class="flex flex-col space-y-2">
                  <p>Mission 1</p>
                  <p>Aliquam tincidunt mauris eu risus.</p>
                </div>
              </div>
              <div>
                <p>0/5</p>
              </div>
            </div>
            <Link href="/achievements">
            <div>
              <button class="w-full bg-red-500 text-white rounded-md border p-2 transition hover:opacity-60">View all</button>
            </div>
            </Link>
          </div>
        </div>
       

      </div>
      </div>
      
    </>
  );
}

Home.getLayout = function getLayout(page) {
  return (
      <Layout>
      {page}
      </Layout>
  )
  }