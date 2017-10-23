import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Link} from "./route/Router.js"
import Locator from "./Locator.js"
import "./index.css"

import PostList from "./page/Post.js"
import UserList from "./page/User.js"


window.Locator = Locator;

class App extends React.Component {

	constructor(){
		super();
		this.state = {}
		Router.register(this, {
			'^/page/continent/([\\w-]+)': (data) => {
				console.debug('m=ArticlePage, state=%o', this);
				this.setState({page: <ArticlePage id={data.pathVar[0]} />})
			},
			'^/$': (data) => {
				console.debug('m=Home, state=%o', this);
				this.setState({page: <ArticlePage id="south-america" />})
			},
			'^/posts' : (state) => {
				this.setState({page: <PostList />});
			},
			'^/users' : (state) => {
				this.setState({page: <UserList />});
			},
			'404' : (state) => {
				this.setState({page: 'Not Found'});
			}
		});
	}

	/**
	 * Router try to invoke the right handler then call this method to reponse a feedback
	 */ 
	load(state){
		console.debug('m=App.load, state=%o, loaded=%s', state);
		this.setState({page: state.page});
	}

	componentDidMount(){
		Router.start();
	}

	render(){
		return (
		<div className="container">
			Continents
			<ul className="menu">
				<li><Link title="Home" href="/" >Home</Link></li>
				<li><Link title="Posts" href="/posts/" >Posts</Link></li>
				<li><Link title="Users" href="/users/" >Users</Link></li>
				<li><Link title="Africa" href="/page/continent/africa" >Africa</Link></li>
				<li><Link title="Asia" href="/page/continent/asia" >Asia</Link></li>
				<li><Link title="Europe" href="/page/continent/europe" >Europe</Link></li>
				<li><Link title="North America" href="/page/continent/north-america" >North America</Link></li>
				<li><Link title="Oceania" href="/page/continent/oceania" >Oceania</Link></li>
				<li><Link title="South America" href="/page/continent/south-america" >South America</Link></li>
			</ul>
			<div style={{background: "#F2F2F2", minHeight: 100, marginTop: 20}}>
				{this.state.page}
			</div>
		</div>
		)
	}
}

class ArticlePage extends React.Component {

	constructor(props){
		super()
		this.props = props;
		this.state = {};
		console.debug('m=article, props=%o', this.props);
	}

	componentDidMount(){
		console.debug('m=componentDidMount');
		this.load(this.props.id);
	}

	componentWillReceiveProps(nextProps){
		console.debug('m=componentWillReceiveProps');
		this.load(nextProps.id);
	}

	load(id){
		fetch(`/data/` + id)
		.then(result=> {
			console.debug('result=%o', result);
			return result.text()
		})
		.then(content => {
			console.debug('m=loadPage, status=done');
			this.setState({content})
		})
	}
	render() {
		return (
		 <div className="content" dangerouslySetInnerHTML={{__html: this.state.content}} ></div>
		);
	}
}


ReactDOM.render(
	<center><App /></center>,
	document.getElementById('root')
);