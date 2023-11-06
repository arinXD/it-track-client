import Image from 'next/image'
import { TablePagination } from './components'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

async function getData() {
    const res = await fetch("http://localhost:4000/users", { next: { revalidate: 3600 } })
    const data = await res.json()

    if (!res.ok) {
        return [{ "message": "cant fetch" }]
    }

    return data.users
}

export default async function Home() {
    const users = await getData()
    return (
        <>
            <header>
                <Navbar />
            </header>
            <Sidebar />
            <main className='mt-16'> {/* เว้น nav */}
                <section className='p-8 sm:ml-72'> {/* เว้น side bar */}
                    <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span className="sr-only">Open sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                    </button>
                    <div>
                        <div>
                            <TablePagination data={users} />
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
