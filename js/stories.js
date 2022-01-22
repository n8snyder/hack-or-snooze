'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();

	putStoriesOnPage(storyList.stories, $allStoriesList);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);
	const favoriteStory =
		currentUser &&
		currentUser.favorites.find(favStory => story.storyId === favStory.storyId);
	const starClass = favoriteStory === undefined ? 'far' : 'fas';
	const hostName = story.getHostName();

	return $(`
      <li id="${story.storyId}">
      <span class="embed"></span>
      <span class="star"><i class="${starClass} fa-star"></i></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

async function putStoriesOnPage(
	stories = storyList.stories,
	target = $allStoriesList
) {
	console.debug('putStoriesOnPage');

	target.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of stories) {
		const $story = generateStoryMarkup(story);
		target.append($story);
	}

	target.show();

	await getEmbedsAndDisplay();
}

/**
 * Gets oembed for each story and injects it into HTML
 */

async function getEmbedsAndDisplay() {
	for (let story of storyList.stories) {
		console.log(storyList.stories.length);

		try {
			await story.getOembed();
		} catch {
			console.log('ERROR: storyId:', story.storyId);
			continue;
		}

		if ($(`li#${story.storyId} .embed`).children().length === 0) {
			$(`#${story.storyId} .embed`).append(story.oEmbed);
			console.log('Finished embedding');
		}
	}
}

/**
 * On story form submission, get form data and add new story
 */

async function submitNewStory(evt) {
	evt.preventDefault();
	let title = $('#story-title').val();
	let author = $('#story-author').val();
	let url = $('#story-url').val();
	let newStory = { title, author, url };

	console.log(newStory);
	await storyList.addStory(currentUser, newStory);

	console.log(storyList);
	putStoriesOnPage(storyList.stories, $allStoriesList);

	$storyForm.slideUp().trigger('reset');
}

$storyForm.on('submit', submitNewStory);

/** Add/Remove story from user's favorites on clicking star */

async function toggleFavorite(evt) {
	console.debug('toggleFavorite', evt);
	if (currentUser === undefined) return;

	const $starClicked = $(evt.target);
	const storyId = $starClicked.closest('li').attr('id');
	const story = await Story.getStory(storyId);

	if ($starClicked.hasClass('far')) {
		// Favoriting
		await currentUser.addFavorite(story);
		$starClicked.addClass('fas').removeClass('far');
	} else if ($starClicked.hasClass('fas')) {
		// Unfavoriting
		await currentUser.removeFavorite(story);
		$starClicked.addClass('far').removeClass('fas');
	}
}

$body.on('click', '.star', toggleFavorite);
