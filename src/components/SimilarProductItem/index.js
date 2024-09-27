// Write your code here
import {Link} from 'react-router-dom'
import {BsStarFill} from 'react-icons/bs'

import './index.css'

const SimilarProductItem = props => {
  const {details} = props
  const {id, brand, rating, title, imageUrl, price} = details
  return (
    <li className="similar-list-item">
      <Link to={`/products/${id}`} className="similar-product-link">
        <img
          src={imageUrl}
          alt={`similar product ${title}`}
          className="similar-product-img"
        />
        <h1 className="similar-title">{title}</h1>
        <p className="brand-name">by {brand}</p>
        <div className="price-rating-container">
          <p>{price}/-</p>
          <span className="rating-star-container">
            {rating}
            <BsStarFill className="star-icon" />
          </span>
        </div>
      </Link>
    </li>
  )
}

export default SimilarProductItem
