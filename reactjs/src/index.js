import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Link} from "./route/Router.js"
import "./index.css"

class App extends React.Component {

	constructor(){
		super();
		this.state = {}
		Router.register(this);
	}

	load(state){
		console.debug('m=app.load, state=%o', state);
		this.setState({page: state.page})
	}

	componentDidMount(){
		if (window.document.location.pathname === '/'){
			Router.pushAndLoad({
				page: <ArticlePage id="south-america" />,
				title: "South America",
				path: "/page/continent/south-america"
			});
		} else{
			var path = document.location.pathname;
			var id = path.substring(path.lastIndexOf('/') + 1)
			Router.pushAndLoad({
				page: <ArticlePage id={id} />,
				title: "South America",
				path: path
			});
		}
	}

	render(){
		return (
		<div className="container">
			<ul>
				<li><Link href="/page/continent/africa" page={<ArticlePage id="africa" />} >Africa</Link></li>
				<li><Link href="/page/continent/asia" page={<ArticlePage id="asia" />} >Asia</Link></li>
				<li><Link href="/page/continent/europe" page={<ArticlePage id="europe" /> }>Europe</Link></li>
				<li><Link href="/page/continent/north-america" page={<ArticlePage id="north-america" />} >North America</Link></li>
				<li><Link href="/page/continent/oceania" page={<ArticlePage id="oceania" />}>Oceania</Link></li>
				<li><Link href="/page/continent/south-america" page={<ArticlePage id="south-america" />}>South America</Link></li>
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
		fetch(`http://localhost:3030/data/` + id)
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