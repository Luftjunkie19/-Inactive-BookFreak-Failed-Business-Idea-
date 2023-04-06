import './EditBook.css';

import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Timestamp } from 'firebase/firestore';
import { FaBookOpen } from 'react-icons/fa';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Loader from '../components/Loader';
import { useDocument } from '../hooks/useDocument';
import { useFirestore } from '../hooks/useFirestore';

function EditBook() {
  const { id } = useParams();
  const { document } = useDocument("books", id);
  const { updateDocument } = useFirestore("books");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pagesNumber, setPagesNumber] = useState(1);
  const [readPages, setReadPages] = useState(0);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isRecommendable, setIsRecommendable] = useState(false);

  const recensionArea = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setAuthor(document.author);
      setPagesNumber(document.pagesNumber);
      setReadPages(document.readPages);
    }
  }, [document]);

  useEffect(() => {
    if (document) {
      recensionArea.current.value = document.recension.content;
    }

    if (readPages === pagesNumber) {
      recensionArea.current.disabled = false;
      recensionArea.current.placeholder = "Now you can type your recension 😄";
    } else {
      recensionArea.current.disabled = true;
      recensionArea.current.placeholder =
        "So long the book won't have the book read, so long will you wait to give a recension 😋.";
      recensionArea.current.value = "";
      setIsRecommendable(false);
    }
  }, [readPages, pagesNumber, document]);

  const conditionArea = readPages === pagesNumber;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      if (readPages > pagesNumber) {
        setError(
          "The number of read pages cannot be bigger than the number of book's pages."
        );
        setIsPending(false);
        return;
      }

      const recensionValue = recensionArea.current.value;

      await updateDocument(id, {
        title: title,
        author: author,
        pagesNumber: pagesNumber,
        readPages: readPages,
        isRecommendable,
        recension: {
          content: recensionValue,
          timeOfRecension: Timestamp.fromDate(new Date()),
        },
      });

      setError(null);
      setIsPending(false);
      toast.success("Book updated successfully");
      navigate(`/book/${id}`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleUpdate}>
        <h2>Update your book</h2>
        <FaBookOpen className="book-form-icon" />
        <p>Wanna add some changes? Here you are !</p>
        <label>
          <span>Title: </span>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          <span>Author: </span>
          <input
            type="text"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </label>
        <label>
          <span>Pages number: </span>
          <input
            type="number"
            min={1}
            required
            value={pagesNumber}
            onChange={(e) => setPagesNumber(+e.target.value)}
          />
        </label>
        <label>
          <span>Read pages: </span>
          <input
            type="number"
            required
            min={0}
            value={readPages}
            onChange={(e) => setReadPages(+e.target.value)}
          />
        </label>

        <label>
          <span>Recension:</span>
          <textarea ref={recensionArea}></textarea>
        </label>

        {conditionArea && (
          <div className="condition-area">
            <h2>Is this book recomendable?</h2>
            <div className="pages-buttons">
              <button
                className={`btn yes ${isRecommendable ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsRecommendable(true);
                }}
              >
                Yes
              </button>
              <button
                className={`btn no ${!isRecommendable ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsRecommendable(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button className="btn">Update book</button>
      </form>

      {isPending && <Loader />}
    </>
  );
}

export default EditBook;
