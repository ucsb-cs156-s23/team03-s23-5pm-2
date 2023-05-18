import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import BookForm from "main/components/Books/BookForm";
import { useNavigate } from "react-router-dom";
import { bookUtils} from "main/utils/bookUtils";

const BookCreatePage = () => {
    let navigate = useNavigate();

    const onSubmit = async (formData) => {
        const createdBook = bookUtils.add(formData);
        console.log("createdBook: ", JSON.stringify(createdBook));
        navigate("/books");
    }

    return (
        <BasicLayout>
            <div className="pt-2 pb-3">
                <h1>Create New Book</h1>
                <BookForm submitAction={onSubmit} />
            </div>
        </BasicLayout>
    )
}

export default BookCreatePage;