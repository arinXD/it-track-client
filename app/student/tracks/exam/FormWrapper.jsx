"use client"
import TrackBanner from './TrackBanner';
import SuggestionForm from './SuggestionForm';
import { useToggleSideBarStore } from '@/src/store';

const FormWrapper = ({ tracks, form }) => {
    const toggleSideBar = useToggleSideBarStore((state) => state.toggle)
    return (
        <section className={`${toggleSideBar ? 'md:ml-[240px]' : 'md:ml-[77px]'}`}>
            <TrackBanner tracks={tracks} form={form} />
            <SuggestionForm form={form} />
        </section>
    )
}

export default FormWrapper