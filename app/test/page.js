import { SignUp } from '../components';
const Page = async () => {

    async function create(data) {
        "use server"
        console.log(data);
    }

    return (
        <>
            <div>test</div>
            <SignUp create={create} />
        </>
    )
}

export default Page