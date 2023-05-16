import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import BookForm from "main/components/Books/BookForm";
import { useBackendMutation, useBackend } from "main/utils/useBackend";
import { toast } from 'react-toastify';
import { Navigate } from "react-router-dom";

const BookEditPage = () => {
    let { id } = useParams();

    const { data: book, error, status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/books?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/books`,
        params: {
          id
        }
      }
    );

    const objectToAxiosPutParams = (book) => ({
        url: "/api/books",
        method: "PUT",
        params: {
            id: book.id,
        },
        data: {
            title: book.title,
            author: book.author,
            date: book.date
        }
    });

    const onSuccess = (book) => {
        toast.success(`Book Updated - id: ${book.id} title: ${book.title}`, {position: toast.POSITION.TOP_RIGHT});
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/books?id=${id}`]
    )
    const {isSuccess} = mutation

    if (isSuccess) {
        return <Navigate to="/books/list"/>
    }

    const onSubmit = async (formData) => {
        mutation.mutate(formData);
    }

    return (
        <BasicLayout>
            <div className="pt-2 pb-3">
                <h1>Edit Book</h1>
                {book && 
                <BookForm submitAction={onSubmit} buttonLabel="Update" initialContents={book} /> 
                }
            </div>
        </BasicLayout>
    )
}

export default BookEditPage;