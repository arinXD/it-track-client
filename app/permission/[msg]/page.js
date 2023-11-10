import React from 'react'

const PagePermission = async ({ params }) => {
    const msg = params.msg
    return (
        <div>
            <p>
                คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
            </p>
            <p>กรุณาเข้าสู่ระบบด้วย {msg}</p>
        </div>
    )
}

export default PagePermission