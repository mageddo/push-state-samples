import React, { Component } from "react"
import { Link } from "../route/Router.js"

export default class PostList extends Component {

	constructor(){
		super();
		this.state = {items:[]}
		console.debug('postList=constructor');
	}

	componentDidMount(){
		fetch(window.Locator.JSON_PLACE_HOLDER.solve(`/posts`))
		.then(result => result.json())
		.then(items => this.setState({items: items}))
		console.debug('postList=componentDidMount');
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
		this.props = props;
		this.state = {post: {}};
		console.debug('post=constructor, props=%o', props);
	}

	componentDidMount(){
		fetch(window.Locator.JSON_PLACE_HOLDER.solve(`/posts/` + this.props.id))
		.then(result => result.json())
		.then(item => this.setState({post: item}))
		console.debug('post=componentDidMount, id=%o', this.props.id);
	}

	render(){
		return (
			<div>
				<h1>{this.state.post.title}</h1>
				<p>{this.state.post.body}</p>
			</div>
		)
	}

}
