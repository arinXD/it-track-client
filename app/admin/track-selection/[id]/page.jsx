import { Navbar, Sidebar, ContentWrap, BreadCrumb } from '@/app/components'
import { fetchDataObj } from '../../action'
import TrackSelectDetail from './TrackSelectDetail'

const page = async ({ params, searchParams }) => {
    const id = searchParams.track_select_id
    const trackSelect = await fetchDataObj(`/api/tracks/selects/${id}/subjects/students`)
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <ContentWrap>
                <BreadCrumb />
                {trackSelect ? <TrackSelectDetail trackSelect={trackSelect} />
                    : <p>No data</p>}
            </ContentWrap>
        </>
    )
}

export default page