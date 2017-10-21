import React from 'react';
import ReactDOM from 'react-dom';
import "./index.css"

class Router {

	static map = {};
	static observers = [];

	static _construct = (() => {
		console.debug('constructed!')
		window.onpopstate = function(e){
			var st = e.state;
			console.debug('m=onpopstate, state=%o, e=%o', st, e)
			if (st !== null) {
					Router.doLoad(st);
			} else {
				console.info('No state');
				Router.doLoad({page: null, title: null, path: null});
			}
		}
	})()

	/**
	 * Register listeners to be trigered when a new page must be load
	 * observer - a React.component, the .pushState method will be called when a page must be loaded
	 */
	static register(observer){
		Router.observers.push(observer)
	}

	/**
	 * Register the state and call the page load, this method is recommended to be called in link clicks
	 * @see #Link element
	 * e - the click event
	 * page - react element to be rendered
	 */
	static load(e, page){
		e.preventDefault();
		
		var key = Router.hashCode();
		Router.put(key, page);

		var state = {
			page: key,
			path: e.currentTarget.getAttribute('href'),
			title: e.currentTarget.getAttribute('title')
		};
		window.history.pushState(state, state.title, state.path);
		Router.doLoad(state)
	}

	/**
	 * Call listeners with the passed state
	 */
	static doLoad(state){

		// currently browsers does not consider the pushState title property
		// so we need to set it using document
		document.title = state.title;
		Router.observers.forEach(o => {
			console.debug('m=doLoad, status=call-observer, observer=%o', o)
			o.load({
				_id: 'state.page',
				page: Router.get(state.page),
				title: state.title,
				path: state.path
			})
		})

	}

	/**
	 * Geneate a random hashCode
	 */
	static hashCode = function(){
		return Math.random().toString(16).substring(2);
	}

	/**
	 * put value at the singleton map
	 */
	static put(key, value){
		Router.map[key] = value;
	}

	static get(key){
		return Router.map[key];
	}

}

/**
 * It's prepared to load pages without make a refresh, just provide the URL and the react element at the 'page' property to be renderized
 */ 
class Link extends React.Component {

	constructor(props){
		super();
		this.props = props;
	}

	render(){
		return <a data-title={this.props.title} className="load-link" onClick={(e) => Router.load(e, this.props.page)} {...this.props}>{this.props.children}</a>
	}
};

class App extends React.Component {

	constructor(){
		super();
		this.state = {pageLoad: {page: 'Hi'}}
		Router.register(this);
	}

	load(state){
		console.debug('m=app.load, state=%o', state);
		this.setState({page: state.page})
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
		 <p>{this.state.content}</p>
		);
	}
}


ReactDOM.render(
	<center><App /></center>,
	document.getElementById('root')
);