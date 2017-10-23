import React, { Component } from "react"
import { Link } from "../route/Router.js"

export default class PostList extends Component {

	constructor(){
		super();
		this.state = {items:[]}
		console.debug('articles=constructor');
	}

	componentDidMount(){
		fetch(window.Locator.JSON_PLACE_HOLDER.solve(`/posts`))
		.then(result => result.json())
		.then(items => this.setState({items: items}))
		console.debug('articles=componentDidMount');
	}

	render(){
		return (
			<ul>{
				this.state.items.map((v, k) => {
					return <li key={k} ><Link href={"/page/posts/" + v.id} >{v.title}</Link></li>
				})
			}</ul>
		)
	}

}

export class Post extends Component {

	constructor(props){
		super();
		this.state = {article: {}}
		console.debug('article=constructor');
	}

	componentDidMount(){
		fetch(window.Locator.JSON_REPLACE_HOLDER.solve(`/posts/` + this.props.id))
		.then(result => result.json())
		.then(items => this.setState({article: items}))
		console.debug('article=componentDidMount');
	}

	render(){
		return (
			<div>
				<h1>{this.state.article.title}</h1>
				<p>{this.state.article.body}</p>
			</div>
		)
	}

}
