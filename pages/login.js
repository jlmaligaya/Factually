import { useRouter } from "next/router";

export default function Login() {

    const router = useRouter()

    return (
        <>
            <section className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="bg-gray-200 flex rounded-xl shadow-lg p-5">

                    <div className="md:w-1/2 px-8 mt-16">
                        <h2 className="font-bold text-3xl text-[#1C3253]">Sign In</h2>
                        <p className="mt-3 text-[#1C3253] font-medium"> Connect and continue your progress. </p>
                                        
                        <form action="" className="flex flex-col gap-4">
                            <input required className = "p-2 mt-8 rounded-full border focus:outline-none focus:border-[#1C3253] focus:ring-1 focus:ring-[#1C3253] invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500" type="email" name="email" placeholder="Email" />

                            <input required className = "p-2 rounded-full border w-full focus:outline-none focus:border-[#1C3253] focus:ring-1 focus:ring-[#1C3253]" type="password" name="password" placeholder="Password" />     

                            <button className="bg-[#CE4044] hover:bg-[#1C3253] rounded-full text-white py-2 mt-3"> Sign In </button>
                        
                        </form>

                        <div className="mt-10 grid grid-cols-3 items-center text-gray-50">
                            <hr className="border-gray-500" />
                            <p className="text-center text-gray-500"> OR </p>
                            <hr className="border-gray-500" />
                        </div>

                        <p className="mt-5 text-[#1C3253] font-medium"> Don't have an account yet? Join us! </p>

                        <button className="bg-[#CE4044] hover:bg-[#1C3253] border py-2 w-full rounded-full text-white mt-4" onClick={() => router.push('/register')}>Sign Up</button>
                        <hr className="border-gray-500 mt-10" />

                    </div>
                
                    <div className="md:block hidden w-1/2">
                        <img className="rounded-xl" src="logo.png" alt="" />
                    </div>
                
                </div>
            </section>     
        </>

    );
}