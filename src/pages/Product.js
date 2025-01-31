//lo2: modules (import)
import React, { Component } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import "./Product.css";

//Lo2: class-based component
class Product extends Component {
  //class based component (ES6)
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      searchTerm: "",
      sortField: "id",
      sortOrder: "asc",
      currentPage: 1,
      productsPerPage: 10, 
    };
  }

  //lo2:const
  componentDidMount() {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzcXdlYXNkIiwiaWF0IjoxNzM4MzUyMDI4LCJleHAiOjE3MzgzNTU2Mjh9.-ddITJF8Fk-JZ7RgrSJhuga58YxA9MG_Vn6aUXietFM";
    localStorage.setItem("token", token);

    this.fetchProducts();
  }

  //lo2: => + emplate Literals ${}
  fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/Product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      this.setState({ products: data });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  //lo2: =>
  handleItemsPerPageChange = (e) => {
    this.setState({ productsPerPage: Number(e.target.value), currentPage: 1 });
  };

  handleSortFieldChange = (e) => {
    this.setState({ sortField: e.target.value });
  };

  handleSortOrderChange = (e) => {
    this.setState({ sortOrder: e.target.value });
  };

  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  getSortedProducts = () => {
    const { products, searchTerm, sortField, sortOrder } = this.state;

    return products
      .filter((product) =>
        `${product.name} ${product.productNumber} ${product.color} ${product.price}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  };

  getCurrentProducts = (sortedProducts) => {
    const { currentPage, productsPerPage } = this.state;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    return sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  getPageNumbers = (totalPages) => {
    const { currentPage } = this.state;
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  
  render() {
    //Destructuring
    const { productsPerPage, currentPage, sortField, sortOrder } = this.state;
    const sortedProducts = this.getSortedProducts();
    const currentProducts = this.getCurrentProducts(sortedProducts);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    return (
      <div className="product-container">
        <h1 className="text-center my-4">Products</h1>

        <div className="mb-3 d-flex justify-content-between align-items-center">
          {/* Search */}
          <InputGroup className="w-50">
            <Form.Control
              type="text"
              placeholder="Search products..."
              onChange={this.handleSearchChange}
            />
          </InputGroup>

          {/* Sorting */}
          <div className="d-flex gap-3">
            <Form.Select
              value={sortField}
              onChange={this.handleSortFieldChange}
              aria-label="Sort Field"
            >
              <option value="id">Sort by ID</option>
              <option value="name">Sort by Name</option>
              <option value="productNumber">Sort by Product Number</option>
              <option value="price">Sort by Price</option>
            </Form.Select>
            <Form.Select
              value={sortOrder}
              onChange={this.handleSortOrderChange}
              aria-label="Sort Order"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Form.Select>
            {/* Items per page */}
            <div className="pagination-controls">
              <label>Items per page:</label>
              <Form.Select
                value={productsPerPage}
                onChange={this.handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </Form.Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Product Number</th>
              <th>Color</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.productNumber}</td>
                <td>{product.color}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <Button
            onClick={() =>
              this.setState((prev) => ({
                currentPage: Math.max(prev.currentPage - 1, 1),
              }))
            }
            disabled={currentPage === 1}
            variant="outline-primary"
          >
            Previous
          </Button>

          <div>
            {this.getPageNumbers(totalPages).map((number) => (
              <Button
                key={number}
                onClick={() => this.setState({ currentPage: number })}
                //lo2: React Handling CSS Styles 
                className={`mx-1 ${number === currentPage ? "active" : ""}`}
                variant="outline-secondary"
              >
                {number}
              </Button>
            ))}
          </div>

          <Button
            onClick={() =>
              this.setState((prev) => ({
                currentPage: Math.min(prev.currentPage + 1, totalPages),
              }))
            }
            disabled={currentPage === totalPages}
            variant="outline-primary"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }
}
//lo2: modules (export)
export default Product;
