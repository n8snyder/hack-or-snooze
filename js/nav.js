'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	evt.preventDefault();
	hidePageComponents();
	putStoriesOnPage(storyList.stories, $allStoriesList);
}

$body.on('click', '#nav-all', navAllStories);

/** Show create new story form on click on "submit" */

function navSubmitClick(evt) {
	console.debug('navSubmitClick', evt);
	evt.preventDefault();
	hidePageComponents();
	putStoriesOnPage(storyList.stories, $allStoriesList);
	$storyForm.show();
}

$body.on('click', '#nav-submit-story', navSubmitClick);

/** Hide page content and show favorites list view */

function navFavoritesClick(evt) {
	console.debug('navFavoritesClick', evt);
	evt.preventDefault();
	hidePageComponents();
	putStoriesOnPage(currentUser.favorites, $allFavoritesList);
}
// NOTE: If favorites gets more complex, break into new function

$body.on('click', '#nav-favorites', navFavoritesClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	evt.preventDefault();
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
