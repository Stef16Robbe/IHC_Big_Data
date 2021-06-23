import React from 'react';
import './NavBar.css';

export const Navbar: React.VoidFunctionComponent = () => {

	return (
		<nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
			<a className="navbar-brand" href="/">
				<img src="https://www.royalihc.com/assets/toolkit/images/logo.png" alt="logo ihc" />
			</a>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>

			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
				<li className="nav-item active">
					<a className="nav-link" href="/">Home</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="/upload">Upload File</a>
				</li>
				<li className="nav-item">
					<a className="nav-link" href="/predict-delivery-date">Predict delivery date</a>
				</li>
				</ul>
			</div>
		</nav>
	);
}

export default Navbar;
