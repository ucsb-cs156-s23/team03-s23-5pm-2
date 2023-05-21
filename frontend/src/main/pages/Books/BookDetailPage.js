import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import BookTable from 'main/components/Books/BookTable';
import { useBackend } from "main/utils/useBackend";
import { useCurrentUser } from 'main/utils/currentUser';

export default function BookDetailPage() {
  let { id } = useParams();

  const currentUser = useCurrentUser();

  const { data: book, error: _error, status: _status } =
  useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/books/detail/${id}`],
    { method: "GET", url: `/api/books?id=${id}` },
    []
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Book Details</h1>
        <BookTable books={[book]} currentUser={currentUser} actionVisible={false} />
      </div>
    </BasicLayout>
  )
}