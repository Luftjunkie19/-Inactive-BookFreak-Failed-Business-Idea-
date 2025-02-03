import BookContainer from "components/book/BookContainer";

 function Book({ params }: { params: { bookId: string } }) {
  const { bookId: id } = params;



  return (
    <div className={` overflow-x-hidden h-screen w-full p-2`}>
  <BookContainer id={id}/>
    </div>
  );
}

export default Book;
