import React from 'react';

export default class Router {

	static map = {};
	static observers = [];

	static _construct = (() => {
		console.debug('constructed!')
		window.onpopstate = function(e){
			var st = e.state;
			console.debug('m=onpopstate, state=%o, e=%o', st, e)
			if (st !== null) {
				Router.getAndLoad(st);
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
		var state = {
			page: page,
			path: e.currentTarget.getAttribute('href'),
			title: e.currentTarget.getAttribute('title')
		};
		Router.pushAndLoad(state);
	}

	static pushAndLoad(state){
		var key = Router.hashCode();
		Router.put(key, state.page);
		var page = state.page;
		window.history.pushState(Object.assign(state, {page: key}), state.title, state.path);
		Router.doLoad(Object.assign(state, {page: page}));
	}

	static getAndLoad(state){
		state.page = Router.get(state.page);
		Router.doLoad(state)
	}
	/**
	 * Call listeners with the passed state
	 */
	static doLoad(state){

		// currently browsers does not consider the pushState title property
		// so we need to set it using document
		window.document.title = state.title;
		Router.observers.forEach(o => {
			console.debug('m=doLoad, status=call-observer, observer=%o', o)
			o.load({
				page: state.page,
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
export class Link extends React.Component {

	constructor(props){
		super();
		this.props = props;
	}

	render(){
		return <a className="load-link" onClick={(e) => Router.load(e, this.props.page)} {...this.props}>{this.props.children}</a>
	}
}