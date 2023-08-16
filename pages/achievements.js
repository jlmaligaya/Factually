
import Layout from '../components/Layout'
// import { prisma } from '../db'


export default function Achievements({data}) {
    let checkCompletion = arr => arr.every(v => v === true);
    let complete = checkCompletion([data.achv_1, data.achv_2, data.achv_3])
    
    return (
          <div className='p-5 bg-white rounded'>
          <p className='text-3xl m-14 font-black text-slate-900 mb-5'>Achievements</p>
          <div className='grid md:grid-flow-row lg:grid-cols-4 gap-6 mr-24'>

            <div 
              className={`m-14 w-72 h-72 h-200 bg-white rounded-lg shadow-md flex gap-4 flex-col items-center ${
                data.achv_1 == true
                ? "border-green-400 border-4"
                : "border-grey-400 border-2"
              }`}>
              <img className='h-1/3 w-1/3 mt-6' src='https://cdn-icons-png.flaticon.com/512/2317/2317441.png'></img>
              <p className='text-lg font-black text-slate-900 mb-5'>Achievement 1</p>
              <p className='text- mx-3 font-semibold text-slate-900 mb-5'>Cras iaculis ultricies nulla.</p>
            </div>

            <div 
              className={`m-14 w-72 h-72 h-200 bg-white rounded-lg shadow-md flex gap-4 flex-col items-center ${
                data.achv_2 == true
                ? "border-green-400 border-4"
                : "border-grey-400 border-2"
              }`}>
              <img className='h-1/3 w-1/3 mt-6' src='https://cdn-icons-png.flaticon.com/512/2317/2317441.png'></img>
              <p className='text-lg font-black text-slate-900 mb-5'>Achievement 2</p>
              <p className='text- mx-3 font-semibold text-slate-900 mb-5'>Cras iaculis ultricies nulla.</p>
            </div>

            <div 
              className={`m-14 w-72 h-72 h-200 bg-white rounded-lg shadow-md flex gap-4 flex-col items-center ${
                data.achv_3 == true
                ? "border-green-400 border-4"
                : "border-grey-400 border-2"
              }`}>
              <img className='h-1/3 w-1/3 mt-6' src='https://cdn-icons-png.flaticon.com/512/2317/2317441.png'></img>
              <p className='text-lg font-black text-slate-900 mb-5'>Achievement 3</p>
              <p className='text- mx-3 font-semibold text-slate-900 mb-5'>Cras iaculis ultricies nulla.</p>
            </div>
            
            {/*Still not connected to db*/}
            <div 
              className={`m-14 w-72 h-72 h-200 bg-white rounded-lg shadow-md flex gap-4 flex-col items-center ${
                data.achv_1 == true
                ? "border-green-400 border-4"
                : "border-grey-400 border-2"
              }`}>
              <img className='h-1/3 w-1/3 mt-6' src='https://cdn-icons-png.flaticon.com/512/2317/2317441.png'></img>
              <p className='text-lg font-black text-slate-900 mb-5'>Achievement 4</p>
              <p className='text- mx-3 font-semibold text-slate-900 mb-5'>Cras iaculis ultricies nulla.</p>
            </div>

            <div 
              className={`m-14 w-72 h-72 h-200 bg-white rounded-lg shadow-md flex gap-4 flex-col items-center ${
                data.achv_2 == true
                ? "border-green-400 border-4"
                : "border-grey-400 border-2"
              }`}>
              <img className='h-1/3 w-1/3 mt-6' src='https://cdn-icons-png.flaticon.com/512/2317/2317441.png'></img>
              <p className='text-lg font-black text-slate-900 mb-5'>Achievement 5</p>
              <p className='text- mx-3 font-semibold text-slate-900 mb-5'>Cras iaculis ultricies nulla.</p>
            </div>

            <div 
              className={`m-14 w-72 h-72 h-200 bg-white rounded-lg shadow-md flex gap-4 flex-col items-center ${
                data.achv_3 == true
                ? "border-green-400 border-4"
                : "border-grey-400 border-2"
              }`}>
              <img className='h-1/3 w-1/3 mt-6' src='https://cdn-icons-png.flaticon.com/512/2317/2317441.png'></img>
              <p className='text-lg font-black text-slate-900 mb-5'>Achievement 6</p>
              <p className='text- mx-3 font-semibold text-slate-900 mb-5'>Cras iaculis ultricies nulla.</p>
            </div>

            <div 
              className={`m-14 w-72 h-72 h-200 bg-white rounded-lg shadow-md flex gap-4 flex-col items-center ${
                complete == true
                ? "border-green-400 border-4"
                : "border-grey-400 border-2"
              }`}>
              <img className='h-1/3 w-1/3 mt-6' src='https://cdn-icons-png.flaticon.com/512/2317/2317441.png'></img>
              <p className='text-lg font-black text-slate-900 mb-5'>Ultimate Achievement</p>
              <p className='text- mx-3 font-semibold text-slate-900 mb-5'>Complete all achievements.</p>
            </div>
            
          </div> 
        </div>   

    );
  }

  export async function getServerSideProps() {
    
    //const data = await prisma.achievements.findUnique({ where: {id: "ACV000001"} });
    const data = {
      achv_1: true,
      achv_2: false,
      achv_3: true
    }
  
    return {
      props: {
        data
      }
    }
  }

  Achievements.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }