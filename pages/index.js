import { prisma } from '../db'
import Layout from '../components/Layout'
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';


export default function Home({data, actv}) {
  const {data: session, status} = useSession();

 
  
 
  if (status === "authenticated"){
    // const experience = session.user.exp
    // const level = session.user.level
    
    return (
      <>
        <div>
          <h1 className="text-3xl pt-10 text-zinc-50 text-center font-extrabold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-white md:text-3xl lg:text-4xl">Welcome to Factually, {session.user.firstName}</h1>
          <div>
            <div class="container">
              <div class="flex space-x-10">
              {actv.map((item, index) => (
              <div className="circle" key={item.id}>
                <div className="flex items-center justify-center h-40 w-40 m-5 rounded-full transition delay-100 bg-sky-500 hover:bg-sky-700">
                  <img class="" src={item.img}></img>
                </div>
                <div className="grid grid-flow-col gap-3 ml-10">
              <div className="flex h-8 w-8 items-center rounded-full bg-yellow-500">
                {/* Star 1 */}
              </div>
              <div className="flex h-8 w-8 items-center rounded-full bg-yellow-500">
                {/* Star 2 */}
              </div>
              <div className="flex h-8 w-8 items-center rounded-full bg-yellow-500">
                {/* Star 3 */}
              </div>
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