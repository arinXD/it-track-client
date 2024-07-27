import { Navbar, Sidebar, BreadCrumb, ContentWrap } from '../components';
import AdminList from './AdminList';

const Page = async () => {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <AdminList />
            </ContentWrap>
        </>
    )
}

export default Page;