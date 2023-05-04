import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/layout'



export default function Account(data) {
    const {data: session, status} = useSession();
    return (
        <div class="flex items-center justify-center h-screen">
            <div class="bg-white min-h-screen rounded-md lg:w-1/2 font-raleway pt-2 shadow-sm my-16">
                <div class="container mx-auto">
                    <div class="inputs w-full max-w-2xl p-6 mx-auto">
                        <h2 class="text-2xl text-gray-900">Account Settings</h2>
                        <form class="mt-6 border-t border-gray-400 pt-4">
                            <div class='flex flex-wrap -mx-3 mb-6'>
                                <div class='w-full md:w-full px-3 mb-6'>
                                    <label class='text-label' for='grid-text-1'>Email</label>
                                    <input class='text-box' id='grid-text-1' type='text' placeholder={session.user.email} required/>
                                </div>
                                <div class='w-full md:w-full px-3 mb-6'>
                                    <label class='text-label' for='grid-text-1'>Password</label>
                                    <input class='text-box' id='grid-text-1' type='password' placeholder='Enter password'  required/>
                                </div>
                                <div class="personal w-full pt-4">
                                    <div class="flex items-center justify-between mt-4">
                                        <div class='w-full md:w-1/2 px-3 mb-6'>
                                            <label class='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' >first name</label>
                                            <input class='text-box' type='text' placeholder={session.user.firstName} disabled/>
                                        </div>
                                        <div class='w-full md:w-1/2 px-3 mb-6'>
                                            <label class='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2' >last name</label>
                                            <input class='text-box' type='text' placeholder={session.user.lastName} disabled/>
                                        </div>
                                    </div>
                                    <div class='w-full md:w-full px-3 mb-6'>
                                        <label class='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>user name</label>
                                        <input class='text-box' type='text' placeholder={session.user.username} required/>
                                    </div>
                                    <div class="flex justify-end">
                                        <button class="appearance-none bg-red-500 w-full text-white px-2 py-3 shadow-sm border rounded-full hover:bg-red-600 mr-3 sm-3 transition-colors" type="submit">Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      
    );
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




 return {
    props: {},
  }
  
}

  Account.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }