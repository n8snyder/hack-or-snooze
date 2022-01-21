'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	hidePageComponents();
	putStoriesOnPage(storyList.stories, $allStoriesList);
}

$body.on('click', '#nav-all', navAllStories);

/** Show create new story form on click on "submit" */

function navSubmitClick(evt) {
	console.debug('navSubmitClick', evt);
	hidePageComponents();
	putStoriesOnPage(storyList.stories, $allStoriesList);
	$storyForm.show();
}

$body.on('click', '#nav-submit', navSubmitClick);

/** Hide page content and show favorites list view */

function navFavoritesClick(evt) {
	console.debug('navFavoritesClick', evt);
	hidePageComponents();
	putStoriesOnPage(currentUser.favorites, $allFavoritesList);
}

$body.on('click', '#nav-favorites', navFavoritesClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
	console.debug('updateNavOnLogin');
	$('.main-nav-links').show();
	$navLogin.hide();
	$navLogOut.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}
