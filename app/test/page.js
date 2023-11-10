import { SignUp } from '../components';
import { con } from "../db/index"
const Page = async () => {

    async function create(data) {
        "use server"
        console.log(data);
        try {
            con.query(
                `INSERT INTO student (stu_id, email, password, fname, lname)
                VALUES ('${data.stuId}', '${data.email}', '${data.password}', '${data.fname}', '${data.lname}')`,
                function (err, results, fields) {
                    if (err) {
                        console.log("error:---------------------------");
                        console.log(err.code);
                        return err.code;
                    }
                    console.log(results);
                    console.log(fields);
                }
            );
        } catch (err) {
            throw err
        }

    }

    return (
        <>
            <div>test</div>
            <SignUp create={create} />
        </>
    )
}

export default Page