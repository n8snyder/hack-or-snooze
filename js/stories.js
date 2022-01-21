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

	//TODO: check star status and conditionally change class
	const hostName = story.getHostName();
	return $(`
      <li id="${story.storyId}">
      <span class="star"><i class="far fa-star"></i></span>
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

function putStoriesOnPage(stories, target) {
	console.debug('putStoriesOnPage');

	target.empty();

	// loop through all of our stories and generate HTML for them
	for (let story of stories) {
		const $story = generateStoryMarkup(story);
		target.append($story);
	}

	target.show();
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
	const storyId = $(evt.target).parent().parent().attr('id');
	const story = storyList.stories.find(s => s.storyId === storyId);

	if ($(evt.target).hasClass('far')) {
		// Favoriting
		await currentUser.addFavorite(story);
		$(evt.target).addClass('fas').removeClass('far');
	} else if ($(evt.target).hasClass('fas')) {
		// Unfavoriting
		await currentUser.removeFavorite(story);
		$(evt.target).addClass('far').removeClass('fas');
	}
}

$allStoriesList.on('click', '.star', toggleFavorite);
