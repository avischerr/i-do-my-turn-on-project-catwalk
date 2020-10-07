import React, { Component } from 'react';
import dummyData from './dummyData.js';
import ReviewList from './ReviewList.jsx';
import OneReview from './OneReview.jsx';
import RatingSum from './RatingSum.jsx';
import AddReview from './AddReview.jsx';
import RatingBreakdown from './RatingBreakdown.jsx'
import axios from 'axios';
import { Grid } from '@material-ui/core';


class ReviewsApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: dummyData,
      showReviews: 0,
      addButton: false,
      productId: 3,
      metaData: null,
      reviewData: null,
      page: 1
    };

    //binding of methods
    this.getReviews = this.getReviews.bind(this);
    this.getNextReviews = this.getNextReviews.bind(this);
    // this.addReview = this.addReview.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleMoreReviews = this.handleMoreReviews.bind(this);

  }

  componentDidMount() {
    this.getReviews();
  }

  //post a review
  // addReview() {
  //   axios.post()
  //     .then()
  //     .catch()
  // }

  //get a review
  getReviews() {
    var nextReview = this.state.page + 1;
    const meta = axios.get(`http://18.224.37.110/reviews/meta/?product_id=${this.state.productId}`);
    const reviews = axios.get(`http://18.224.37.110/reviews/?product_id=${this.state.productId}&count=2&page=${this.state.page}`);
    const next = axios.get(`http://18.224.37.110/reviews/?product_id=${this.state.productId}&count=2&page=${nextReview}`);
    axios.all([meta, reviews, next]).then(axios.spread((...results) => {
      this.setState({
        metaData: results[0].data.ratings,
        reviewData: results[1].data.results,
        page: nextReview
      })
      console.log('this is the reviewData first axios', this.state.reviewData);
      console.log('this is the meta data', this.state.metaData);
      console.log('this is the page' , this.state.page);
    }))
      .catch((error) => {
        console.log(error);
      })
  }

  getNextReviews() {
    var nextReview = this.state.page + 1;
    const reviews = axios.get(`http://18.224.37.110/reviews/?product_id=${this.state.productId}&count=2&page=${this.state.page}`);
    const next = axios.get(`http://18.224.37.110/reviews/?product_id=${this.state.productId}&count=2&page=${nextReview}`);
    axios.all([reviews, next]).then(axios.spread((...results) => {
      this.setState({
        reviewData: [...this.state.reviewData, ...results[0].data.results],
        page: nextReview
      })
      console.log(this.state.reviewData);
    }))
    .catch((error) => {
      console.log(error);
    })
  }

  handleMoreReviews() {
    this.getNextReviews();
  }

  handleAdd(event) {
    this.setState({addButton: true})
  }

  // handleReviews() {
  //   console.log("you clicked the button")
  //   this.setState({
  //     showReviews:
  //       this.state.showReviews >= this.state.product.length ?
  //         this.state.showReviews : this.state.showReviews + 1
  //   })
  // }

  render() {

    return (
      <div>
        <Grid container spacing={2}>
          {/* <Grid item xs={12}>
            <RatingBreakdown />
          </Grid> */}
          <Grid item xs={2}>

          </Grid>
          <Grid item xs={2}>
            Ratings and Reviews
        <RatingSum ratings={this.state.product} />
        <RatingBreakdown />
          </Grid>
          <Grid item xs={6}>
            {/* This is are being sorted by relevance */}
            <ReviewList reviews={this.state.product} count={this.state.showReviews}/>
          </Grid>
          <Grid item xs={2}>

          </Grid>
          <Grid item xs={5}>

          </Grid>
          <Grid item xs={2}>
            {/* When the button is clicked, the rest of the reviews display */}
            <button id="reviewButtons" onClick={this.handleMoreReviews}>MORE REVIEWS</button>
          </Grid>
          <Grid item xs={2}>
            {/* when button clicked make a modal popup */}
            <button id="reviewButtons" onClick={this.handleAdd}>ADD A REVIEW +</button>
          </Grid>
          <Grid>
            {this.state.addButton === true ? <AddReview /> : null}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default ReviewsApp;