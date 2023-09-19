import { prisma } from '../db';
import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from "next-auth/react"

export default function Home({ data, actv }) {
  const { data: session, status } = useSession();
  const router = useRouter(); 
  const [hoveredCircle, setHoveredCircle] = useState(null);
  

  if (status === "authenticated") {
    return (
      <>
        <div>
        <div className="flex justify-between items-center pt-20">
          {/* Settings icon */}
          <a href="#" onClick={signOut}>
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#5A5A5A" class="w-10 h-10 transform hover:animate-spin">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </a>
          <div className='flex flex-row select-none'>
            <img src="/assets/r_hi.svg" className='h-50 w-20 animate-bounce' alt="Description" /><h1 className="mb-4 px-4 font-retropix text-white dark:text-white md:text-3xl lg:text-5xl select-none">Welcome to <span className="select-none animate-text bg-gradient-to-r from-red-800 via-blue-500 to-white bg-clip-text text-transparent text-5xl font-heading">Factually</span>, {session.user.firstName}</h1>
          </div>
          {/* Logout icon */}
          <a href="#" onClick={signOut}>
          <div className="w-16 h-16 bg-red-500 rounded-3xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="2" stroke="white" class="w-10 h-10">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              </div>
            </a>
        </div>
          <div>
            <div className="container">
              <div className="flex space-x-10 item">
                {actv.map((item, index) => (
                  <div className="circle select-none" key={item.id}
                    onMouseEnter={() => setHoveredCircle(index)}
                    onMouseLeave={() => setHoveredCircle(null)}
                    onClick={() => router.push(`/activities/${item.aid}`)}
                  >
                    <div className={`circle-content h-40 w-40 rounded-full relative group transition delay-100 bg-white${hoveredCircle === index ? 'hovered' : ''}`}>
                      <img className="absolute inset-0 object-cover w-full h-full" src={item.img} alt={`Activity ${index + 1}`} />
                      <div className={`overlay absolute inset-0 flex items-center text-5xl font-retropix justify-center ${hoveredCircle === index ? 'hidden' : ''}`}>
                        {index + 1}
                      </div>
                      <div className={`overlay play-button absolute inset-0 flex items-center justify-center ${hoveredCircle === index ? '' : 'hidden'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                      </div>
                    </div>
                    <div className="grid grid-flow-col gap-3 ml-10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#FFD700" viewBox="0 0 24 24" class="w-8 h-8">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#FFD700" viewBox="0 0 24 24" class="w-8 h-8">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#FFD700" viewBox="0 0 24 24" class="w-8 h-8">
                      <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>

                    </div>
                  </div>
                ))}
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