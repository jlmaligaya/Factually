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
 
    function handleCardClick(id) {
    setActiveCard(id);
  }

  function handleCardLeave() {
    setActiveCard(null);
  }


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
  <div key={item.aid} className="group relative cursor-pointer items-center justify-center overflow-scroll-auto transition-shadow hover:shadow-xl hover:shadow-black/30 bg-white shadow-xl h-max md:max-h-80 rounded-md overflow-hidden">
    <div className="h-80 w-full">
      
      <img class="h-full w-full object-cover transition-transform duration-500 group-hover:rotate-3 group-hover:scale-125" src={item.img} alt="Card Image" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black group-hover:from-black/70 group-hover:via-black/60 group-hover:to-black/70">
      </div>
      <div className="absolute inset-0 flex translate-y-[60%] flex-col items-center justify-center px-9 text-center transition-all duration-500 group-hover:translate-y-0">
        <h1 className="font-bold text-white">{item.topic}</h1>
        <p className="mb-3 text-sm italic text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">{item.desc}</p>
      <Link href={`/activities/${item.aid}`}>
        <button className="btn bg-red-500 hover:bg-red-600 text-white transform active:scale-75 transition-transform">Start</button>
      </Link>
      </div>
    </div>
    <div className="p-4">
    <p className="text-sm">Best score: 10</p>
    </div>
  </div>
))}

=        
                          
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