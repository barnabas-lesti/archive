import React, { Component } from 'react';
import hljs from 'highlightjs/highlight.pack';

import Listing from '../partials/Listing';


export default class BasicTemplate extends Component {

	componentDidMount () {
		hljs.initHighlightingOnLoad();
	}

	render() {
		const {
			content,
			baseHref,
			subPages,
		} = this.props;
		return (
			<div className="BasicTemplate page container">
				<div className="BasicTemplate_content cmsContent" dangerouslySetInnerHTML={{ __html: content }}></div>
				{subPages &&
					<Listing items={subPages} baseHref={baseHref} />
				}
			</div>
		);
	}
}
