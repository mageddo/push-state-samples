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
	static register(observer, map){
		Router.observers.push({observer: observer, map: map})
	}

	/**
	 * Register the state and call the page load, this method is recommended to be called in link clicks
	 * @see #Link element
	 * e - the click event
	 * page - react element to be rendered
	 */
	static load(e, page, data){
		e.preventDefault();
		var state = {
			page: page,
			data: data,
			path: e.currentTarget.getAttribute('href'),
			title: e.currentTarget.getAttribute('title')
		};
		console.debug('m=load, e=%o, page=%o', page);
		Router.pushAndLoad(state);
	}

	static pushAndLoad(state){
		window.history.pushState(state, state.title, state.path);
		Router.doLoad(state);
	}

	static getAndLoad(state){
		Router.doLoad(state)
	}
	/**
	 * Call listeners with the passed state
	 */
	static doLoad(state){

		// currently browsers does not consider the pushState title property
		// so we need to set it using document
		// window.document.title = state.title;
		Router.observers.forEach(o => {
			console.debug('m=doLoad, status=call-observer, observer=%o', o)
			var called = Router.invoke(state, o.map);
			if(o.observer.load !== undefined){
				o.observer.load(state, called);
			}
		})
	}

	/**
	 * Call the respective function in map if it exists
	 * The callback will have the state in this variable and the data as parameter
	 * retuns true if found a handler and false if don't
	 */
	static invoke(state, map){
		if(map[state.page]){
			console.debug('m=invoke, status=invoking');
			map[state.page].call(state, state.data);
			return true;
		}else{
			console.debug('m=invoke, status=not-found');
			return false;
		}
	}

	/**
	 * Must be called just after page load to load the the current state of the passed if it does not exists
	 */
	static start(state){
		if(window.history.state !== null){
			Router.doLoad(window.history.state);
		}else {
			Router.doLoad(state);
		}
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
		return <a className="load-link" onClick={(e) => Router.load(e, this.props.page, this.props.data)} {...this.props}>{this.props.children}</a>
	}
}