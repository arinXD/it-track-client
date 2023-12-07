

// category.js
import { Navbar, Sidebar } from '@/app/components';

export default async function Category() {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <div className='mt-16'>
                <div className='p-8 sm:ml-72'>
                    <h1>Category:</h1>
                    <div>

                    </div>
                </div>
            </div>
        </>
    );
};

