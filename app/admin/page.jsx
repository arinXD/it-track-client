import { Navbar, Sidebar, BreadCrumb, ContentWrap } from '../components';
import AdminList from './AdminList';

const Page = async () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap className={"!p-0"}>
                <AdminList />
            </ContentWrap>
        </>
    )
}

export default Page;