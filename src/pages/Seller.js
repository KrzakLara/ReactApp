import React, { Component } from "react"; // ES6 Module import
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import "./Seller.css";

//Lo2: class-based component
class Seller extends Component {
  //class based component (ES6)
  constructor(props) {
    super(props);
    // LO1: State in a class-based props (ES5)
    this.state = {
      sellers: [],
      searchTerm: "",
      sortField: "id",
      sortOrder: "asc",
      currentPage: 1,
      sellersPerPage: 10, 
    };

    // LO1: Binding methods in ES5 class
    this.handleItemsPerPageChange = this.handleItemsPerPageChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSortFieldChange = this.handleSortFieldChange.bind(this);
    this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
  }

  // LO1: Lifecycle method (componentDidMount = async () => {
    //lo1: DOM: The componentDidMount lifecycle method is used 
    // to execute code after a React component is inserted into the DOM.
    componentDidMount() {
      var token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzcXdlYXNkIiwiaWF0IjoxNzM4MzUyMDI4LCJleHAiOjE3MzgzNTU2Mjh9.-ddITJF8Fk-JZ7RgrSJhuga58YxA9MG_Vn6aUXietFM";
      localStorage.setItem("token", token); //regular function
      this.fetchSellers();
    }

  // LO1: Regular functions instead of arrow functions
  //lo1: DOM: indirectly manipulates the DOM by re-rendering components whenever state updates.
  fetchSellers() {
    var self = this; // ES5: Use `self` to retain reference to `this` + var 
    fetch("http://localhost:3000/Seller", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // LO1:ES5: string connection with +
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to fetch sellers");
        }
        return response.json();
      })
      .then(function (data) {
        self.setState({ sellers: data }); // ES5: Use `self` to access `this`
      })
      .catch(function (error) {
        console.error("Error fetching sellers:", error);
      });
  }

  // LO1: Event Handlers using regular functions
  handleItemsPerPageChange(e) {
    //lo1: setState (es5)
    this.setState({ sellersPerPage: Number(e.target.value), currentPage: 1 });
  }

  handleSearchChange(e) {
    this.setState({ searchTerm: e.target.value });
  }

  handleSortFieldChange(e) {
    this.setState({ sortField: e.target.value });
  }

  handleSortOrderChange(e) {
    this.setState({ sortOrder: e.target.value });
  }

  // LO1: Regular functions for logic
  getSortedSellers() {
    var searchTerm = this.state.searchTerm.toLowerCase(); // ES5: Use `var`
    var sellers = this.state.sellers;

    // ES5: Use regular functions in array methods
    var filteredSellers = sellers.filter(function (seller) {
      return (
        (seller.name + " " + seller.surname).toLowerCase().includes(searchTerm)
      );
    });

    var sortField = this.state.sortField;
    var sortOrder = this.state.sortOrder;

    filteredSellers.sort(function (a, b) {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filteredSellers;
  }

  getCurrentSellers(sortedSellers) {
    var indexOfLastSeller = this.state.currentPage * this.state.sellersPerPage;
    var indexOfFirstSeller = indexOfLastSeller - this.state.sellersPerPage;
    return sortedSellers.slice(indexOfFirstSeller, indexOfLastSeller);
  }

  getPageNumbers(totalPages) {
    var currentPage = this.state.currentPage;
    var start = Math.max(1, currentPage - 2);
    var end = Math.min(totalPages, start + 4);
    var pages = [];
    for (var i = start; i <= end; i++) {
      pages.push(i); // ES5: Use `for` loop instead of modern array methods
    }
    return pages;
  }

  // LO2: Render method in ES5 class
  render() {
    var sortedSellers = this.getSortedSellers();
    var currentSellers = this.getCurrentSellers(sortedSellers);
    var totalPages = Math.ceil(sortedSellers.length / this.state.sellersPerPage);

    return (
      <div className="seller-container">
        <h1 className="text-center my-4">Sellers</h1>

        <div className="mb-3 d-flex justify-content-between align-items-center">
          <InputGroup className="w-50">
            <Form.Control
              type="text"
              placeholder="Search sellers..."
              value={this.state.searchTerm}
              onChange={this.handleSearchChange}
            />
          </InputGroup>

          <div className="d-flex gap-3">
            <Form.Select
              onChange={this.handleSortFieldChange}
              aria-label="Sort Field"
            >
              <option value="id">Sort by ID</option>
              <option value="name">Sort by Name</option>
              <option value="surname">Sort by Surname</option>
            </Form.Select>
            <Form.Select
              onChange={this.handleSortOrderChange}
              aria-label="Sort Order"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Form.Select>
            <div className="pagination-controls">
              <label>Items per page:</label>
              <Form.Select
                value={this.state.sellersPerPage}
                onChange={this.handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </Form.Select>
            </div>
          </div>
        </div>

        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Permanent Employee</th>
            </tr>
          </thead>
          <tbody>
            {currentSellers.map(function (seller) {
              // ES5: Use regular function syntax for `map`
              return (
                <tr key={seller.id}>
                  <td>{seller.id}</td>
                  <td>{seller.name}</td>
                  <td>{seller.surname}</td>
                  <td>{seller.permanentEmployee ? "Yes" : "No"}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button
            onClick={() =>
              this.setState({
                currentPage: Math.max(this.state.currentPage - 1, 1),
              })
            }
            disabled={this.state.currentPage === 1}
            variant="outline-primary"
          >
            Previous
          </Button>

          <div>
            {this.getPageNumbers(totalPages).map(function (number) {
              return (
                <Button
                  key={number}
                  onClick={() => this.setState({ currentPage: number })}
                  className={`mx-1 ${
                    number === this.state.currentPage ? "active" : ""
                  }`}
                  variant="outline-secondary"
                >
                  {number}
                </Button>
              );
            }, this)}
          </div>

          <Button
            onClick={() =>
              this.setState({
                currentPage: Math.min(this.state.currentPage + 1, totalPages),
              })
            }
            disabled={this.state.currentPage === totalPages}
            variant="outline-primary"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
}

export default Seller;
