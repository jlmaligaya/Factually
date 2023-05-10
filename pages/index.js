import { prisma } from '../db'
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from '../components/layout'
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import stars from '../components/stars';
import { useState } from 'react';


export default function Home({data, actv}) {
  const {data: session, status} = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
 

  function handlePlayClick() {
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
  }
  
 
  if (status === "authenticated"){
    const experience = session.user.exp
    const level = session.user.level
    
    return (
      <>
        <div>
        <h1 className="mb-4 px-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r to-red-400 from-indigo-800">Factually</span>, {session.user.firstName}</h1>
        <div className="lg:max-h-screen p-4 flex flex-col-reverse lg:flex-row justify-evenly gap-4">
          <div className="grow max-w-6xl h-screen bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-10">
            
            {actv.map(item => (
              <div className="bg-white shadow-xl h-max md:max-h-80 rounded-md overflow-hidden">
              <img className="object-cover w-full h-40" src={item.img} alt="Card Image"/>
              <div className="p-4">
                <h2 className="text-xl font-medium mb-2 text-black">{item.topic}</h2>
                
                <div className="flex items-center mb-4">
                  <span className="text-yellow-400 mr-1">&#9733;</span>
                  <span className="text-yellow-400 mr-1">&#9733;</span>
                  <span className="text-yellow-400">&#9733;</span>
                </div>
                <Link href={`/activities/${item.aid}`}>
                      <button className="btn bg-red-500 hover:bg-red-600 text-white transform active:scale-75 transition-transform">Start</button>
                  </Link>
              </div>
            </div>
             
            ))}
            {showModal && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-10">
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
    <div className="bg-white rounded-md p-4 z-20">
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.5 5A2.5 2.5 0 0 1 5 2.5h10A2.5 2.5 0 0 1 17.5 5v10a2.5 2.5 0 0 1-2.5 2.5h-10A2.5 2.5 0 0 1 2.5 15v-10zm12.5 2.5h-5v-2.5h5v2.5zm0 5h-5v-2.5h5v2.5z" clipRule="evenodd" />
        </svg>
        <h2 className="text-xl font-medium text-black">Level Description</h2>
      </div>
      <p className="text-gray-500 mb-4 max-w-sm">
      Suspendisse dictum luctus commodo. Integer viverra, tortor vitae tincidunt dapibus, ex velit commodo turpis, non pellentesque ex elit eu augue. Nam mollis nisi euismod, tincidunt ipsum sit amet, gravida eros. Donec et arcu et enim mollis pellentesque. Curabitur interdum elit quam, at malesuada ex cursus vel.
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleModalClose}
      >
        Proceed
      </button>
    </div>
  </div>
)}
            
                          
          </div>
  
          <div className="">
            <div className="grid grid-row">
            <div className="flex flex-col py-5 items-center">
              <p className="text-2xl text-black font-extrabold mb-5">Current Level</p>
              <div className="flex flex-row items-center divide-x-2 divide-red-500 mb-5">
                <p className="text-lg text-black font-extrabold">Level {level}</p>
              </div>
              <div className="radial-progress bg-green-500 text-primary-content font-bold text-3xl border-4 border-green-500" style={{"--value":level, "--size": "12rem"}}>{experience}/100</div>
            </div>
          </div>
  
          <div className="bg-white rounded-lg border-slate-400 border-2 text-black text-sm">
            <div className="flex flex-col p-5 divide-y border-gray-300">
              <div className="flex items-center justify-between space-x-6 p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-2">
                    <p>Mission 1</p>
                    <p>Aliquam tincidunt mauris eu risus.</p>
                  </div>
                </div>
                <div>
                  <p>0/5</p>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-6 p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-2">
                    <p>Mission 2</p>
                    <p>Aliquam tincidunt mauris eu risus.</p>
                  </div>
                </div>
                <div>
                  <p>0/5</p>
                </div>
              </div>
              <div className="flex items-center justify-between space-x-6 p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-2">
                    <p>Mission 3</p>
                    <p>Aliquam tincidunt mauris eu risus.</p>
                  </div>
                </div>
                <div>
                  <p>0/5</p>
                </div>
              </div>
              <Link href="/achievements">
              <div>
                <button className="w-full bg-red-500 text-white rounded-md border p-2 transition hover:opacity-60">View all</button>
              </div>
              </Link>
            </div>
          </div>
            </div>
            
         
  
        </div>
        </div>
        
      </>
    );
    
  }
  
}

export async function getServerSideProps(context) {
  
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signIn',
        permanent: false,
      },
    }
  }

  const actv = await prisma.activities.findMany({
    orderBy: [{
      aid: 'asc'
    }]
  })

  


  return {
    props: {
      actv
    }
  }
}


Home.getLayout = function getLayout(page) {
  return (
      <Layout>
      {page}
      </Layout>
  )
  }