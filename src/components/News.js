import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './spinner';
import PropTypes from 'prop-types';
import { useState } from 'react';

export class News extends Component {

    static defaultProps = {
        country:'in',
        pageSize:8,
        category:'science'
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize:PropTypes.number,
        category:PropTypes.string
    }
    capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase()+string.slice(1);
    }
    constructor(props){
        super(props);
        this.state = {
            articles:[],
            loading:true,
            page:1,
            totalResults:0
        }
        document.title=`${this.capitalizeFirstLetter(this.props.category)} - FlashNews`;
    }
    async updateNews(){
        this.props.setProgress(10)
        try {
            const url = `https://gnews.io/api/v4/top-headlines?category=${this.props.category}&lang=en&country=${this.props.country}&max=20&apikey=${this.props.apiKey}`;
            this.setState({loading:true});
            let data = await fetch(url);
            this.props.setProgress(30);
            let parsedData = await data.json();
            this.props.setProgress(70);
            this.setState({
                articles:parsedData.articles,
                totalResults:parsedData.totalResults,
                loading:false,
            })
        } catch (error) {
            console.log(error)
        }
        
        this.props.setProgress(100)
    }
    async componentDidMount(){
        this.updateNews()
    }
    handlePrevClick = async () => {
        this.setState({page:this.state.page-1});
        this.updateNews();
    }
    handleNextClick = async () => {
        this.setState({page:this.state.page+1});
        this.updateNews();
    }

    
  render() {
    return (

      <>
        <h1 className='text-center' style={{margin:'35px 0px', marginTop:'90px'}}>FlashNews - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner />}
            <div className='container'>
                <div className='row'>
                    {this.state.articles.map((element) => {
                        return <div className='col-md-4' key = {element.url}>
                            <NewsItem title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,88):""} imageUrl={element.image} newsUrl={element.url} publishTime={element.publishedAt} author={element.author} source={element.source.name}/>
                            </div> 
                    })}
                </div>
            </div>
       </>
    )
  }
}

export default News

