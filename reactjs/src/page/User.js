import React, { Component } from "react"
import { Link } from "../route/Router.js"

export default class UserList extends Component {

	constructor(){
		super();
		this.state = {items: [
			{
				name: "Elvis",
				age: 22
			},
			{
				name: "Bruna",
				age: 21
			}
		]}
		console.debug('articles=constructor');
	}

	render(){
		return (
			<ul>{
				this.state.items.map((v, k) => {
					return <li key={k} ><Link pushstate="false" page={<User user={v} />} href={"/page/users/" + v.name.toLowerCase()} >{v.name}</Link></li>
				})
			}</ul>
		)
	}

}

export class User extends Component {

	constructor(props){
		super();
		this.props = props;
		console.debug('user=constructor, user=%o', this.props);
	}

	render(){
		return (
			<div>
				<h1>{this.props.user.name}</h1>
				<p>{this.props.user.age}</p>
			</div>
		)
	}

}
