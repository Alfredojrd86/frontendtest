import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

function Dashboard() {
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      fetchComments();
    }
  }, [navigate]);

  const fetchComments = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const openModal = (comment) => {
    setSelectedComment(comment);
  };

  const closeModal = () => {
    setSelectedComment(null);
  };

  // Get current comments
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <div className="dashboard">
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div style={{ visibility: 'hidden', width: '70px' }}>Spacer</div>
          <Navbar.Brand className="m-0">Pro Dashboard</Navbar.Brand>
          <Button
            variant="outline-danger"
            onClick={handleLogout}
            style={{ width: '70px' }}
          >
            Logout
          </Button>
        </Container>
      </Navbar>
      <Container className="table-container">
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentComments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{comment.name}</td>
                  <td>{comment.email}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => openModal(comment)}>
                      👁️ View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-container d-flex justify-content-center align-items-center mt-4">
          <div className="pagination">
            <button
              className="pagination-arrow"
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            {getPageNumbers().map((number) => (
              <button
                key={number}
                className={`pagination-number ${number === currentPage ? 'current' : ''}`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            <button
              className="pagination-arrow"
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          Page {currentPage} of {totalPages}
        </div>
      </Container>
      {selectedComment && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Comment Details</h2>
            <p><strong>ID:</strong> {selectedComment.id}</p>
            <p><strong>Name:</strong> {selectedComment.name}</p>
            <p><strong>Email:</strong> {selectedComment.email}</p>
            <p><strong>Body:</strong> {selectedComment.body}</p>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
