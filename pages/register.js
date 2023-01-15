import Router, { useRouter } from "next/router";
import { useState } from "react";

/*export async function getServerSideProps() {
    const users = await prisma.UserInfo.findMany();
    return {
        props: {
            UserInformation: users
        }
    };
}

async function saveUser(UserInfo) {
    const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(UserInfo)
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json();
}*/

// export default function Register( {UserInformation}) {
    //const [users, setUserData] = useState(UserInformation);
export default function Register() {

    const router = useRouter()

    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async e => {
        if (firstName && lastName && email && password) {
            try {
                const body = {firstName, lastName, email, password: true};
                await fetch('/api/users', {
                    method: "POST",
                    body: JSON.stringify(body),
                });

                await Router.push("/account");
            }
            catch (error){
                console.error(error);
            }
        }
    }
    
    return (      
         <>
            <section class="bg-gray-100 min-h-screen flex items-center justify-center">
                <div class="bg-gray-200 flex rounded-xl shadow-lg p-5">

                    <div class="md:block hidden w-1/2">
                        <img class="rounded-xl" src="logo.png" alt="" />
                    </div>
                
                    <div class="md:w-1/2 px-8 mt-16">
                        <h2 class="font-bold text-3xl text-[#1C3253]">Sign Up</h2>
                        <p class="mt-3 text-[#1C3253] font-medium"> Register below and join Factually today! </p>
                                        
                        <form action="" class="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <div class="grid grid-cols-2 gap-4">
                                <input class = "p-2 mt-8 rounded-full border" type = "text" name = "firstname" placeholder = "First Name" value = {firstName} onChange={(e) => setfirstName(e.target.value)} />                            
                                <input class = "p-2 mt-8 rounded-full border" type = "text" name = "lastname" placeholder = "Last Name" value = {lastName} onChange={(e) => setlastName(e.target.value)} />
                            </div>                    
                            <input class = "p-2 rounded-full border" type="email" name="email" placeholder="Email" value = {email} onChange={(e) => setEmail(e.target.value)} />
                            <input class = "p-2 rounded-full border" type="password" name="password" placeholder="Password" value = {password} onChange={(e) => setPassword(e.target.value)}/>  
                            <input class = "p-2 rounded-full border" type="password" name="confirmPass" placeholder="Confirm Password" />                                   
                            <button class="bg-[#CE4044] hover:bg-[#1C3253] rounded-full text-white py-2 mt-3" onSubmit={async (data, e) => {
                                try {
                                    await saveUser(data);
                                    setUserData([...users, data]);
                                    e.target.reset();
                                } catch (err) {
                                    console.log(err);
                                }
                            }}> Sign Up </button>

                            <button class="bg-[#CE4044] hover:bg-[#1C3253] rounded-full text-white py-2 mt-3" type="submit"> Sign Up </button>
                        
                        </form>

                        <div class="mt-10 grid grid-cols-3 items-center text-gray-50">
                            <hr class="border-gray-500" />
                            <p class="text-center text-gray-500"> OR </p>
                            <hr class="border-gray-500" />
                        </div>

                        <p class="mt-5 text-[#1C3253] font-medium"> Already have an account? Sign in below! </p>

                        <button class="bg-[#CE4044] hover:bg-[#1C3253] border py-2 w-full rounded-full text-white mt-4"  onClick={() => router.push('/login')}>Sign In</button>
                        <hr class="border-gray-500 mt-10" />
                    </div>
                </div>
            
            </section>
        </>
    );
}