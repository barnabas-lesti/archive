import React, { Component } from 'react';
import classNames from 'classnames';
import urlJoin from 'url-join';

import Icon, { Icons } from './Icon';

export default class Header extends Component {
	constructor () {
		super();

		this.state = {
			isMobileMenuOpen: false,
		};

		this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
	}

	toggleMobileMenu () {
		this.setState(state => {
			return { isMobileMenuOpen: !state.isMobileMenuOpen };
		});
	}

	render() {
		const {
			isMobileMenuOpen
		} = this.state;
		const {
			menuItems,
			baseHref,
			siteLogoUrl,
		} = this.props;
		return (
			<header className="Header">
				{siteLogoUrl &&
					<a className="Header_logo" href={urlJoin(baseHref)}>
						<img src={siteLogoUrl} alt="Site logo" />
					</a>
				}
				<div
					className={classNames(
						'Header_icon Header_icon-burger',
						{ 'hiddenSm': isMobileMenuOpen }
					)}
					onClick={this.toggleMobileMenu}
				>
					<Icon icon={Icons.BURGER} />
				</div>
				<div
					className={classNames(
						'Header_icon Header_icon-close',
						{ 'hiddenSm': !isMobileMenuOpen }
					)}
					onClick={this.toggleMobileMenu}
				>
					<Icon icon={Icons.CLOSE} />
				</div>

				<ul className={classNames(
					'Header_links',
					{ 'hiddenSm': !isMobileMenuOpen }
				)}>
					{menuItems && menuItems.map((menuItem, index) =>
						<li key={index}>
							<a href={urlJoin(baseHref, menuItem.path)}>{menuItem.label}</a>
						</li>
					)}
				</ul>
			</header>
		);
	}
}
