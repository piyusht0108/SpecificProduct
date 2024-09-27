import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import SimilarProductItem from '../SimilarProductItem'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failed: 'FAILED',
  inProgress: 'IN_PROGRESS',
  initial: 'INITIAL',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: [],
    similarProducts: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductItem()
  }

  getProductItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const productDetails = {
        id: data.id,
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products,
      }
      const {similarProducts} = productDetails
      const updatedSimilarProducts = similarProducts.map(eachItem => ({
        id: eachItem.id,
        availability: eachItem.availability,
        brand: eachItem.brand,
        description: eachItem.description,
        imageUrl: eachItem.image_url,
        price: eachItem.price,
        rating: eachItem.rating,
        style: eachItem.style,
        title: eachItem.title,
        totalReviews: eachItem.total_reviews,
      }))
      this.setState({
        similarProducts: updatedSimilarProducts,
        productDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failed})
    }
  }

  backToShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrementQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.backToShopping}>
        Continue Shopping
      </button>
    </div>
  )

  renderProductsView = () => {
    const {productDetails, similarProducts, quantity} = this.state

    return (
      <div>
        <Header />
        <div className="product-item-details-body-container">
          <div className="product-details-container">
            <img
              className="product-img"
              src={productDetails.imageUrl}
              alt="product"
            />
            <div className="description-container">
              <h1 className="product-title">{productDetails.title}</h1>
              <p className="price">Rs {productDetails.price}/-</p>
              <div className="rating-review-container">
                <p className="rating-star-container">
                  {productDetails.rating}
                  <BsStarFill className="star-icon" />
                </p>
                <p className="reviews">{productDetails.totalReviews} Reviews</p>
              </div>
              <p className="description">{productDetails.description}</p>
              <div className="availability">
                Available:
                <p className="available-value">{productDetails.availability}</p>
              </div>
              <div className="availability">
                Brand:
                <p className="available-value">{productDetails.brand}</p>
              </div>
              <hr className="horizontal-rule" />
              <div className="quantity-container">
                <button
                  type="button"
                  className="quantity-control-button"
                  onClick={this.onDecrementQuantity}
                  data-testid="minus"
                >
                  <BsDashSquare className="control-icon" />
                </button>
                <p className="quantity-value">{quantity}</p>
                <button
                  type="button"
                  className="quantity-control-button"
                  onClick={this.onIncrementQuantity}
                  data-testid="plus"
                >
                  <BsPlusSquare className="control-icon" />
                </button>
              </div>
              <button type="button" className="add-to-cart-button">
                ADD TO CART
              </button>
            </div>
          </div>
          <div className="similar-products-container">
            <h1>Similiar Products</h1>
            <ul className="similar-product-list-container">
              {similarProducts.map(eachItem => (
                <SimilarProductItem key={eachItem.id} details={eachItem} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsView()
      case apiStatusConstants.failed:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
}

export default ProductItemDetails
