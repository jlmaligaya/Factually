import { prisma } from '../db'
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from '../components/layout'
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';


export default function Home({user, actv}) {
  const {data: session, status} = useSession();
  console.log(session)
  const router = useRouter();
  const experience = user.exp 
  
 
  if (status === "authenticated"){
    return (
      <>
        
        <div>
        <h1 class="mb-4 px-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">Welcome to <span class="text-transparent bg-clip-text bg-gradient-to-r to-red-400 from-indigo-800">{session.user.name}</span></h1>
        <div className="lg:max-h-screen p-4 flex flex-col-reverse lg:flex-row justify-evenly gap-4">
          <div className="grow bg-white lg:row-span-2 lg:col-span-2 p-10 overflow-auto scrollbar scrollbar-thumb-red-500 scrollbar-track-slate-300">
          
          {actv.map(item => (
            <div className="topic-border">
            <p className="topic-header">{item.topic}</p>
            <div className="-z-50 flex flex-row gap-4 overflow-x-auto scrollbar scrollbar-thumb-red-500">
              <div className="card w-80 h-30 bg-base-100 shadow-xl">
                <figure><img src={item.img} /></figure>
                <div className="card-body">
                  <h2 className="card-title">{item.activity}</h2>
                  <p>{item.desc}</p>
                  <div className="card-actions justify-end">
                    <Link href={`/activities/${item.aid}`}>
                      <button className="btn bg-red-500 hover:bg-red-600 text-white">Start</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))}
                             
          </div>
  
          <div className="">
            <div className="grid grid-row">
            <div className="flex flex-col py-5 items-center">
              <p className="text-2xl text-black font-extrabold mb-5">Current Level</p>
              <div className="flex flex-row items-center divide-x-2 divide-red-500 mb-5">
                <p className="text-lg text-black font-extrabold">Level {user.level}</p>
              </div>
              <div className="radial-progress bg-green-500 text-primary-content font-bold text-3xl border-4 border-green-500" style={{"--value":experience, "--size": "12rem"}}>{experience}/100</div>
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
                    <p>Mission 2</p>
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
                <button class="w-full bg-red-500 text-white rounded-md border p-2 transition hover:opacity-60">View all</button>
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

  const [user, actv] = await prisma.$transaction([
    prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    }),
    prisma.activities.findMany(),
  ])




  return {
    props: {
      user, actv
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