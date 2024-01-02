import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchDataObj } from '../../action'
import TrackSelectDetail from './TrackSelectDetail'

const page = async ({ params }) => {
    const { id } = params
    const trackSelect = await fetchDataObj(`/api/tracks/selects/${id}/subjects/students`)
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                <TrackSelectDetail trackSelect={trackSelect} />
            </ContentWrap>
        </>
    )
}

export default page