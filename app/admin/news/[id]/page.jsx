import EditNews from "./EditNews"

const Page = ({ params }) => {
     const { id } = params
     return (
          <div>
               <EditNews
                    id={id}
               />
          </div>
     )
}

export default Page