import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Link} from "./route/Router.js"
import "./index.css"

class App extends React.Component {

	constructor(){
		super();
		this.state = {}
		Router.register(this, {
			'ArticlePage': (data) => {
				console.debug('m=ArticlePage, state=%o', this);
				this.setState({page: <ArticlePage id={data.id} />})
			}
		});
	}

	/**
	 * Router try to invoke the right handler then call this method to reponse a feedback
	 */ 
	load(state, loaded){
		console.debug('m=App.load, state=%o, loaded=%s', state, loaded);
	}

	componentDidMount(){
		Router.start({
			page: 'ArticlePage',
			data: {id: 'south-america'},
			title: "South America",
			path: "/page/continent/south-america"
		});
	}

	render(){
		return (
		<div className="container">
			<ul>
				<li><Link title="Africa" href="/page/continent/africa" page="ArticlePage" data={{id: "africa"}} >Africa</Link></li>
				<li><Link title="Asia" href="/page/continent/asia" page="ArticlePage" data={{id: "asia"}} >Asia</Link></li>
				<li><Link title="Europe" href="/page/continent/europe" page="ArticlePage" data={{id: "europe"}} >Europe</Link></li>
				<li><Link title="North America" href="/page/continent/north-america" data={{id: "north-america"}} >North America</Link></li>
				<li><Link title="Oceania" href="/page/continent/oceania" page="ArticlePage" data={{id: "oceania"}} >Oceania</Link></li>
				<li><Link title="South America" href="/page/continent/south-america" page="ArticlePage" data={{id: "south-america"}} >South America</Link></li>
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
		.then(result=>result.text())
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